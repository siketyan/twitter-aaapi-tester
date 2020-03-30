import { createHmac } from 'crypto';

import { Config } from '../models/config';

const HMAC_ALGORITHM = 'sha256';
const HMAC_FORMAT = 'base64';

export class Crc {

    constructor(
        private config: Config,
    ) {
    }

    transform(token: string): string {
        const digest = createHmac(HMAC_ALGORITHM, this.config.twitter.consumerSecret)
            .update(token)
            .digest(HMAC_FORMAT);

        return `${HMAC_ALGORITHM}=${digest}`;
    }

}
