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
    PanelConstant = require('ui/ui-impl/keyboard/panel/const'),
    Footer = require('ui/ui-impl/keyboard/footer/index'),
    Keyboard = kity.createClass('Keyboard', {
      constructor: function (doc, kfEditor) {
        this.doc = doc;
        this.kfEditor = kfEditor;
        this.pageSize = 36;
        this.state = {
          type: Constant.Type.Common,
          page: 0,
          totalPage: this.getTotalPage(PanelConstant[0].items.length),
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
          onClick: this.onPanelClick.bind(this),
        });
        this.pageChild = new Page(this.element, {
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
      },

      renderKeyboard: function () {
        this.menuChild.mount();
        this.panelChild.mount();
        this.pageChild.mount();
        this.footerChild.mount();
      },

      onMenuClick: function (val) {
        const charCollection = PanelConstant.find((x) => x.type === val) || {};
        const len = charCollection.items ? charCollection.items.length : 0;
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
        const prevPage = this.state.page;
        if (prevPage === 0) return;
        this.setState({
          page: prevPage - 1,
        });
      },
      onNextPage: function () {
        const prevPage = this.state.page;
        if (prevPage === this.state.totalPage - 1) return;
        this.setState({
          page: prevPage + 1,
        });
      },

      onDelete: function () {
        this.kfEditor.requestService('control.delete.string');
      },
      onSubmit: function () {
        const res = this.kfEditor.execCommand('get.source');
        //TODO:导出res值
        console.log(res);
      },
      onCancel: function () {},

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

      attachTo: function (container) {
        container.appendChild(this.element);
      },
    });

  return Keyboard;
});
