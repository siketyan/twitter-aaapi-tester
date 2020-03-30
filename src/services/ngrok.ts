import { connect, disconnect } from 'ngrok';
import { Logger } from 'winston';

import { Config } from '../models/config';

export class Ngrok {

    constructor(
        private config: Config,
        private logger: Logger,
    ) {
    }

    async start(): Promise<string> {
        return await connect({
            addr: this.config.http.port,
            proto: 'http',
            onLogEvent: message => {
                this.logger.debug(message, ['ngrok']);
            }
        });
    }

    async stop(): Promise<void> {
        return await disconnect();
    }

}
