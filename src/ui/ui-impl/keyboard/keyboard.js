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
    Constant = require('ui/ui-impl/keyboard/const'),
    Keyboard = kity.createClass('Keyboard', {
      constructor: function (doc) {
        this.doc = doc;
        this.state = {
          currentType: Constant.Type.Common,
        };

        this.element = this.render();

        // 完成组件渲染
        this.menuChild = new Menu(this.element, {
          ...this.state,
          prefix: PREFIX,
          doc: this.doc,
          onClick: this.onMenuClick.bind(this),
        });
        this.panelChild = new Panel(this.element, {
          ...this.state,
          prefix: PREFIX,
          doc: this.doc,
          onClick: this.onPanelClick.bind(this),
        });
        this.renderKeyboard();
      },

      renderKeyboard: function () {
        this.menuChild.mount();
        this.panelChild.mount();
        this.renderPage();
      },

      renderPage: function () {
        this.pageNode = $$.ele(this.doc, 'div', {
          className: PREFIX + 'keyboard-page',
        });
        this.element.appendChild(this.pageNode);
      },
      onMenuClick: function (val) {
        this.setState({
          currentType: val,
        });
      },
      onPanelClick: function (val) {
        $$.publish('panel.select', val);
      },
      onPageClick: function () {},
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
        // this.pageChild.update(this.state);
      },
      createContainer: function () {
        return $$.ele(this.doc, 'div', {
          className: PREFIX + 'keyboard-container',
        });
      },

      attachTo: function (container) {
        container.appendChild(this.element);
      },
    });

  return Keyboard;
});
