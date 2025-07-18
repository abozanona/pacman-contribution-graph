import { Config, StoreType } from './types';
export declare class PacmanRenderer {
    store: StoreType;
    conf: Config;
    constructor(conf: Config);
    start(): Promise<StoreType>;
    stop(): void;
}
