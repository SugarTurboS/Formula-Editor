/*
 * @Author: Demian
 * @Date: 2020-04-16 16:11:27
 * @LastEditor: Demian
 * @LastEditTime: 2020-05-16 10:10:05
 */
define(function (require) {
  const kity = require('kity');
  const $$ = require('ui/ui-impl/ui-utils');
  const Constant = require('ui/ui-impl/keyboard/const');
  const Menu = kity.createClass('Menu', {
    constructor(parentNode, parentProps) {
      this.parentNode = parentNode;
      this.props = parentProps;
      this.prefix = parentProps.prefix + 'keyboard-menu';
      this.elementList = [
        { type: Constant.Type.Common, title: '常用', index: 0 },
        { type: Constant.Type.Algebra, title: '代数', index: 1 },
        { type: Constant.Type.Geometry, title: '几何', index: 2 },
        { type: Constant.Type.Letter, title: '字母', index: 3 },
        { type: Constant.Type.Other, title: '其他', index: 4 },
      ];

      this.state = {
        type: Constant.Type.Common,
      };

      this.containerClassName = this.prefix;
      this.listClassName = `${this.prefix}-list`;
      this.itemClassName = `${this.prefix}-list-item`;
      this._onClick = this._onClick.bind(this);
    },
    _render: function () {
      console.log('menu render');
      return $$.ele(this.props.doc, 'div', {
        className: this.containerClassName,
        content: `
          <ul id="${this.prefix}" class="${this.listClassName}">
            ${this.elementList
              .map(
                (x) =>
                  `<li class="${this.itemClassName} ${
                    isActive.call(this, x.type) ? this.itemClassName + '-active' : ''
                  }" data-value="${x.type}">${x.title}</li>`
              )
              .join('')}
          </ul>
        `,
      });
      function isActive(type) {
        return type === this.state.type;
      }
    },
    mount: function () {
      const node = this._render();
      $$.delegate(this.parentNode, '.' + this.itemClassName, 'click', this._onClick);
      this.parentNode.appendChild(node);
    },
    destroy: function () {
      $(this.parentNode).find(this.prefix).remove();
    },
    update: function (nextProps) {
      if (!this._shouldUpdate(nextProps)) return;
      Object.keys(nextProps)
        .filter((x) => x in this.props)
        .forEach((x) =>
          this._setState({
            [x]: nextProps[x],
          })
        );
      const node = this._render();
      $('.' + this.prefix).html(node);
    },
    _shouldUpdate: function (nextProps) {
      const isSame = Object.keys(this.state).every((x) => nextProps[x] === this.state[x]);
      if (isSame) {
        return false;
      }
      return true;
    },
    _onClick: function (e) {
      const val = e.target.dataset.value;
      this.props.onClick(val);
    },
    _setState: function (nextState) {
      this.state = {
        ...this.state,
        ...nextState,
      };
    },
  });
  return Menu;
});
