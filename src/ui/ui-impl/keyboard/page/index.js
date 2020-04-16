/*
 * @Author: Demian
 * @Date: 2020-04-16 20:03:47
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-16 20:12:34
 */
define(function (require) {
  const kity = require('kity');
  const $$ = require('ui/ui-impl/ui-utils');
  const Page = kity.createClass('Page', {
    constructor(parentNode, parentProps) {
      this.parentNode = parentNode;
      this.props = parentProps;
      this.prefix = parentProps.prefix + 'keyboard-page';
      this.elementList = [
        { type: 'prev', title: '上一页', index: 0 },
        { type: 'next', title: '下一页', index: 1 },
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
      const node = this.render();
      $$.delegate(this.parentNode, '.' + this.itemClassName, 'click', this.onClick);
      this.parentNode.appendChild(node);
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
      if (val === 'next') {
        this.props.onNextPage();
      } else {
        this.props.onPrevPage();
      }
    },
  });
  return Page;
});
