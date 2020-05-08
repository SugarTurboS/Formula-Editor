/*
 * @Author: Demian
 * @Date: 2020-04-26 11:07:17
 * @LastEditor: Demian
 * @LastEditTime: 2020-05-08 16:37:17
 * @description: 将项目中用的npm模块从该处引入并挂载到window中
 */
require('@babel/polyfill');
var WebService = require('@student/eclass-web-service').default;
var CustomWebService = require('@student/web-service').default;

module.exports = window.bundle = {
  WebService: WebService,
  CustomWebService: CustomWebService,
};
