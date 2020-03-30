export type Config = {
    http: {
        port: number;
        path: '/';
    };
    twitter: {
        environmentName: string;
        consumerKey: string;
        consumerSecret: string;
        accessToken: string;
        accessTokenSecret: string;
    };
};
