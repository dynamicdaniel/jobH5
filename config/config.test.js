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
        isHttps: false,
        ybAppId: 'wxfb56a3536b8b7bc0',
        // ybAppSecret: '5ea387781df522350c7e5bfbbbc7331a',
        orderApi: "http://testorder.yishouyun.net",
        wxprex: "http://testm.yishouyun.net/auth",
        wxAuthMain: "http://testm.yishouyun.net/authMain",
        httpprex: 'http://testapi.yishouyun.net',
    }
};
