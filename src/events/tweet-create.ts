import { format } from 'util';
import { Logger } from 'winston';

import { IEvent } from '.';

export class TweetCreateEvent implements IEvent {

    constructor(
        private logger: Logger,
    ) {
    }

    emit(args: object): void {
        if (args['retweeted_status']) {
            this.logger.info(
                format(
                    '@%s Retweeted the Tweet by @%s: %s',
                    args['user']['screen_name'],
                    args['retweeted_status']['user']['screen_name'],
                    args['text'],
                ),
            );
        } else if (args['quoted_status']) {
            this.logger.info(
                format(
                    '@%s quoted the Tweet "%s" by @%s: %s',
                    args['user']['screen_name'],
                    args['quoted_status']['text'],
                    args['quoted_status']['user']['screen_name'],
                    args['text'],
                ),
            );
        } else {
            this.logger.info(
                format(
                    '@%s Tweeted: %s',
                    args['user']['screen_name'],
                    args['text'],
                ),
            );
        }
    }

}
