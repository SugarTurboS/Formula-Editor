/*
 * @Author: Demian
 * @Date: 2020-04-29 21:14:35
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-30 10:26:17
 */
define(function (require) {
  const kity = require('kity');
  const Messager = kity.createClass('Messager', {
    constructor() {},

    getCheckServiceType: function () {
      return 'common.requestFunctions';
    },

    // 实现webService如何去接收消息
    onReceiveMessage: function (messageHandler) {
      document.addEventListener('documentMessage', (e) => {
        e.detail && e.detail.headers && messageHandler(e.detail);
      });
    },

    // 实现webService如何去发送消息
    sendAction: function ({ type, headers, data }) {
      const event = new CustomEvent('documentMessage', {
        detail: { type, headers, data },
      });
      document.dispatchEvent(event);
    },
  });
  return Messager;
});
