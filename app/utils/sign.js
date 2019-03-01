'use strict';

const _ = require('lodash');
const md5 = require('md5');
const apiSecret = "abcdefgh12345678"
/**
 * 排序参数
 * @param  {Object} argument 需要排序的参数对象
 * @return {Object}          排序之后的参数对象
 */
const packageSort = argument => {
    const newObj = {};

    for (const k of Object.keys(argument).sort()) {
        newObj[k] = argument[k];
    }

    return newObj;
};

/**
 * 生成签名
 * @param  {Object} argument 需要签名的数据
 * @return {string}          生成的签名字符串
 */
const makeSign = argument => {
    const qs = [];

    _.forEach(argument, (value, key) => {
        value = _.trim(value);
        qs.push(`${key}=${value}`);
        argument[key] = value;
    });

    return md5(qs.join('&') + apiSecret);
};

module.exports.api = (params) => {
    let sign = packageSort(params);

    sign = Object.assign(sign, {sign: makeSign(sign)});
    return sign;
};