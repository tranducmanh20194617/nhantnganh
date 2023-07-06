export class StoreConfig {
    protected static instance: StoreConfig
    static getInstance(): StoreConfig {
        if (!StoreConfig.instance) {
            StoreConfig.instance = new StoreConfig()
        }
        return StoreConfig.instance
    }

    token?: string
}