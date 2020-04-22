/*
 * @Author: Demian
 * @Date: 2020-04-16 18:52:57
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-22 14:08:49
 */
define(function (require) {
  const kity = require('kity');
  const $$ = require('ui/ui-impl/ui-utils');
  const PanelConstant = require('ui/ui-impl/keyboard/panel/const');
  const Constant = require('ui/ui-impl/keyboard/const');
  const Panel = kity.createClass('Panel', {
    constructor(parentNode, parentProps) {
      this.parentNode = parentNode;
      this.props = parentProps;
      this.prefix = parentProps.prefix + 'keyboard-panel';
      this.scrollHeight = 320;
      // 初始化状态
      this.state = {
        type: this.props.type,
        page: this.props.page,
      };

      this.containerClassName = this.prefix;
      this.listClassName = `${this.prefix}-list`;
      this.itemClassName = `${this.prefix}-list-item`;

      this._onClick = this._onClick.bind(this);
    },
    _render: function () {
      console.log('panel render');
      const list = PanelConstant.find((x) => x.type === this.state.type).items || [];
      const table = list.reduce((acc, cur, index) => {
        const row = Math.floor(index / 8);
        const col = Math.floor(index % 8);
        if (!acc[row]) acc[row] = [];
        acc[row][col] = cur;
        return acc;
      }, []);
      return $$.ele(this.props.doc, 'div', {
        className: this.containerClassName,
        content: `
        <table id="${this.prefix}" class="${this.listClassName}" style="top: -${
          this.state.page * this.scrollHeight
        }px" cellspacing="0" cellpadding="0">
          ${table
            .map(
              (row) =>
                '<tr>' +
                row
                  .map(
                    (x) =>
                      `<td class='${this.itemClassName}' style="background: url(${
                        x.img
                      });background-position: ${-x.pos.x}px ${-x.pos.y}px" data-value="${
                        x.key
                      }" />`
                  )
                  .join('') +
                '</tr>'
            )
            .join('')}
        </table>
      `,
      });
    },
    mount: function () {
      const node = this._render();
      $$.delegate(this.parentNode, '.' + this.itemClassName, 'click', this._onClick);
      this.parentNode.appendChild(node);
    },
    update: function (nextProps) {
      if (!this._shouldUpdate(nextProps)) return;
      Object.keys(nextProps)
        .filter((x) => x in this.state)
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
  return Panel;
});
