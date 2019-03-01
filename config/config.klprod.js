const path = require('path');

const alias = {
    client: path.join(__dirname, '../client'),
    images: path.join(__dirname, '../client/images'),
    themes: path.join(__dirname, '../client/themes'),
};

module.exports = {
    keys: 'memberwx',
    middleware: ['getMainOpenId', 'getShopOpenId'],
    getMainOpenId: {
        match: [
            '/bandUser',
            "/bindAgentAdmin"
        ]
    },
    getShopOpenId: {
        match: [
            '/bandUser', 
            '/recvCard',
            "/bindAgentAdmin"
        ]
    },
    security: {
        csrf: {
            enable: false,
        },
    },
    react: {
        static: true,
        assetHost: '//klstatic.kalian168.com',
        assetPath: '/h5/0.0.1',
    },
    webpack: {
        custom: {
            configPath: path.join(__dirname, './webpack.new.js'),
        },
    },
    isomorphic: {
        alias,
    },
    app: {
        isHttps: true,
        ybAppId: 'wx54a434663f4a4480',
        // ybAppSecret: '5ea387781df522350c7e5bfbbbc7331a',
        orderApi: "http://order.kalian168.com",
        wxprex: "https://m.kalian168.com/auth",
        wxAuthMain: "https://m.kalian168.com/authMain",
        httpprex: 'https://api.kalian168.com',
    }
};
