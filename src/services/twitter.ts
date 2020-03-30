import { format } from 'util';
import { Logger } from 'winston';
import Twit from 'twit';

import { Config } from '../models/config';

export class Twitter {

    private twit: Twit;
    private webhookId: string;
    private environmentName: string;

    constructor(
        private config: Config,
        private logger: Logger,
    ) {
        this.environmentName = this.config.twitter.environmentName;
        this.twit = new Twit({
            consumer_key: this.config.twitter.consumerKey,
            consumer_secret: this.config.twitter.consumerSecret,
            access_token: this.config.twitter.accessToken,
            access_token_secret: this.config.twitter.accessTokenSecret,
        });
    }

    async add(url: string): Promise<Twit.Response> {
        return await this.twit
            .post(`account_activity/all/${this.environmentName}/webhooks`, {
                url,
            })
            .then(response => response.data)
            .then(data => {
                this.webhookId = data['id'];
                this.logger.verbose(format('Added webhook URL with ID: %s', this.webhookId));
                return data;
            });
    }

    async remove(): Promise<void> {
        if (!this.webhookId) {
            return new Promise(resolve => resolve());
        }

        return await this.twit
            .delete(`account_activity/all/${this.environmentName}/webhooks/${this.webhookId}`)
            .then(() => {
                this.logger.verbose('Removed webhook URL');
            });
    }

    async subscribe(): Promise<void> {
        return await this.twit
            .post(`account_activity/all/${this.environmentName}/subscriptions`)
            .then(() => {
                this.logger.verbose('Subscribed to all events');
            });
    }

    async unsubscribe(): Promise<void> {
        return await this.twit
            .delete(`account_activity/all/${this.environmentName}/subscriptions`)
            .then(() => {
                this.logger.verbose('Unsubscribed from all events');
            });
    }

}
