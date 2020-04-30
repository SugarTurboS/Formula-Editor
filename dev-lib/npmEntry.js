/*
 * @Author: Demian
 * @Date: 2020-04-26 11:07:17
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-30 10:15:37
 * @description: 将项目中用的npm模块从该处引入并挂载到window中
 */
const { default: WebService } = require('@student/eclass-web-service');
const { default: CustomWebService } = require('@student/web-service');

module.exports = window.bundle = {
  WebService,
  CustomWebService
};
