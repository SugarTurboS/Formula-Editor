/*
 * @Author: Demian
 * @Date: 2020-04-22 09:53:01
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-26 15:57:28
 */
/*
 * @Author: Demian
 * @Date: 2020-04-14 16:31:36
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-21 17:25:16
 */
define(function (require) {
  var kity = require('kity'),
    $$ = require('ui/ui-impl/ui-utils'),
    Header = kity.createClass('Header', {
      constructor: function (uiComponent, kfEditor) {
        this.prefix = 'kf-editor-header-container';
        this.kfEditor = kfEditor;
        this.uiComponent = uiComponent;
        this.initKeyboardElements();
        this.initEvent();
      },

      initEvent: function () {
        $$.delegate(this.uiComponent.header, '.' + this.prefix, 'click', () => {
          this.kfEditor.eclassWebService.send({
            type: 'common.closeModal',
          });
        });
      },

      initKeyboardElements: function () {
        var doc = this.uiComponent.header.ownerDocument;

        var ele = this.createHeader(doc, this.kfEditor);
        this.uiComponent.header.appendChild(ele);
      },
      createHeader: function (doc, kfEditor) {
        return $$.ele(doc, 'div', {
          className: this.prefix,
          content: `
                <div class="${this.prefix}-title">插入字符</div>
                <div class="${this.prefix}-close"></div>
              `,
        });
      },
    });

  return Header;
});
