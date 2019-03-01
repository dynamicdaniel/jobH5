const { Controller } = require("egg");
const sign = require("../utils/sign");

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = {
      success: true,
      data,
      msg: ""
    };
  }

  error(msg) {
    this.ctx.body = {
      success: false,
      data: "",
      msg
    };
  }

  notFound(msg) {
    msg = msg || "not found";
    this.ctx.throw(404, msg);
  }

  async post(url, params) {
    let token = params.token;
    let header = {};

    if (token != undefined) {
      header = { Authorization: "Bearer " + token };
    }

    const result = await this.ctx.curl(this.app.config.app.httpprex + url, {
      // 自动解析 JSON response
      dataType: "json",
      method: "POST",
      data: sign.api(params),
      headers: header,
      // 30 秒超时
      timeout: 30000
    });

    let rs = result.data;

    return rs;
  }
}
module.exports = BaseController;
