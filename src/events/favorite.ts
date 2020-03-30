import { format } from 'util';
import { Logger } from 'winston';

import { IEvent } from '.';

export class FavoriteEvent implements IEvent {

    constructor(
        private logger: Logger,
    ) {
    }

    emit(args: object): void {
        this.logger.info(
            format(
                '@%s Favorited the Tweet by @%s: %s',
                args['user']['screen_name'],
                args['favorited_status']['user']['screen_name'],
                args['favorited_status']['text'],
            ),
        );
    }

}
