module.exports = options => {
    return async function getMainOpenId(ctx, next) {

        console.log(ctx.query);

        let q = ctx.query;

        if (q.mainopenid == undefined){
            console.log("获取主openid")
            let url = ctx.request.originalUrl;
            let host = ctx.request.host;
            let redirectUrl = '';
            if (ctx.app.config.app.isHttps){
              redirectUrl = `https://${host}${url}`
            }else{
              redirectUrl = `http://${host}${url}`
            }
            let redirect = encodeURIComponent(redirectUrl)
            await ctx.redirect(`${ctx.app.config.app.wxAuthMain}?redirect=${redirect}`)
        }else{
            console.log("获取到了主openid")
            await next();
        }
    };
  };
  