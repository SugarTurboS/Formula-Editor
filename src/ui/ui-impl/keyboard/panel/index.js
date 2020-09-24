/*
 * @Author: Demian
 * @Date: 2020-04-16 18:52:57
 * @LastEditor: Demian
 * @LastEditTime: 2020-05-06 15:42:41
 */
define(function (require) {
  const kity = require('kity');
  const $$ = require('ui/ui-impl/ui-utils');
  const Panel = kity.createClass('Panel', {
    constructor(parentNode, parentProps) {
      this.parentNode = parentNode;
      this.props = parentProps;
      this.prefix = parentProps.prefix + 'keyboard-panel';
      this.scrollHeight = parentProps.scrollHeight;
      this.rowHeight = parentProps.rowHeight;
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
    _calculateHeight: function (type, page) {
      // 计算当前类型的起始行数
      const curTypeIndex =
        this.props.panelConstant.findIndex((item) => item.type === type) || 0;
      const prevList =
        this.props.panelConstant.slice(0, curTypeIndex) || this.props.panelConstant[0];
      const rows = prevList.reduce((acc, cur, index) => {
        const curRows = Math.ceil(cur.items.length / 8);
        return acc + curRows;
      }, 0);
      // 计算当前类型的锚点坐标
      const typeHeight = rows * this.rowHeight;
      return typeHeight + page * this.scrollHeight;
    },
    _render: function () {
      const list = this.props.panelConstant.reduce((acc, cur, index) => {
        const itemLenOfLastRow = cur.items.length % 8;
        const blankArr = itemLenOfLastRow ? new Array(8 - itemLenOfLastRow).fill('') : [];
        return acc.concat(cur.items, blankArr);
      }, []);
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
        <table id="${this.listClassName}" class="${
          this.listClassName
        }" style="top: -${this._calculateHeight(
          this.state.type,
          this.state.page
        )}px" cellspacing="0" cellpadding="0">
          ${table
            .map(
              (row) =>
                '<tr>' +
                row
                  .map((x) =>
                    x
                      ? `<td class='${this.itemClassName}' style="background-image: url(${
                          x.img
                        });background-position: ${-x.pos.x}px ${-x.pos
                          .y}px" data-value="${x.key}" />`
                      : null
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
      $('#' + this.listClassName).css(
        'top',
        `-${this._calculateHeight(nextProps.type, nextProps.page)}px`
      );
      this._setState({
        type: nextProps.type,
        page: nextProps.page,
      });
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
