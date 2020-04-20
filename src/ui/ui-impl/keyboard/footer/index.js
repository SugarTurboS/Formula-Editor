/*
 * @Author: Demian
 * @Date: 2020-04-20 11:00:08
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-20 11:37:55
 */
/*
 * @Author: Demian
 * @Date: 2020-04-16 20:03:47
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-20 10:03:23
 */
define(function (require) {
  const kity = require('kity');
  const $$ = require('ui/ui-impl/ui-utils');
  const Footer = kity.createClass('Footer', {
    constructor(parentNode, parentProps) {
      this.parentNode = parentNode;
      this.props = parentProps;
      this.prefix = parentProps.prefix + 'keyboard-footer';

      this.state = {};

      this.containerClassName = this.prefix;
      this.itemClassName = `${this.prefix}-button`;
      this.cancelClassName = `${this.itemClassName}-cancel`;
      this.submitClassName = `${this.itemClassName}-submit`;
      this._onSubmit = this._onSubmit.bind(this);
      this._onCancel = this._onCancel.bind(this);
    },
    _render: function () {
      return $$.ele(this.props.doc, 'div', {
        className: this.containerClassName,
        content: `
          <div id="${this.cancelClassName}">
            <span>取消</span>
          </div>
          <div id="${this.submitClassName}">
            <span>确定</span>
          </div>
        `,
      });
    },
    mount: function () {
      const node = this._render();
      $$.delegate(this.parentNode, `#${this.cancelClassName}`, 'click', this._onCancel);
      $$.delegate(this.parentNode, `#${this.submitClassName}`, 'click', this._onSubmit);
      this.parentNode.appendChild(node);
    },
    _onCancel: function (e) {
      console.log('cancel');
      this.props.onCancel();
    },
    _onSubmit: function (e) {
      console.log('submit');
      this.props.onSubmit();
    },
  });
  return Footer;
});
