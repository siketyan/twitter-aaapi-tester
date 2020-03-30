import { format } from 'util';
import { Logger } from 'winston';

import { IEvent } from '.';

export class MuteEvent implements IEvent {

    constructor(
        private logger: Logger,
    ) {
    }

    emit(args: object): void {
        this.logger.info(
            format(
                '@%s %sd @%s',
                args['source']['screen_name'],
                args['type'] === 'mute' ? 'Mute' : 'Unmute',
                args['target']['screen_name'],
            ),
        );
    }

}
