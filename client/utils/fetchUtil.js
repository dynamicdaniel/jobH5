/**
 * Created by cl on 2016/10/20.
 */
import fetch from 'isomorphic-fetch';
import { Toast } from 'antd-mobile';
import config from "./config";

const preurl = config.HTTP_URL;
let dev = config.IS_DEV;

// const preurl = 'http://test.api.yishouyun.com';
// let dev = true

const fetchUtil = {};

fetchUtil.post = async (url,params) => {
    try {
        let token =  sessionStorage.getItem('token');

        if (params.token != undefined){
            token = params.token;
        }

        let headers = {};
        if (token != undefined){
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization":"Bearer "+token,
            }
        }else{
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }

        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(params)
        });
        let data = await response.json();
        if (response.status === 200) {
            return data
        } else {
            throw new Error(response.status);
        }
    } catch (e) {
        throw new Error("网络请求异常");
    }
};

fetchUtil.get = async (url) => {
    try {

        let token =  sessionStorage.getItem('token');
        if (params.token != undefined){
            token = params.token;
        }

        let headers = {};
        if (token != undefined){
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization":"Bearer "+token,
            }
        }else{
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }

        let response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        let data = await response.json();
        if (response.status === 200) {
            return data
        } else {
            throw new Error(response.status);
        }
    } catch (e) {
        throw new Error("网络请求异常");
    }
};

fetchUtil.commonRequest = (apiUrl,params,custom) => {
    let promise = new Promise(function(resolve, reject) {
        fetchUtil.post(apiUrl,params)
        .then((rs) => {
                if (rs.success){
                    resolve(rs.data);
                } else {
                    if(custom == 1){
                        reject(rs);
                    }else{
                        Toast.info(rs.msg, 3 , ()=>{
                            reject(rs);
                        });
                    }
                }
        }, e => {
            
            Toast.info(e, 3 , () => {
                reject(e);
            });

        });
    });
    return promise;
}


if (dev) {
    fetchUtil.commonRequest = (apiUrl,params,custom) => {
            let data = {
                url:preurl + apiUrl,
                params:params
            }

            let requestUrl = "/api";

            let promise = new Promise(function(resolve, reject) {
                fetchUtil.post(requestUrl,data)
                .then((rs) => {
                        if (rs.success){
                            resolve(rs.data);
                        } else {
                            
                            if(custom == 1){
                                reject(rs);
                            }else{
                                Toast.info(rs.msg, 3 , ()=>{
                                  //  console.log('失败返回',rs)
                                    reject(rs);
                                });
                            }
                        }
                }, e => {
                    Toast.info(e, 3 , () => {
                        reject(e);
                    });

                });
            });
            return promise;
    }
}

export default fetchUtil;
