import { argv, exit } from 'process';
import { resolve } from 'url';
import { join } from 'path';
import { readFileSync } from 'fs';
import { createInterface } from 'readline';
import { load } from 'js-yaml';
import { createLogger, format, transports } from 'winston';

import { Express } from './services/express';
import { Ngrok } from './services/ngrok';
import { Config } from './models/config';
import { Crc } from './services/crc';
import { Twitter } from './services/twitter';
import { TweetCreateEvent } from './events/tweet-create';
import { TweetDeleteEvent } from './events/tweet-delete';
import { FavoriteEvent } from './events/favorite';
import { FollowEvent } from './events/follow';
import { BlockEvent } from './events/block';
import { MuteEvent } from './events/mute';

const logger = createLogger({
    level: 'info',
    format: format.cli(),
    transports: [
        new transports.Console({
            level: argv.includes('-v') ? 'verbose' : argv.includes('-vvv') ? 'debug' : 'info',
        }),
    ],
});

const yaml = readFileSync(join(__dirname, '..', 'config.yaml'), 'utf8');
const config: Config = load(yaml);

const express = new Express(config, logger);
const ngrok = new Ngrok(config, logger);
const crc = new Crc(config);
const twitter = new Twitter(config, logger);

const events = {
    tweetCreate: new TweetCreateEvent(logger),
    tweetDelete: new TweetDeleteEvent(logger),
    favorite: new FavoriteEvent(logger),
    follow: new FollowEvent(logger),
    block: new BlockEvent(logger),
    mute: new MuteEvent(logger),
};

process.on('SIGINT', () => {
    logger.info('Shutting down');

    (async () => {
        await twitter.unsubscribe();
        await twitter.remove();
        await ngrok.stop();
        await express.stop();

        exit(0);
    })();
});

process.on('exit', () => {
    logger.info('Exiting');
});

if (process.platform === 'win32') {
    createInterface({
        input: process.stdin,
        output: process.stdout,
    })
        .on('SIGINT', () => {
            process.emit('SIGINT' as unknown as 'disconnect');
        });
}

(async () => {
    const stream = await express.start();
    const url = await ngrok.start();

    stream.get.subscribe(context => {
        logger.verbose('The Challenge-Response Checks (CRC) was requested.');

        context.response.json({
            response_token: crc.transform(context.request.query['crc_token']),
        });
    });

    stream.post.subscribe(context => {
        const data = context.request.body;

        data['tweet_create_events']?.forEach(e => events.tweetCreate.emit(e));
        data['tweet_delete_events']?.forEach(e => events.tweetDelete.emit(e));
        data['favorite_events']?.forEach(e => events.favorite.emit(e));
        data['follow_events']?.forEach(e => events.follow.emit(e));
        data['block_events']?.forEach(e => events.block.emit(e));
        data['mute_events']?.forEach(e => events.mute.emit(e));
    });

    await twitter.add(resolve(url, config.http.path));
    await twitter.subscribe();

    logger.info('Ready');
})()
    .then()
    .catch(error => {
        console.error(error);
        exit(1);
    });
