/*
 * @Author: Demian
 * @Date: 2020-04-16 18:52:57
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-16 19:58:15
 */
define(function (require) {
  const kity = require('kity');
  const $$ = require('ui/ui-impl/ui-utils');
  const Constant = require('ui/ui-impl/keyboard/panel/const');
  const Panel = kity.createClass('Panel', {
    constructor(parentNode, parentProps) {
      this.parentNode = parentNode;
      this.props = parentProps;
      this.prefix = parentProps.prefix + 'keyboard-panel';
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
      console.log(this.props);
      return $$.ele(this.props.doc, 'div', {
        className: this.containerClassName,
        content: `
        <ul id="${this.prefix}" class="${this.listClassName}">
          ${Constant.Panel.find((x) => x.type === this.props.currentType)
            .items.map(
              (x) => `<li class='${this.itemClassName}' style="background: url(${x.img});background-position: ${-x.pos
                .x}px ${-x.pos.y}px" data-value="${x.key}">
            </li>`
            )
            .join('')}
        </ul>
      `,
      });
    },
    mount: function () {
      const panelNode = this.render();
      $$.delegate(this.parentNode, '.' + this.itemClassName, 'click', this.onClick);
      this.parentNode.appendChild(panelNode);
    },
    update: function (nextProps) {
      this.props = { ...this.props, ...nextProps };
      const panelNode = this.render();

      $('.' + this.prefix).html(panelNode);
    },
    destroy: function () {
      $(this.parentNode).find(this.prefix).remove();
    },
    onClick: function (e) {
      const val = e.target.dataset.value;
      this.props.onClick(val);
    },
  });
  return Panel;
});
