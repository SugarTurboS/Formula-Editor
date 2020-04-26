/*
 * @Author: Demian
 * @Date: 2020-04-26 11:07:17
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-26 15:18:19
 * @description: 将项目中用的npm模块从该处引入并挂载到window中
 */
const { default: WebService } = require('@student/eclass-web-service');

module.exports = window.bundle = {
  WebService,
};
