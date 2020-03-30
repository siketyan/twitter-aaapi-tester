import { format } from 'util';
import { Logger } from 'winston';

import { IEvent } from '.';

export class FollowEvent implements IEvent {

    constructor(
        private logger: Logger,
    ) {
    }

    emit(args: object): void {
        this.logger.info(
            format(
                '@%s %sed @%s',
                args['source']['screen_name'],
                args['type'] === 'follow' ? 'Follow' : 'Unfollow',
                args['target']['screen_name'],
            ),
        );
    }

}
