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
    Keyboard = kity.createClass('Keyboard', {
      constructor: function (doc) {
        this.doc = doc;
        this.pageSize = 36;
        this.state = {
          currentType: Constant.Type.Common,
          page: 0,
          totalPage: this.getTotalPage(PanelConstant[0].items.length),
        };

        this.element = this.render();

        // 完成组件渲染
        this.menuChild = new Menu(this.element, {
          currentType: this.state.currentType,
          prefix: PREFIX,
          doc: this.doc,
          onClick: this.onMenuClick.bind(this),
        });
        this.panelChild = new Panel(this.element, {
          currentType: this.state.currentType,
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
        });
        this.renderKeyboard();
      },

      renderKeyboard: function () {
        this.menuChild.mount();
        this.panelChild.mount();
        this.pageChild.mount();
      },

      onMenuClick: function (val) {
        const charCollection = PanelConstant.find((x) => x.type === val) || {};
        const len = charCollection.items ? charCollection.items.length : 0;
        this.setState({
          currentType: val,
          totalPage: this.getTotalPage(len),
        });
      },

      onPanelClick: function (val) {
        $$.publish('panel.select', val);
      },

      onPrevPage: function () {
        const prevPage = this.state.page;
        this.setState({
          page: prevPage - 1,
        });
      },
      onNextPage: function () {
        const prevPage = this.state.page;
        this.setState({
          page: prevPage + 1,
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
        return Math.ceil(len / this.pageSize);
      },

      attachTo: function (container) {
        container.appendChild(this.element);
      },
    });

  return Keyboard;
});
