import { format } from 'util';
import { Logger } from 'winston';

import { IEvent } from '.';

export class BlockEvent implements IEvent {

    constructor(
        private logger: Logger,
    ) {
    }

    emit(args: object): void {
        this.logger.info(
            format(
                '@%s %sed @%s',
                args['source']['screen_name'],
                args['type'] === 'block' ? 'Block' : 'Unblock',
                args['target']['screen_name'],
            ),
        );
    }

}
