const path = require('path');

const alias = {
    client: path.join(__dirname, '../client'),
    images: path.join(__dirname, '../client/images'),
    themes: path.join(__dirname, '../client/themes'),
};

module.exports = {
    keys: 'test',
    middleware:  [ 'getMainOpenId','getShopOpenId' ],
    getMainOpenId: {
        match: [
            '/banduser',
            "/bindAgentAdmin"
        ]
    },
    getShopOpenId: {
        match: [
            '/banduser',
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

    static : {
        prefix:"/"
    },

    app : {
        isHttps:false,
        ybAppId:'wx941a76c096d31139',
        ybAppSecret:'5ea387781df522350c7e5bfbbbc7331a',
        orderApi:"http://testorder.yishouyun.net",
        wxprex:"http://testm.yishouyun.net/auth",
        wxAuthMain:"http://testm.yishouyun.net/authMain",
        httpprex:'http://testapi.yishouyun.net',
        // httpprex: 'http://127.0.0.1:7001',
    }
};
