/*!
 * 特殊字符区域
 */

define(function (require) {
  var kity = require('kity'),
    PREFIX = 'kf-editor-ui-',
    // UiUitls
    $$ = require('ui/ui-impl/ui-utils'),
    Constant = require('ui/ui-impl/keyboard/const'),
    Keyboard = kity.createClass('Keyboard', {
      constructor: function (doc) {
        this.options = Constant.Panel;
        this.doc = doc;
        this.currentType = Constant.Type.Common;

        // 子组件前缀
        this.menuPrefix = PREFIX + 'keyboard-menu';
        this.panelPrefix = PREFIX + 'keyboard-panel';
        this.pagePrefix = PREFIX + 'keyboard-page';

        this.element = this.createKeyboard();
        // 完成组件渲染
        this.renderKeyboard();
        // 完成事件注册
        this.initEvent();
        // this.container = this.createContainer();
        // this.panel = this.createPanel();
        // this.group = this.createGroup();
        // this.buttonContainer = this.createButtonContainer();
        // this.button = this.createButton();
        // this.mountPoint = this.createMountPoint();
        // this.moveDownButton = this.createMoveDownButton();
        // this.moveUpButton = this.createMoveUpButton();

        // this.boxObject = this.createBox();
        // this.mergeElement();
        // this.mount();

        // this.initEvent();
      },

      renderKeyboard: function () {
        this.renderMenu();
        this.renderPanel();
        this.renderPage();
      },

      renderMenu: function () {
        this.menuNode = $$.ele(this.doc, 'div', {
          className: this.menuPrefix,
          content: `
            <ul class="${this.menuPrefix}-list">
              ${Constant.Menu.map((x) => `<li class='${this.menuPrefix}-list-item'>${x.title}</li>`).join('')}
            </ul>
          `,
        });
        this.element.appendChild(this.menuNode);
      },
      renderPanel: function () {
        this.panelNode = $$.ele(this.doc, 'div', {
          className: this.panelPrefix,
          content: `
            <ul class="${this.panelPrefix}-list">
              ${Constant.Panel.find((x) => x.type === this.currentType)
                .items.map(
                  (x) => `<li class='${this.panelPrefix}-list-item' style="background: url(${
                    x.img
                  });background-position: ${-x.pos.x}px ${-x.pos.y}px" data-value="${x.key}">
                </li>`
                )
                .join('')}
            </ul>
          `,
        });
        this.element.appendChild(this.panelNode);
      },
      renderPage: function () {
        this.pageNode = $$.ele(this.doc, 'div', {
          className: PREFIX + 'keyboard-page',
        });
        this.element.appendChild(this.pageNode);
      },

      initEvent: function () {
        this.initMenuEvent();
        this.initPanelEvent();
        this.initPageEvent();
      },

      initMenuEvent: function () {},
      initPanelEvent: function () {
        const _self = this;
        $$.delegate(this.element, `.${this.panelPrefix}-list-item`, 'click', function (e) {
          e.preventDefault();

          if (e.which !== 1) {
            return;
          }

          _self.onSelectPanelItem && _self.onSelectPanelItem(this.getAttribute('data-value'));
        });
      },
      initPageEvent: function () {},

      // disable: function () {
      //   this.disabled = true;
      //   this.boxObject.disable();
      //   $$.getClassList(this.element).remove(PREFIX + 'enabled');
      // },

      // enable: function () {
      //   this.disabled = false;
      //   this.boxObject.enable();
      //   $$.getClassList(this.element).add(PREFIX + 'enabled');
      // },

      onSelectPanelItem: function (val) {
        $$.publish('panel.select', val);
      },

      createKeyboard: function () {
        var keyboardNode = $$.ele(this.doc, 'div', {
          className: PREFIX + 'keyboard',
        });

        if ('width' in this.options) {
          keyboardNode.style.width = this.options.width + 'px';
        }

        return keyboardNode;
      },

      // checkMaxPanelIndex: function () {
      //   this.maxPanelIndex = Math.ceil(this.currentItemCount / this.lineMaxCount / 2);
      // },

      // updateContent: function () {
      //   var items = this.boxObject.getOverlapContent(),
      //     count = 0,
      //     style = null,
      //     lineno = 0,
      //     colno = 0,
      //     lineMaxCount = this.lineMaxCount,
      //     newContent = [];

      //   // 清空原有内容
      //   this.panel.innerHTML = '';

      //   kity.Utils.each(items, function (item) {
      //     var contents = item.content;

      //     kity.Utils.each(contents, function (currentContent, index) {
      //       lineno = Math.floor(count / lineMaxCount);
      //       colno = count % lineMaxCount;
      //       count++;

      //       style = 'top: ' + (lineno * 33 + 5) + 'px; left: ' + (colno * 32 + 5) + 'px;';

      //       newContent.push(
      //         '<div class="' +
      //           PREFIX +
      //           'area-item" data-value="' +
      //           currentContent.key +
      //           '" style="' +
      //           style +
      //           '"><div class="' +
      //           PREFIX +
      //           'area-item-inner"><div class="' +
      //           PREFIX +
      //           'area-item-img" style="background: url(' +
      //           currentContent.img +
      //           ') no-repeat ' +
      //           -currentContent.pos.x +
      //           'px ' +
      //           -currentContent.pos.y +
      //           'px;"></div></div></div>'
      //       );
      //     });
      //   });

      //   this.currentItemCount = count;
      //   this.panelIndex = 0;
      //   this.panel.style.top = 0;
      //   this.panel.innerHTML = newContent.join('');

      //   this.checkMaxPanelIndex();
      //   this.updatePanelButtonState();
      // },

      // // 挂载
      // mount: function () {
      //   this.boxObject.mountTo(this.mountPoint);
      // },

      // showMount: function () {
      //   this.mountPoint.style.display = 'block';
      //   this.boxObject.updateSize();
      // },

      // hideMount: function () {
      //   this.mountPoint.style.display = 'none';
      // },

      // hide: function () {
      //   this.hideMount();
      //   this.boxObject.hide();
      // },

      // createButton: function () {
      //   return $$.ele(this.doc, 'div', {
      //     className: PREFIX + 'area-button',
      //   });
      // },

      // createMoveDownButton: function () {
      //   return $$.ele(this.doc, 'div', {
      //     className: PREFIX + 'movedown-button',
      //     content: '',
      //   });
      // },

      // createMoveUpButton: function () {
      //   return $$.ele(this.doc, 'div', {
      //     className: PREFIX + 'moveup-button',
      //     content: '',
      //   });
      // },

      // createMountPoint: function () {
      //   return $$.ele(this.doc, 'div', {
      //     className: PREFIX + 'area-mount',
      //   });
      // },

      // createBox: function () {
      //   return new Box(this.doc, this.options.box);
      // },

      createContainer: function () {
        return $$.ele(this.doc, 'div', {
          className: PREFIX + 'keyboard-container',
        });
      },

      createPanel: function () {
        return $$.ele(this.doc, 'div', {
          className: PREFIX + 'keyboard-panel',
        });
      },

      createGroup: function () {
        const groupNode = $$.ele(this.doc, 'div', {
          className: PREFIX + 'keyboard-group',
        });
        // 构建dom
        // const item = new BoxItem()
        return groupNode;
      },

      // createButtonContainer: function () {
      //   return $$.ele(this.doc, 'div', {
      //     className: PREFIX + 'area-button-container',
      //   });
      // },

      mergeElement: function () {
        // this.buttonContainer.appendChild(this.moveUpButton);
        // this.buttonContainer.appendChild(this.moveDownButton);
        // this.buttonContainer.appendChild(this.button);

        this.panel.appendChild(this.group);

        this.container.appendChild(this.panel);

        this.element.appendChild(this.container);
        // this.element.appendChild(this.buttonContainer);
        // this.element.appendChild(this.mountPoint);
      },

      // disablePanelUp: function () {
      //   this.disabledUp = true;
      //   $$.getClassList(this.moveUpButton).add('kf-editor-ui-disabled');
      // },

      // enablePanelUp: function () {
      //   this.disabledUp = false;
      //   $$.getClassList(this.moveUpButton).remove('kf-editor-ui-disabled');
      // },

      // disablePanelDown: function () {
      //   this.disabledDown = true;
      //   $$.getClassList(this.moveDownButton).add('kf-editor-ui-disabled');
      // },

      // enablePanelDown: function () {
      //   this.disabledDown = false;
      //   $$.getClassList(this.moveDownButton).remove('kf-editor-ui-disabled');
      // },

      // updatePanelButtonState: function () {
      //   if (this.panelIndex === 0) {
      //     this.disablePanelUp();
      //   } else {
      //     this.enablePanelUp();
      //   }

      //   if (this.panelIndex + 1 >= this.maxPanelIndex) {
      //     this.disablePanelDown();
      //   } else {
      //     this.enablePanelDown();
      //   }
      // },

      // nextPanel: function () {
      //   if (this.disabledDown) {
      //     return;
      //   }

      //   if (this.panelIndex + 1 >= this.maxPanelIndex) {
      //     return;
      //   }

      //   this.panelIndex++;

      //   this.panel.style.top = -this.panelIndex * PANEL_HEIGHT + 'px';

      //   this.updatePanelButtonState();
      // },

      // prevPanel: function () {
      //   if (this.disabledUp) {
      //     return;
      //   }

      //   if (this.panelIndex === 0) {
      //     return;
      //   }

      //   this.panelIndex--;

      //   this.panel.style.top = -this.panelIndex * PANEL_HEIGHT + 'px';

      //   this.updatePanelButtonState();
      // },

      attachTo: function (container) {
        container.appendChild(this.element);
        // this.updateContent();
        // this.updatePanelButtonState();
      },
    });

  return Keyboard;
});
