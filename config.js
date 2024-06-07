module.exports = {
    ADMIN: {
        id: 'admin',
        name: 'admin',
        pass: 'admin'
    },
    SERVICE: {
        MAIN: {
            HOST: 'https://game.foodwarz.gg',
            PORT: 5000
        },
        BRIDGE: {
            HOST: 'https://bridge.foodwarz.gg',
            PORT: 5001
        },
        GAME: {
            HOST: 'https://main.foodwarz.gg',
            PORT: 5002
        },
        ADMIN: {
            HOST: 'https://admin.foodwarz.gg',
            PORT: 5003
        },
        BOT: {
            HOST: 'http://127.0.0.1:5004',
            PORT: 5004
        }
    },
    DB: 'mongodb://127.0.0.1:27017/FoodWar',
    JWT: {
        secret: 'csgoclubggjwttokenfetyuhgbcase45w368w3q',
        expire: '365d'
    },
    TATUM_OPTION: {
        testnet: {
            apikey: 't-64f970cbc79c2e001c9e7171-3e1d74c683484372b8fc8f76',
            virtualAccount: 'FoodWarTestnet',
            withdrawFee: '0.00001'
        },
        mainnet: {
            apikey: 't-64f970cbc79c2e001c9e7171-a3323cdc10674dd6b48e6773',
            virtualAccount: 'FoodWarMainnet',
            withdrawFee: '0.00001'
        }
    },
    NETWORK: 'testnet',
    RULE: {
        DEALER: {
            BURGER: 0,
            TACO: 1,
            SALAD: 2,
            HOTDOG: 3,
            CHICKEN: 4,
            PANCAKES: 5,
            FRENCH: 6,
            SAUSAGE: 7,
            SPAGHETTI: 8,
            MAX: 9
        },
        USER: {
            SUSHI: 0,
            PIZZA: 1,
            ICECREAM: 2,
            MAX: 3
        },
        BEAT: [
            [3, 4, 8],
            [0, 1, 2],
            [5, 6, 7]
        ],
        PAYOUT: 2.8
    },
    SUBSCRIBE_URL: 'https://game.foodwarz.gg/api/v0/payment/webhook-handler'
}