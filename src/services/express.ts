import { format } from 'util';
import { Server } from 'http';
import { Logger } from 'winston';
import { Observable, Subject } from 'rxjs';
import express, { Application, Request, Response } from 'express';

import { Config } from '../models/config';

export type HttpMethod = 'get' | 'post';
export type HttpCollection<T> = { [key in HttpMethod]: T };
export type HttpStreamCollection = HttpCollection<Observable<HttpContext>>;
export type HttpWritableStreamCollection = HttpCollection<Subject<HttpContext>>;
export type HttpContext = {
    request: Request;
    response: Response;
};

export class Express {

    private app: Application = express();
    private server: Server;
    private _streams: HttpWritableStreamCollection = {
        get: new Subject<HttpContext>(),
        post: new Subject<HttpContext>(),
    };

    get streams(): HttpStreamCollection {
        const collection = {};

        Object.keys(this._streams).forEach((key: HttpMethod) => {
            collection[key] = this._streams[key].asObservable();
        });

        return collection as HttpStreamCollection;
    }

    constructor(
        private config: Config,
        private logger: Logger,
    ) {
        this.app.use(express.json());
        this.app.get(this.config.http.path, this.pipe(this._streams.get));
        this.app.post(this.config.http.path, this.pipe(this._streams.post));
    }

    async start(): Promise<HttpStreamCollection> {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.config.http.port, () => {
                    this.logger.verbose(format('Started server on port %s', this.config.http.port));
                    resolve(this.streams);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server?.close((error?: Error) => {
                if (error) {
                    reject(error);
                    return;
                }

                this.logger.verbose('Stopped server');
                resolve();
            });
        });
    }

    private pipe(stream: Subject<HttpContext>) {
        return (request: Request, response: Response) => {
            stream.next({ request, response });
        };
    }

}
