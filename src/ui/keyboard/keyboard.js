/*
 * @Author: Demian
 * @Date: 2020-04-14 16:31:36
 * @LastEditor: Demian
 * @LastEditTime: 2020-05-07 10:26:22
 */
define(function (require) {
  var kity = require('kity'),
    UiImpl = require('ui/ui-impl/ui'),
    $$ = require('ui/ui-impl/ui-utils'),
    Keyboard = kity.createClass('Keyboard', {
      constructor: function (uiComponent, kfEditor) {
        this.kfEditor = kfEditor;
        this.uiComponent = uiComponent;
        this.initKeyboardElements();

        // this.initServices();

        this.initEvent();
      },

      // initServices: function () {
      //   this.kfEditor.registerService('ui.toolbar.disable', this, {
      //     disableToolbar: this.disableToolbar,
      //   });

      //   this.kfEditor.registerService('ui.toolbar.enable', this, {
      //     enableToolbar: this.enableToolbar,
      //   });

      //   this.kfEditor.registerService('ui.toolbar.close', this, {
      //     closeToolbar: this.closeToolbar,
      //   });
      // },

      initEvent: function () {
        var _self = this;

        $$.on(this.uiComponent.keyboardContainer, 'mousedown', function (e) {
          e.preventDefault();
        });

        $$.on(this.uiComponent.keyboardContainer, 'mousewheel', function (e) {
          e.preventDefault();
        });

        // // 通知所有组件关闭
        // $$.on(this.kfEditor.getContainer(), 'mousedown', function () {
        //   _self.notify('closeAll');
        // });

        // 订阅数据选择主题
        $$.subscribe('panel.select', function (data) {
          _self.insertSource(data);
        });
      },

      insertSource: function (val) {
        this.kfEditor.requestService('control.insert.string', val);
        this.kfEditor.eclassWebService.send({
          type: 'common.selectKey',
          data: {
            body: {
              key: val,
            },
          },
        });
      },

      // disableToolbar: function () {
      //   kity.Utils.each(this.elements, function (ele) {
      //     ele.disable && ele.disable();
      //   });
      // },

      // enableToolbar: function () {
      //   kity.Utils.each(this.elements, function (ele) {
      //     ele.enable && ele.enable();
      //   });
      // },

      // getContainer: function () {
      //   return this.kfEditor.requestService('ui.get.canvas.container');
      // },

      // closeToolbar: function () {
      //   this.closeElement();
      // },

      // 接受到关闭通知
      // notify: function (type) {
      //   switch (type) {
      //     // 关闭所有组件
      //     case 'closeAll':
      //     // 关闭其他组件
      //     case 'closeOther':
      //       this.closeElement(arguments[1]);
      //       return;
      //   }
      // },

      // closeElement: function (exception) {
      //   kity.Utils.each(this.elements, function (ele) {
      //     if (ele != exception) {
      //       ele.hide && ele.hide();
      //     }
      //   });
      // },

      initKeyboardElements: function () {
        var doc = this.uiComponent.keyboardContainer.ownerDocument;

        var ele = createKeyboard(doc, this.kfEditor);
        this.appendElement(ele);
      },

      appendElement: function (uiElement) {
        uiElement.attachTo(this.uiComponent.keyboardContainer);
      },
    });

  function createKeyboard(doc, kfEditor) {
    return new UiImpl.Keyboard(doc, kfEditor);
  }

  return Keyboard;
});
