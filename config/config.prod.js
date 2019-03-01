const path = require('path');

const alias = {
    client: path.join(__dirname, '../client'),
    images: path.join(__dirname, '../client/images'),
    themes: path.join(__dirname, '../client/themes'),
};

module.exports = {
    keys: 'memberwx',
    middleware:  [ 'getMainOpenId','getShopOpenId' ],
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
        assetHost: '//ybstatic.yishouyun.net',
        assetPath: '/h5/2.7.3'
    },
    webpack: {
        custom: {
          configPath: path.join(__dirname, './webpack.new.js'),
        },
    },
    isomorphic: {
        alias,
    },
    app : {
        isHttps:true,
        ybAppId:'wx941a76c096d31139',
        ybAppSecret:'5ea387781df522350c7e5bfbbbc7331a',
        orderApi:"http://order.yishouyun.net",
        wxprex:"https://m.yishouyun.net/auth",
        wxAuthMain:"https://m.yishouyun.net/authMain",
        httpprex:'https://api.yishouyun.net',
    }
};
