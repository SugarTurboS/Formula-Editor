/*!
 * 特殊字符区域
 */

define(function (require) {
  var kity = require('kity'),
    PREFIX = 'kf-editor-ui-',
    // UiUitls
    $$ = require('ui/ui-impl/ui-utils'),
    Menu = require('ui/ui-impl/keyboard/menu/index'),
    Panel = require('ui/ui-impl/keyboard/panel/index'),
    Page = require('ui/ui-impl/keyboard/page/index'),
    Constant = require('ui/ui-impl/keyboard/const'),
    PcPanelConstant = require('ui/ui-impl/keyboard/panel/pcConst'),
    AndroidPanelConstant = require('ui/ui-impl/keyboard/panel/androidConst'),
    Footer = require('ui/ui-impl/keyboard/footer/index'),
    Keyboard = kity.createClass('Keyboard', {
      constructor: function (doc, kfEditor) {
        this.doc = doc;
        this.kfEditor = kfEditor;
        this.pageSize = this.getDeviceType() === 'android' ? 32 : 40;
        this.panelConstant = this.getConstant();
        this.typeEnum = {
          [Constant.Type.Common]: 0,
          [Constant.Type.Algebra]: 1,
          [Constant.Type.Geometry]: 2,
          [Constant.Type.Other]: 3,
          0: Constant.Type.Common,
          1: Constant.Type.Algebra,
          2: Constant.Type.Geometry,
          3: Constant.Type.Other,
        };

        this.state = {
          type: Constant.Type.Common,
          page: 0,
          totalPage: this.getTotalPage(this.panelConstant[0].items.length),
        };

        this.element = this.render();

        // 完成组件渲染
        this.menuChild = new Menu(this.element, {
          type: this.state.type,
          prefix: PREFIX,
          doc: this.doc,
          onClick: this.onMenuClick.bind(this),
        });
        this.panelChild = new Panel(this.element, {
          type: this.state.type,
          page: this.state.page,
          prefix: PREFIX,
          doc: this.doc,
          panelConstant: this.panelConstant,
          rowHeight: this.getDeviceType() === 'android' ? 149 : 64,
          scrollHeight: this.getDeviceType() === 'android' ? 149 * 4 : 64 * 5,
          onClick: this.onPanelClick.bind(this),
        });
        this.pageChild = new Page(this.element, {
          type: this.state.type,
          page: this.state.page,
          totalPage: this.state.totalPage,
          prefix: PREFIX,
          doc: this.doc,
          onPrevPage: this.onPrevPage.bind(this),
          onNextPage: this.onNextPage.bind(this),
          onDelete: this.onDelete.bind(this),
          onSubmit: this.onSubmit.bind(this),
        });
        this.footerChild = new Footer(this.element, {
          prefix: PREFIX,
          doc: this.doc,
          onSubmit: this.onSubmit.bind(this),
          onCancel: this.onCancel.bind(this),
        });
        this.renderKeyboard();
        // 通知当前类型
        this.sendService();
      },

      sendService: function () {
        this.kfEditor.eclassWebService.send({
          type: 'common.setType',
          data: {
            body: {
              type: this.state.type,
            },
          },
        });
      },

      renderKeyboard: function () {
        this.menuChild.mount();
        this.panelChild.mount();
        this.pageChild.mount();
        this.footerChild.mount();
      },

      onMenuClick: function (val) {
        const charCollection = this.panelConstant.find((x) => x.type === val) || {};
        const len = charCollection.items ? charCollection.items.length : 0;
        this.kfEditor.eclassWebService.send({
          type: 'common.setType',
          data: {
            body: {
              type: val,
            },
          },
        });
        this.setState({
          type: val,
          page: 0,
          totalPage: this.getTotalPage(len),
        });
      },

      onPanelClick: function (val) {
        $$.publish('panel.select', val);
      },

      onPrevPage: function () {
        const { page, type } = this.state;
        // 如果已到第一页，则自动切换至上一个模式，若已到最顶部模式，则禁止翻页
        if (page === 0 && type === Constant.Type.Common) {
          return;
        }
        if (page === 0) {
          this._prevMode(type);
          return;
        }
        this.setState({
          page: page - 1,
        });
      },
      onNextPage: function () {
        const { page, type, totalPage } = this.state;
        // 如果已到最后一页，则自动切换至下一个模式，若已到最底部模式，则禁止翻页
        if (page === totalPage - 1 && type === Constant.Type.Other) {
          return;
        }
        if (page === totalPage - 1) {
          this._nextMode(type);
          return;
        }
        this.setState({
          page: page + 1,
        });
      },

      onDelete: function () {
        this.kfEditor.requestService('control.delete.string');
      },
      onSubmit: function () {
        this.kfEditor.execCommand('get.image.data', (data) => {
          const formula = this.kfEditor.execCommand('get.source');
          this.kfEditor.eclassWebService.send({
            type: 'common.setFormula',
            data: {
              body: {
                formulaSrc: data.img,
                formula,
              },
            },
          });
        });
      },
      onCancel: function () {
        this.kfEditor.eclassWebService.send({
          type: 'common.closeModal',
        });
      },

      render: function () {
        const keyboardNode = $$.ele(this.doc, 'div', {
          className: PREFIX + 'keyboard',
        });

        return keyboardNode;
      },

      setState: function (nextState) {
        this.state = {
          ...this.state,
          ...nextState,
        };
        this.menuChild.update(this.state);
        this.panelChild.update(this.state);
        this.pageChild.update(this.state);
      },

      getTotalPage: function (len) {
        return Math.ceil(len / this.pageSize) || 1;
      },

      getDeviceType: function () {
        return this.kfEditor.options.ui.device;
      },

      getConstant: function () {
        const deviceType = this.getDeviceType();
        switch (deviceType) {
          case 'android':
            return AndroidPanelConstant;
          case 'pc':
            return PcPanelConstant;
        }
      },

      attachTo: function (container) {
        container.appendChild(this.element);
      },

      _prevMode: function (curType) {
        const prevType = this.typeEnum[this.typeEnum[curType] - 1];
        const charCollection = this.panelConstant.find((x) => x.type === prevType) || {};
        const len = charCollection.items ? charCollection.items.length : 0;
        this.setState({
          type: prevType,
          page: 0,
          totalPage: this.getTotalPage(len),
        });
        return;
      },
      _nextMode: function (curType) {
        const nextType = this.typeEnum[this.typeEnum[curType] + 1];
        const charCollection = this.panelConstant.find((x) => x.type === nextType) || {};
        const len = charCollection.items ? charCollection.items.length : 0;
        this.setState({
          type: nextType,
          page: 0,
          totalPage: this.getTotalPage(len),
        });
        return;
      },
    });

  return Keyboard;
});
