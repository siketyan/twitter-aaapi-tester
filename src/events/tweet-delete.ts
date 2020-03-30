import { format } from 'util';
import { Logger } from 'winston';

import { IEvent } from '.';

export class TweetDeleteEvent implements IEvent {

    constructor(
        private logger: Logger,
    ) {
    }

    emit(args: object): void {
        this.logger.info(
            format(
                'The user with ID: %s deleted their Tweet with ID: %s',
                args['status']['user_id'],
                args['status']['id'],
            ),
        );
    }

}
