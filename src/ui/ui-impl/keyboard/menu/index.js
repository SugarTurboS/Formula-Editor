/*
 * @Author: Demian
 * @Date: 2020-04-16 16:11:27
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-16 19:48:40
 */
define(function (require) {
  const kity = require('kity');
  const $$ = require('ui/ui-impl/ui-utils');
  const Menu = kity.createClass('Menu', {
    constructor(parentNode, parentProps) {
      this.parentNode = parentNode;
      this.props = parentProps;
      this.prefix = parentProps.prefix + 'keyboard-menu';
      this.elementList = [
        { type: 'common', title: '常用', index: 0 },
        { type: 'algebra', title: '代数', index: 1 },
        { type: 'geometry', title: '几何', index: 2 },
        { type: 'unit', title: '单位', index: 3 },
        { type: 'other', title: '其他', index: 4 },
      ];

      this.containerClassName = this.prefix;
      this.listClassName = `${this.prefix}-list`;
      this.itemClassName = `${this.prefix}-list-item`;
      this.onClick = this.onClick.bind(this);
    },
    render: function () {
      return $$.ele(this.props.doc, 'div', {
        className: this.containerClassName,
        content: `
          <ul id="${this.prefix}" class="${this.listClassName}">
            ${this.elementList
              .map((x) => `<li class="${this.itemClassName}" data-value="${x.type}">${x.title}</li>`)
              .join('')}
          </ul>
        `,
      });
    },
    mount: function () {
      const menuNode = this.render();
      $$.delegate(this.parentNode, '.' + this.itemClassName, 'click', this.onClick);
      this.parentNode.appendChild(menuNode);
    },
    destroy: function () {
      $(this.parentNode).find(this.prefix).remove();
    },
    update: function (nextProps) {
      this.props = { ...this.props, ...nextProps };
      this.render();
    },
    onClick: function (e) {
      const val = e.target.dataset.value;
      this.props.onClick(val);
    },
  });
  return Menu;
});
