const env = import.meta.env;

const config = {
    app: {
        name: env.VITE_APP_NAME,
        domain: env.VITE_APP_DOMAIN
    },
    api: {
        baseUrl: env.VITE_API_BASE_URL,
    },
    chain: {
        id: Number(env.VITE_CHAIN_ID),
        name: env.VITE_CHAIN_NAME,
        rpcUrl: env.VITE_RPC_URL,
        blockchainExplorerUrl: env.VITE_BLOCKCHAIN_EXPLORER_URL
    },
    contract: {
        address: env.VITE_CONTRACT_ADDRESS,
    },
}

export default config;