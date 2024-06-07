export const COINTYPES = {
    ETH: { code: 'ETH', fullname: 'Ethereum', token: 'erc20', decimal: 6 },
    BET: { code: 'BET', fullname: 'Red&Black', token: 'erc20', decimal: 4 }
};

export const CURRENCIES = {
    ETH: 'ETH',
    BET: 'BET'
}

export const Fee = {
    ETH: 0.00001,
    BET: 1
}

export const TxScanLink = {
    Mainnet: {
    },
    Testnet: {
        BTC: 'https://sochain.com/tx/BTCTEST/',
        ETH: 'https://sepolia.etherscan.io/tx/',
        TRX: 'https://shasta.tronscan.org/#/transaction/'
    }
}

export const AddressScanLink = {
    Mainnet: {
        BTC: 'https://sochain.com/address/BTC/',
        ETH: 'https://etherscan.io/address/',
        TRX: 'https://tronscan.org/#/address/'
    },
    Testnet: {
        BTC: 'https://sochain.com/address/BTCTEST/',
        ETH: 'https://sepolia.etherscan.io/address/',
        TRX: 'https://shasta.tronscan.org/#/address/'
    }
}

export const NETWORK = 'Mainnet';