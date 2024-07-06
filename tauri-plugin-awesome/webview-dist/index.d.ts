export declare function add(x: number, y: number): Promise<number>;
export declare function connect(): Promise<boolean>;
export declare function disconnect(): Promise<boolean>;
export declare function is_connected(): Promise<boolean>;
export declare function exec(command: string): Promise<string>;
export declare function configure(config: Config): Promise<void>;
export declare type Config = {
    username: string;
    password: string;
    ip_address: string;
};
