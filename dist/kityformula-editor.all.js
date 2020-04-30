/*!
 * ====================================================
 * Kity Formula Editor - v1.0.0 - 2020-04-30
 * https://github.com/kitygraph/formula
 * GitHub: https://github.com/kitygraph/formula.git 
 * Copyright (c) 2020 test-kf-editor; Licensed MIT
 * ====================================================
 */

(function () {
var _p = {
    r: function(index) {
        if (_p[index].inited) {
            return _p[index].value;
        }
        if (typeof _p[index].value === "function") {
            var module = {
                exports: {}
            }, returnValue = _p[index].value(null, module.exports, module);
            _p[index].inited = true;
            _p[index].value = returnValue;
            if (returnValue !== undefined) {
                return returnValue;
            } else {
                for (var key in module.exports) {
                    if (module.exports.hasOwnProperty(key)) {
                        _p[index].inited = true;
                        _p[index].value = module.exports;
                        return module.exports;
                    }
                }
            }
        } else {
            _p[index].inited = true;
            return _p[index].value;
        }
    }
};

//.tmp_build/src/base/common.js
function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
    }
    return _typeof(obj);
}

/**
 * Created by hn on 14-3-17.
 */
_p[0] = {
    value: function(require) {
        // copy保护
        var MAX_COPY_DEEP = 10, commonUtils = {
            extend: function extend(target, source) {
                var isDeep = false;
                if (typeof target === "boolean") {
                    isDeep = target;
                    target = source;
                    source = [].splice.call(arguments, 2);
                } else {
                    source = [].splice.call(arguments, 1);
                }
                if (!target) {
                    throw new Error("Utils: extend, target can not be empty");
                }
                commonUtils.each(source, function(src) {
                    if (src && _typeof(src) === "object" || typeof src === "function") {
                        copy(isDeep, target, src);
                    }
                });
                return target;
            },
            /**
     * 返回给定节点parent是否包含target节点
     * @param parent
     * @param target
     */
            contains: function contains(parent, target) {
                if (parent.contains) {
                    return parent.contains(target);
                } else if (parent.compareDocumentPosition) {
                    return !!(parent.compareDocumentPosition(target) & 16);
                }
            },
            getRect: function getRect(node) {
                return node.getBoundingClientRect();
            },
            isArray: function isArray(obj) {
                return obj && {}.toString.call(obj) === "[object Array]";
            },
            isString: function isString(obj) {
                return typeof obj === "string";
            },
            proxy: function proxy(fn, context) {
                return function() {
                    return fn.apply(context, arguments);
                };
            },
            each: function each(obj, fn) {
                if (!obj) {
                    return;
                }
                if ("length" in obj && typeof obj.length === "number") {
                    for (var i = 0, len = obj.length; i < len; i++) {
                        if (fn.call(null, obj[i], i, obj) === false) {
                            break;
                        }
                    }
                } else {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            if (fn.call(null, obj[key], key, obj) === false) {
                                break;
                            }
                        }
                    }
                }
            }
        };
        function copy(isDeep, target, source, count) {
            count = count | 0;
            if (count > MAX_COPY_DEEP) {
                return source;
            }
            count++;
            commonUtils.each(source, function(value, index, origin) {
                if (isDeep) {
                    if (!value || _typeof(value) !== "object" && typeof value !== "function") {
                        target[index] = value;
                    } else {
                        target[index] = target[index] || (commonUtils.isArray(value) ? [] : {});
                        target[index] = copy(isDeep, target[index], value, count);
                    }
                } else {
                    target[index] = value;
                }
            });
            return target;
        }
        return commonUtils;
    }
};

//.tmp_build/src/base/component.js
/*!
 * 组件抽象类，所有的组件都是该类的子类
 * @abstract
 */
_p[1] = {
    value: function(require) {
        var kity = _p.r(22);
        return kity.createClass("Component", {
            constructor: function constructor() {}
        });
    }
};

//.tmp_build/src/base/event/event.js
/*!
 * event模块
 */
/* jshint camelcase: false */
_p[2] = {
    value: function(require, exports, modules) {
        var EVENT_LISTENER = {}, eid = 0, BEFORE_RESULT = true, KFEvent = _p.r(3), commonUtils = _p.r(0), EVENT_HANDLER = function EVENT_HANDLER(e) {
            var type = e.type, target = e.target, eid = this.__kfe_eid, hasAutoTrigger = /^(?:before|after)/.test(type), HANDLER_LIST = EVENT_LISTENER[eid][type];
            if (!hasAutoTrigger) {
                EventListener.trigger(target, "before" + type);
                if (BEFORE_RESULT === false) {
                    BEFORE_RESULT = true;
                    return false;
                }
            }
            commonUtils.each(HANDLER_LIST, function(handler, index) {
                if (!handler) {
                    return;
                }
                if (handler.call(target, e) === false) {
                    BEFORE_RESULT = false;
                    return BEFORE_RESULT;
                }
            });
            if (!hasAutoTrigger) {
                EventListener.trigger(target, "after" + type);
            }
        };
        var EventListener = {
            addEvent: function addEvent(target, type, handler) {
                var hasHandler = true, eventCache = null;
                if (!target.__kfe_eid) {
                    hasHandler = false;
                    target.__kfe_eid = generateId();
                    EVENT_LISTENER[target.__kfe_eid] = {};
                }
                eventCache = EVENT_LISTENER[target.__kfe_eid];
                if (!eventCache[type]) {
                    hasHandler = false;
                    eventCache[type] = [];
                }
                eventCache[type].push(handler);
                if (hasHandler) {
                    return;
                }
                target.addEventListener(type, EVENT_HANDLER, false);
            },
            trigger: function trigger(target, type, e) {
                e = e || KFEvent.createEvent(type, e);
                target.dispatchEvent(e);
            }
        };
        function generateId() {
            return ++eid;
        }
        return EventListener;
    }
};

//.tmp_build/src/base/event/kfevent.js
/**
 * Created by hn on 14-3-17.
 */
_p[3] = {
    value: function(require) {
        return {
            createEvent: function createEvent(type, e) {
                var evt = document.createEvent("Event");
                evt.initEvent(type, true, true);
                return evt;
            }
        };
    }
};

//.tmp_build/src/base/utils.js
/*!
 * 基础工具包
 */
_p[4] = {
    value: function(require) {
        var Utils = {}, commonUtils = _p.r(0);
        commonUtils.extend(Utils, commonUtils, _p.r(2));
        return Utils;
    }
};

//.tmp_build/src/bundle.js
/*
 * @Author: Demian
 * @Date: 2020-04-26 11:05:42
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-26 11:24:53
 * @description: 注册window中三方npm的服务
 */
_p[5] = {
    value: function() {
        return window.bundle;
    }
};

//.tmp_build/src/control/controller.js
/**
 * Created by hn on 14-4-11.
 */
_p[6] = {
    value: function(require) {
        var kity = _p.r(22), ListenerComponent = _p.r(9), ControllerComponent = kity.createClass("ControllerComponent", {
            constructor: function constructor(kfEditor) {
                this.kfEditor = kfEditor;
                this.components = {};
                this.initComponents();
            },
            initComponents: function initComponents() {
                this.components.listener = new ListenerComponent(this, this.kfEditor);
            }
        });
        return ControllerComponent;
    }
};

//.tmp_build/src/control/input-filter.js
/*!
 * 输入过滤器
 */
_p[7] = {
    value: function(require) {
        // 过滤列表， 其中的key对应于键盘事件的keycode， 带有s+字样的key，匹配的是shift+keycode
        var LIST = {
            32: "\\,",
            "s+219": "\\{",
            "s+221": "\\}",
            "220": "\\backslash",
            "s+51": "\\#",
            "s+52": "\\$",
            "s+53": "\\%",
            "s+54": "\\^",
            "s+55": "\\&",
            "s+189": "\\_",
            "s+192": "\\~"
        };
        return {
            getReplaceString: function getReplaceString(key) {
                return LIST[key] || null;
            }
        };
    }
};

//.tmp_build/src/control/input.js
/*!
* 输入控制组件
*/
_p[8] = {
    value: function(require, exports, module) {
        var kity = _p.r(22), kfUtils = _p.r(4), InputFilter = _p.r(7), KEY_CODE = {
            LEFT: 37,
            RIGHT: 39,
            DELETE: 8,
            // 输入法特殊处理
            INPUT: 229
        };
        return kity.createClass("InputComponent", {
            constructor: function constructor(parentComponent, kfEditor) {
                this.parentComponent = parentComponent;
                this.kfEditor = kfEditor;
                this.inputBox = this.createInputBox();
                this.initServices();
                this.initCommands();
                this.initEvent();
            },
            initServices: function initServices() {
                this.kfEditor.registerService("control.update.input", this, {
                    updateInput: this.updateInput
                });
                this.kfEditor.registerService("control.insert.string", this, {
                    insertStr: this.insertStr
                });
                // 删除元素
                this.kfEditor.registerService("control.delete.string", this, {
                    deleteStr: this.deleteStr
                });
            },
            initCommands: function initCommands() {
                this.kfEditor.registerCommand("focus", this, this.focus);
            },
            createInputBox: function createInputBox() {
                var editorContainer = this.kfEditor.getContainer(), box = this.kfEditor.getDocument().createElement("input");
                box.className = "kf-editor-input-box";
                box.type = "text";
                // focus是否可信
                box.isTrusted = false;
                editorContainer.appendChild(box);
                return box;
            },
            focus: function focus() {
                var rootInfo = null;
                this.inputBox.focus();
                // 如果当前不包含光标信息， 则手动设置光标信息， 以使得当前根节点被全选中
                if (!this.kfEditor.requestService("syntax.has.cursor.info")) {
                    rootInfo = this.kfEditor.requestService("syntax.get.root.group.info");
                    this.kfEditor.requestService("syntax.update.record.cursor", {
                        groupId: rootInfo.id,
                        startOffset: 0,
                        endOffset: rootInfo.content.length
                    });
                    this.kfEditor.requestService("control.update.input");
                }
                this.kfEditor.requestService("control.reselect");
            },
            setUntrusted: function setUntrusted() {
                this.inputBox.isTrusted = false;
            },
            setTrusted: function setTrusted() {
                this.inputBox.isTrusted = true;
            },
            updateInput: function updateInput() {
                var latexInfo = this.kfEditor.requestService("syntax.serialization");
                this.setUntrusted();
                this.inputBox.value = latexInfo.str;
                this.inputBox.selectionStart = latexInfo.startOffset;
                this.inputBox.selectionEnd = latexInfo.endOffset;
                this.inputBox.focus();
                this.setTrusted();
            },
            insertStr: function insertStr(str) {
                var latexInfo = this.kfEditor.requestService("syntax.serialization"), originString = latexInfo.str;
                // 拼接latex字符串
                originString = originString.substring(0, latexInfo.startOffset) + " " + str + " " + originString.substring(latexInfo.endOffset);
                this.restruct(originString);
                this.updateInput();
                this.kfEditor.requestService("ui.update.canvas.view");
            },
            initEvent: function initEvent() {
                var _self = this;
                kfUtils.addEvent(this.inputBox, "keydown", function(e) {
                    var isControl = false;
                    if (e.ctrlKey) {
                        // 处理用户控制行为
                        _self.processUserCtrl(e);
                        return;
                    }
                    switch (e.keyCode) {
                      case KEY_CODE.INPUT:
                        return;

                      case KEY_CODE.LEFT:
                        e.preventDefault();
                        _self.leftMove();
                        isControl = true;
                        break;

                      case KEY_CODE.RIGHT:
                        e.preventDefault();
                        _self.rightMove();
                        isControl = true;
                        break;

                      case KEY_CODE.DELETE:
                        e.preventDefault();
                        _self["delete"]();
                        isControl = true;
                        break;
                    }
                    if (isControl) {
                        _self.kfEditor.requestService("ui.update.canvas.view");
                    }
                    if (!_self.pretreatmentInput(e)) {
                        e.preventDefault();
                    }
                });
                // 用户输入
                kfUtils.addEvent(this.inputBox, "input", function(e) {
                    _self.processingInput();
                });
                // 光标显隐控制
                kfUtils.addEvent(this.inputBox, "blur", function(e) {
                    // _self.kfEditor.requestService( "ui.toolbar.disable" );
                    // _self.kfEditor.requestService( "ui.toolbar.close" );
                    _self.kfEditor.requestService("control.cursor.hide");
                    _self.kfEditor.requestService("render.clear.select");
                });
                kfUtils.addEvent(this.inputBox, "focus", function(e) {
                    // _self.kfEditor.requestService( "ui.toolbar.enable" );
                    if (this.isTrusted) {
                        _self.kfEditor.requestService("control.reselect");
                    }
                });
                // 粘贴过滤
                kfUtils.addEvent(this.inputBox, "paste", function(e) {
                    e.preventDefault();
                });
            },
            hasRootplaceholder: function hasRootplaceholder() {
                return this.kfEditor.requestService("syntax.has.root.placeholder");
            },
            leftMove: function leftMove() {
                // 当前处于"根占位符"上， 则不允许move
                if (this.hasRootplaceholder()) {
                    return;
                }
                this.kfEditor.requestService("syntax.cursor.move.left");
                this.update();
            },
            rightMove: function rightMove() {
                if (this.hasRootplaceholder()) {
                    return;
                }
                this.kfEditor.requestService("syntax.cursor.move.right");
                this.update();
            },
            "delete": function _delete() {
                var isNeedRedraw = null;
                // 当前处于"根占位符"上，不允许删除操作
                if (this.hasRootplaceholder()) {
                    return;
                }
                // 返回是否修要重绘
                isNeedRedraw = this.kfEditor.requestService("syntax.delete.group");
                if (isNeedRedraw) {
                    this.updateInput();
                    this.processingInput();
                } else {
                    this.updateInput();
                    this.kfEditor.requestService("control.reselect");
                }
            },
            processUserCtrl: function processUserCtrl(e) {
                e.preventDefault();
                switch (e.keyCode) {
                  // ctrl + A
                    case 65:
                    this.kfEditor.requestService("control.select.all");
                    break;

                  // ctrl + S
                    case 83:
                    this.kfEditor.requestService("print.image");
                    break;
                }
            },
            // 输入前的预处理， 执行输入过滤
            pretreatmentInput: function pretreatmentInput(evt) {
                var keyCode = this.getKeyCode(evt), replaceStr = InputFilter.getReplaceString(keyCode);
                if (replaceStr === null) {
                    return true;
                }
                this.insertStr(replaceStr);
                return false;
            },
            getKeyCode: function getKeyCode(e) {
                return (e.shiftKey ? "s+" : "") + e.keyCode;
            },
            processingInput: function processingInput() {
                this.restruct(this.inputBox.value);
                this.kfEditor.requestService("ui.update.canvas.view");
            },
            // 根据给定的字符串重新进行构造公式
            restruct: function restruct(latexStr) {
                this.kfEditor.requestService("render.draw", latexStr);
                this.kfEditor.requestService("control.reselect");
            },
            update: function update() {
                // 更新输入框
                this.updateInput();
                this.kfEditor.requestService("control.reselect");
            },
            deleteStr: function deleteStr() {
                this["delete"]();
            }
        });
    }
};

//.tmp_build/src/control/listener.js
/**
 * Created by hn on 14-4-11.
 */
_p[9] = {
    value: function(require, exports, module) {
        var kity = _p.r(22), // 光标定位
        LocationComponent = _p.r(10), // 输入控制组件
        InputComponent = _p.r(8), // 选区
        SelectionComponent = _p.r(11);
        return kity.createClass("MoveComponent", {
            constructor: function constructor(parentComponent, kfEditor) {
                this.parentComponent = parentComponent;
                this.kfEditor = kfEditor;
                this.components = {};
                this.initComponents();
            },
            initComponents: function initComponents() {
                this.components.location = new LocationComponent(this, this.kfEditor);
                this.components.selection = new SelectionComponent(this, this.kfEditor);
                this.components.input = new InputComponent(this, this.kfEditor);
            }
        });
    }
};

//.tmp_build/src/control/location.js
/*!
 * 光标定位组件
 */
_p[10] = {
    value: function(require, exports, module) {
        var kity = _p.r(22);
        return kity.createClass("LocationComponent", {
            constructor: function constructor(parentComponent, kfEditor) {
                this.parentComponent = parentComponent;
                this.kfEditor = kfEditor;
                // 创建光标
                this.paper = this.getPaper();
                this.cursorShape = this.createCursor();
                this.initServices();
                this.initEvent();
            },
            getPaper: function getPaper() {
                return this.kfEditor.requestService("render.get.paper");
            },
            initServices: function initServices() {
                // 重定位光标
                this.kfEditor.registerService("control.cursor.relocation", this, {
                    relocationCursor: this.updateCursor
                });
                // 清除光标
                this.kfEditor.registerService("control.cursor.hide", this, {
                    hideCursor: this.hideCursor
                });
                this.kfEditor.registerService("control.reselect", this, {
                    reselect: this.reselect
                });
                this.kfEditor.registerService("control.get.cursor.location", this, {
                    getCursorLocation: this.getCursorLocation
                });
            },
            createCursor: function createCursor() {
                var cursorShape = new kity.Rect(1, 0, 0, 0).fill("black");
                cursorShape.setAttr("style", "display: none");
                this.paper.addShape(cursorShape);
                return cursorShape;
            },
            // 光标定位监听
            initEvent: function initEvent() {
                var eventServiceObject = this.kfEditor.request("ui.canvas.container.event"), _self = this;
                eventServiceObject.on("mousedown", function(e) {
                    e.preventDefault();
                    _self.updateCursorInfo(e);
                    _self.kfEditor.requestService("control.update.input");
                    _self.reselect();
                });
            },
            updateCursorInfo: function updateCursorInfo(evt) {
                var wrapNode = null, groupInfo = null, index = -1;
                // 有根占位符存在， 所有定位到定位到根占位符内部
                if (this.kfEditor.requestService("syntax.has.root.placeholder")) {
                    this.kfEditor.requestService("syntax.update.record.cursor", {
                        groupId: this.kfEditor.requestService("syntax.get.root.group.info").id,
                        startOffset: 0,
                        endOffset: 1
                    });
                    return false;
                }
                wrapNode = this.kfEditor.requestService("position.get.wrap", evt.target);
                // 占位符处理, 选中该占位符
                if (wrapNode && this.kfEditor.requestService("syntax.is.placeholder.node", wrapNode.id)) {
                    groupInfo = this.kfEditor.requestService("position.get.group.info", wrapNode);
                    this.kfEditor.requestService("syntax.update.record.cursor", groupInfo.group.id, groupInfo.index, groupInfo.index + 1);
                    return;
                }
                groupInfo = this.kfEditor.requestService("position.get.group", evt.target);
                if (groupInfo === null) {
                    groupInfo = this.kfEditor.requestService("syntax.get.root.group.info");
                }
                index = this.getIndex(evt.clientX, groupInfo);
                this.kfEditor.requestService("syntax.update.record.cursor", groupInfo.id, index);
            },
            hideCursor: function hideCursor() {
                this.cursorShape.setAttr("style", "display: none");
            },
            // 根据当前的光标信息， 对选区和光标进行更新
            reselect: function reselect() {
                var cursorInfo = this.kfEditor.requestService("syntax.get.record.cursor"), groupInfo = null;
                this.hideCursor();
                // 根节点单独处理
                if (this.kfEditor.requestService("syntax.is.select.placeholder")) {
                    groupInfo = this.kfEditor.requestService("syntax.get.group.content", cursorInfo.groupId);
                    this.kfEditor.requestService("render.select.group", groupInfo.content[cursorInfo.startOffset].id);
                    return;
                }
                if (cursorInfo.startOffset === cursorInfo.endOffset) {
                    // 更新光标位置
                    this.updateCursor();
                    // 请求背景着色
                    this.kfEditor.requestService("render.tint.current.cursor");
                } else {
                    this.kfEditor.requestService("render.select.current.cursor");
                }
            },
            updateCursor: function updateCursor() {
                var cursorInfo = this.kfEditor.requestService("syntax.get.record.cursor");
                if (cursorInfo.startOffset !== cursorInfo.endOffset) {
                    this.hideCursor();
                    return;
                }
                var groupInfo = this.kfEditor.requestService("syntax.get.group.content", cursorInfo.groupId), isBefore = cursorInfo.endOffset === 0, index = isBefore ? 0 : cursorInfo.endOffset - 1, focusChild = groupInfo.content[index], paperContainerRect = getRect(this.paper.container.node), cursorOffset = 0, focusChildRect = getRect(focusChild), cursorTransform = this.cursorShape.getTransform(this.cursorShape), canvasZoom = this.kfEditor.requestService("render.get.canvas.zoom"), formulaZoom = this.paper.getZoom();
                this.cursorShape.setHeight(focusChildRect.height / canvasZoom / formulaZoom);
                // 计算光标偏移位置
                cursorOffset = isBefore ? focusChildRect.left - 2 : focusChildRect.left + focusChildRect.width - 2;
                cursorOffset -= paperContainerRect.left;
                // 定位光标
                cursorTransform.m.e = Math.floor(cursorOffset / canvasZoom / formulaZoom) + .5;
                cursorTransform.m.f = (focusChildRect.top - paperContainerRect.top) / canvasZoom / formulaZoom;
                this.cursorShape.setMatrix(cursorTransform);
                this.cursorShape.setAttr("style", "display: block");
            },
            getCursorLocation: function getCursorLocation() {
                var rect = this.cursorShape.getRenderBox("paper");
                return {
                    x: rect.x,
                    y: rect.y
                };
            },
            getIndex: function getIndex(distance, groupInfo) {
                var index = -1, children = groupInfo.content, boundingRect = null;
                for (var i = children.length - 1, child = null; i >= 0; i--) {
                    index = i;
                    child = children[i];
                    boundingRect = getRect(child);
                    if (boundingRect.left < distance) {
                        if (boundingRect.left + boundingRect.width / 2 < distance) {
                            index += 1;
                        }
                        break;
                    }
                }
                return index;
            }
        });
        function getRect(node) {
            return node.getBoundingClientRect();
        }
    }
};

//.tmp_build/src/control/selection.js
/*!
 * 光标选区组件
 */
_p[11] = {
    value: function(require, exports, module) {
        var kity = _p.r(22), kfUtils = _p.r(4), // 鼠标移动临界距离
        MAX_DISTANCE = 10;
        return kity.createClass("SelectionComponent", {
            constructor: function constructor(parentComponent, kfEditor) {
                this.parentComponent = parentComponent;
                this.kfEditor = kfEditor;
                this.isDrag = false;
                this.isMousedown = false;
                this.startPoint = {
                    x: -1,
                    y: -1
                };
                // 起始位置是占位符
                this.startGroupIsPlaceholder = false;
                this.startGroup = {};
                this.initServices();
                this.initEvent();
            },
            initServices: function initServices() {
                this.kfEditor.registerService("control.select.all", this, {
                    selectAll: this.selectAll
                });
            },
            initEvent: function initEvent() {
                var eventServiceObject = this.kfEditor.request("ui.canvas.container.event"), _self = this;
                /* 选区拖拽 start */
                eventServiceObject.on("mousedown", function(e) {
                    e.preventDefault();
                    // 存在根占位符， 禁止拖动
                    if (_self.kfEditor.requestService("syntax.has.root.placeholder")) {
                        return false;
                    }
                    _self.isMousedown = true;
                    _self.updateStartPoint(e.clientX, e.clientY);
                    _self.updateStartGroup();
                });
                eventServiceObject.on("mouseup", function(e) {
                    e.preventDefault();
                    _self.stopUpdateSelection();
                });
                eventServiceObject.on("mousemove", function(e) {
                    e.preventDefault();
                    if (!_self.isDrag) {
                        if (_self.isMousedown) {
                            // 移动的距离达到临界条件
                            if (MAX_DISTANCE < _self.getDistance(e.clientX, e.clientY)) {
                                _self.kfEditor.requestService("control.cursor.hide");
                                _self.startUpdateSelection();
                            }
                        }
                    } else {
                        if (e.which !== 1) {
                            _self.stopUpdateSelection();
                            return;
                        }
                        _self.updateSelection(e.target, e.clientX, e.clientY);
                    }
                });
                /* 选区拖拽 end */
                /* 双击选区 start */
                eventServiceObject.on("dblclick", function(e) {
                    _self.updateSelectionByTarget(e.target);
                });
            },
            getDistance: function getDistance(x, y) {
                var distanceX = Math.abs(x - this.startPoint.x), distanceY = Math.abs(y - this.startPoint.y);
                return Math.max(distanceX, distanceY);
            },
            updateStartPoint: function updateStartPoint(x, y) {
                this.startPoint.x = x;
                this.startPoint.y = y;
            },
            updateStartGroup: function updateStartGroup() {
                var cursorInfo = this.kfEditor.requestService("syntax.get.record.cursor");
                this.startGroupIsPlaceholder = this.kfEditor.requestService("syntax.is.select.placeholder");
                this.startGroup = {
                    groupInfo: this.kfEditor.requestService("syntax.get.group.content", cursorInfo.groupId),
                    offset: cursorInfo.startOffset
                };
            },
            startUpdateSelection: function startUpdateSelection() {
                this.isDrag = true;
                this.isMousedown = false;
                this.clearSelection();
            },
            stopUpdateSelection: function stopUpdateSelection() {
                this.isDrag = false;
                this.isMousedown = false;
                this.kfEditor.requestService("control.update.input");
            },
            clearSelection: function clearSelection() {
                this.kfEditor.requestService("render.clear.select");
            },
            updateSelection: function updateSelection(target, x, y) {
                // 移动方向， true为右， false为左
                var dir = x > this.startPoint.x, cursorInfo = {}, communityGroupInfo = null, inRightArea = false, startGroupInfo = this.startGroup, currentGroupNode = null, currentGroupInfo = this.getGroupInof(x, target);
                if (currentGroupInfo.groupInfo.id === startGroupInfo.groupInfo.id) {
                    cursorInfo = {
                        groupId: currentGroupInfo.groupInfo.id,
                        startOffset: startGroupInfo.offset,
                        endOffset: currentGroupInfo.offset
                    };
                    // 如果起始点是占位符， 要根据移动方向修正偏移
                    if (this.startGroupIsPlaceholder) {
                        // 左移修正
                        if (!dir) {
                            cursorInfo.startOffset += 1;
                        } else if (cursorInfo.startOffset === cursorInfo.endOffset) {
                            cursorInfo.endOffset += 1;
                        }
                    }
                } else {
                    // 存在包含关系
                    if (kfUtils.contains(startGroupInfo.groupInfo.groupObj, currentGroupInfo.groupInfo.groupObj)) {
                        cursorInfo = {
                            groupId: startGroupInfo.groupInfo.id,
                            startOffset: startGroupInfo.offset,
                            endOffset: this.getIndex(startGroupInfo.groupInfo.groupObj, target, x)
                        };
                    } else if (kfUtils.contains(currentGroupInfo.groupInfo.groupObj, startGroupInfo.groupInfo.groupObj)) {
                        cursorInfo = {
                            groupId: currentGroupInfo.groupInfo.id,
                            startOffset: this.kfEditor.requestService("position.get.index", currentGroupInfo.groupInfo.groupObj, startGroupInfo.groupInfo.groupObj),
                            endOffset: currentGroupInfo.offset
                        };
                        // 向左移动要修正开始偏移
                        if (!dir) {
                            cursorInfo.startOffset += 1;
                        }
                    } else {
                        // 获取公共容器
                        communityGroupInfo = this.getCommunityGroup(startGroupInfo.groupInfo, currentGroupInfo.groupInfo);
                        // 修正偏移相同时的情况， 比如在分数中选中时
                        if (communityGroupInfo.startOffset === communityGroupInfo.endOffset) {
                            communityGroupInfo.endOffset += 1;
                        } else {
                            // 当前光标移动所在的组元素节点
                            currentGroupNode = communityGroupInfo.group.content[communityGroupInfo.endOffset];
                            inRightArea = this.kfEditor.requestService("position.get.area", currentGroupNode, x);
                            // 当前移动到右区域， 则更新结束偏移
                            if (inRightArea) {
                                communityGroupInfo.endOffset += 1;
                            }
                            // 左移动时， 修正起始偏移
                            if (!dir) {
                                communityGroupInfo.startOffset += 1;
                            }
                        }
                        cursorInfo = {
                            groupId: communityGroupInfo.group.id,
                            startOffset: communityGroupInfo.startOffset,
                            endOffset: communityGroupInfo.endOffset
                        };
                    }
                }
                // 更新光标信息
                this.kfEditor.requestService("syntax.update.record.cursor", cursorInfo.groupId, cursorInfo.startOffset, cursorInfo.endOffset);
                // 仅重新选中就可以，不用更新输入框内容
                this.kfEditor.requestService("control.reselect");
            },
            updateSelectionByTarget: function updateSelectionByTarget(target) {
                var parentGroupInfo = this.kfEditor.requestService("position.get.parent.group", target), containerInfo = null, cursorInfo = {};
                if (parentGroupInfo === null) {
                    return;
                }
                // 如果是根节点， 则直接选中其内容
                if (this.kfEditor.requestService("syntax.is.root.node", parentGroupInfo.id)) {
                    this.selectAll();
                    return;
                } else {
                    // 当前组可以是容器， 则选中该容器的内容
                    if (!this.kfEditor.requestService("syntax.is.virtual.node", parentGroupInfo.id)) {
                        cursorInfo = {
                            groupId: parentGroupInfo.id,
                            startOffset: 0,
                            endOffset: parentGroupInfo.content.length
                        };
                    } else {
                        // 获取包含父组的容器
                        containerInfo = this.kfEditor.requestService("position.get.group.info", parentGroupInfo.groupObj);
                        cursorInfo = {
                            groupId: containerInfo.group.id,
                            startOffset: containerInfo.index,
                            endOffset: containerInfo.index + 1
                        };
                    }
                }
                this.kfEditor.requestService("syntax.update.record.cursor", cursorInfo);
                this.kfEditor.requestService("control.reselect");
                this.kfEditor.requestService("control.update.input");
            },
            selectAll: function selectAll() {
                var rootGroupInfo = this.kfEditor.requestService("syntax.get.root.group.info");
                var cursorInfo = {
                    groupId: rootGroupInfo.id,
                    startOffset: 0,
                    endOffset: rootGroupInfo.content.length
                };
                this.kfEditor.requestService("syntax.update.record.cursor", cursorInfo);
                this.kfEditor.requestService("control.reselect");
                this.kfEditor.requestService("control.update.input");
            },
            getGroupInof: function getGroupInof(offset, target) {
                var groupInfo = this.kfEditor.requestService("position.get.group", target);
                if (groupInfo === null) {
                    groupInfo = this.kfEditor.requestService("syntax.get.root.group.info");
                }
                var index = this.kfEditor.requestService("position.get.location.info", offset, groupInfo);
                return {
                    groupInfo: groupInfo,
                    offset: index
                };
            },
            getIndex: function getIndex(groupNode, targetNode, offset) {
                var index = this.kfEditor.requestService("position.get.index", groupNode, targetNode), groupInfo = this.kfEditor.requestService("syntax.get.group.content", groupNode.id), targetWrapNode = groupInfo.content[index], targetRect = kfUtils.getRect(targetWrapNode);
                if (targetRect.left + targetRect.width / 2 < offset) {
                    index += 1;
                }
                return index;
            },
            /**
     * 根据给定的两个组信息， 获取其所在的公共容器及其各自的偏移
     * @param startGroupInfo 组信息
     * @param endGroupInfo 另一个组信息
     */
            getCommunityGroup: function getCommunityGroup(startGroupInfo, endGroupInfo) {
                var bigBoundingGroup = null, targetGroup = startGroupInfo.groupObj, groupNode = null;
                while (bigBoundingGroup = this.kfEditor.requestService("position.get.group.info", targetGroup)) {
                    targetGroup = bigBoundingGroup.group.groupObj;
                    if (kfUtils.contains(bigBoundingGroup.group.groupObj, endGroupInfo.groupObj)) {
                        break;
                    }
                }
                groupNode = bigBoundingGroup.group.groupObj;
                return {
                    group: bigBoundingGroup.group,
                    startOffset: bigBoundingGroup.index,
                    endOffset: this.kfEditor.requestService("position.get.index", groupNode, endGroupInfo.groupObj)
                };
            }
        });
    }
};

//.tmp_build/src/def/group-type.js
/*!
 * 组类型
 */
_p[12] = {
    value: function() {
        return {
            GROUP: "kf-editor-group",
            VIRTUAL: "kf-editor-virtual-group"
        };
    }
};

//.tmp_build/src/editor/Message.js
/*
 * @Author: Demian
 * @Date: 2020-04-29 21:14:35
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-30 10:26:17
 */
_p[13] = {
    value: function(require) {
        var kity = _p.r(22);
        var Messager = kity.createClass("Messager", {
            constructor: function constructor() {},
            getCheckServiceType: function getCheckServiceType() {
                return "common.requestFunctions";
            },
            // 实现webService如何去接收消息
            onReceiveMessage: function onReceiveMessage(messageHandler) {
                document.addEventListener("documentMessage", function(e) {
                    e.detail && e.detail.headers && messageHandler(e.detail);
                });
            },
            // 实现webService如何去发送消息
            sendAction: function sendAction(_ref) {
                var type = _ref.type, headers = _ref.headers, data = _ref.data;
                var event = new CustomEvent("documentMessage", {
                    detail: {
                        type: type,
                        headers: headers,
                        data: data
                    }
                });
                document.dispatchEvent(event);
            }
        });
        return Messager;
    }
};

//.tmp_build/src/editor/editor.js
/*!
 * 编辑器主体结构
 */
_p[14] = {
    value: function(require) {
        var kity = _p.r(22), Utils = _p.r(4), bundle = _p.r(5), Messager = _p.r(13), defaultOpt = {
            formula: {
                fontsize: 50,
                autoresize: false
            },
            ui: {
                zoom: true,
                maxzoom: 2,
                minzoom: 1
            }
        };
        // 同步组件列表
        var COMPONENTS = {}, // 异步组件列表
        ResourceManager = _p.r(21).ResourceManager;
        var KFEditor = kity.createClass("KFEditor", {
            constructor: function constructor(container, opt) {
                this.options = Utils.extend(true, {}, defaultOpt, opt);
                this.FormulaClass = null;
                // 就绪状态
                this._readyState = false;
                this._callbacks = [];
                this.container = container;
                this.services = {};
                this.commands = {};
                this.initResource();
                this.initWebService();
            },
            isReady: function isReady() {
                return !!this._readyState;
            },
            triggerReady: function triggerReady() {
                var cb = null, _self = this;
                while (cb = this._callbacks.shift()) {
                    cb.call(_self, _self);
                }
            },
            ready: function ready(cb) {
                if (this._readyState) {
                    cb.call(this, this);
                } else {
                    this._callbacks.push(cb);
                }
            },
            getContainer: function getContainer() {
                return this.container;
            },
            getDocument: function getDocument() {
                return this.container.ownerDocument;
            },
            getFormulaClass: function getFormulaClass() {
                return this.FormulaClass;
            },
            getOptions: function getOptions() {
                return this.options;
            },
            initResource: function initResource() {
                var _self = this;
                ResourceManager.ready(function(Formula) {
                    _self.FormulaClass = Formula;
                    _self.initComponents();
                    _self._readyState = true;
                    _self.triggerReady();
                }, this.options.resource);
            },
            initWebService: function initWebService() {
                var _this = this;
                var WebService = bundle.WebService, CustomWebService = bundle.CustomWebService;
                if (this.options.ui.protocol === "webview") {
                    this.eclassWebService = new WebService("webview");
                } else if (this.options.ui.protocol === "iframe") {
                    this.eclassWebService = new WebService("iframe");
                } else if (this.options.ui.protocol === "documentEvent") {
                    this.eclassWebService = new CustomWebService({
                        messager: new Messager()
                    });
                }
                this.eclassWebService.on("common.readFormula", function(msg) {
                    if (msg.body.formula) {
                        _this.execCommand("render", msg.body.formula);
                    }
                });
                this.eclassWebService.on("common.clearFormula", function() {
                    _this.execCommand("render", "\\placeholder");
                });
                this.eclassWebService.send({
                    type: "common.ready"
                });
            },
            /**
     * 初始化同步组件
     */
            initComponents: function initComponents() {
                var _self = this;
                Utils.each(COMPONENTS, function(Component, name) {
                    new Component(_self, _self.options[name]);
                });
            },
            requestService: function requestService(serviceName, args) {
                var serviceObject = getService.call(this, serviceName);
                return serviceObject.service[serviceObject.key].apply(serviceObject.provider, [].slice.call(arguments, 1));
            },
            request: function request(serviceName) {
                var serviceObject = getService.call(this, serviceName);
                return serviceObject.service;
            },
            registerService: function registerService(serviceName, provider, serviceObject) {
                var key = null;
                for (key in serviceObject) {
                    if (serviceObject[key] && serviceObject.hasOwnProperty(key)) {
                        serviceObject[key] = Utils.proxy(serviceObject[key], provider);
                    }
                }
                this.services[serviceName] = {
                    provider: provider,
                    key: key,
                    service: serviceObject
                };
            },
            registerCommand: function registerCommand(commandName, executor, execFn) {
                this.commands[commandName] = {
                    executor: executor,
                    execFn: execFn
                };
            },
            execCommand: function execCommand(commandName, args) {
                console.log("[execCommand]", commandName);
                var commandObject = this.commands[commandName];
                if (!commandObject) {
                    throw new Error("KFEditor: not found command, " + commandName);
                }
                return commandObject.execFn.apply(commandObject.executor, [].slice.call(arguments, 1));
            }
        });
        function getService(serviceName) {
            var serviceObject = this.services[serviceName];
            if (!serviceObject) {
                throw new Error("KFEditor: not found service, " + serviceName);
            }
            return serviceObject;
        }
        Utils.extend(KFEditor, {
            registerComponents: function registerComponents(name, component) {
                COMPONENTS[name] = component;
            }
        });
        return KFEditor;
    }
};

//.tmp_build/src/editor/factory.js
/**
 * 编辑器工厂方法
 * 用于创建编辑器
 */
_p[15] = {
    value: function(require) {
        var kity = _p.r(22), KFEditor = _p.r(14);
        /* ------------------------------- 编辑器装饰对象 */
        function EditorWrapper(container, options) {
            var _self = this;
            this._callbacks = [];
            this.editor = new KFEditor(container, options);
            this.editor.ready(function() {
                _self._trigger();
            });
        }
        EditorWrapper.prototype._trigger = function() {
            var editor = this.editor;
            kity.Utils.each(this._callbacks, function(cb) {
                cb.call(editor, editor);
            });
        };
        EditorWrapper.prototype.ready = function(cb) {
            if (this.editor.isReady()) {
                cb.call(this.editor, this.editor);
            } else {
                this._callbacks.push(cb);
            }
        };
        return {
            create: function create(container, options) {
                return new EditorWrapper(container, options);
            }
        };
    }
};

//.tmp_build/src/jquery.js
/**
 * Created by hn on 14-3-31.
 */
_p[16] = {
    value: function() {
        return window.jQuery;
    }
};

//.tmp_build/src/kf-ext/def.js
/**
 * Created by hn on 14-3-18.
 */
_p[17] = {
    value: function() {
        return {
            selectColor: "rgba(42, 106, 189, 0.6)",
            allSelectColor: "rgba(42, 106, 189, 0.6)"
        };
    }
};

//.tmp_build/src/kf-ext/expression/placeholder.js
/**
 * 占位符表达式， 扩展KF自有的Empty表达式
 */
_p[18] = {
    value: function(require, exports, module) {
        var kity = _p.r(22), kf = _p.r(21), PlaceholderOperator = _p.r(20);
        return kity.createClass("PlaceholderExpression", {
            base: kf.CompoundExpression,
            constructor: function constructor() {
                this.callBase();
                this.setFlag("Placeholder");
                this.label = null;
                this.box.setAttr("data-type", null);
                this.setOperator(new PlaceholderOperator());
            },
            setLabel: function setLabel(label) {
                this.label = label;
            },
            getLabel: function getLabel() {
                return this.label;
            },
            // 重载占位符的setAttr， 以处理根占位符节点
            setAttr: function setAttr(key, val) {
                if (key === "label") {
                    this.setLabel(val);
                } else {
                    if (key.label) {
                        this.setLabel(key.label);
                        // 删除label
                        delete key.label;
                    }
                    // 继续设置其他属性
                    this.callBase(key, val);
                }
            },
            select: function select() {
                this.getOperator().select();
            },
            selectAll: function selectAll() {
                this.getOperator().selectAll();
            },
            unselect: function unselect() {
                this.getOperator().unselect();
            }
        });
    }
};

//.tmp_build/src/kf-ext/extension.js
/**
 * 公式扩展接口
 */
_p[19] = {
    value: function(require) {
        var kf = _p.r(21), SELECT_COLOR = _p.r(17).selectColor, ALL_SELECT_COLOR = _p.r(17).allSelectColor;
        function ext(parser) {
            kf.PlaceholderExpression = _p.r(18);
            kf.Expression.prototype.select = function() {
                this.box.fill(SELECT_COLOR);
            };
            kf.Expression.prototype.selectAll = function() {
                this.box.fill(ALL_SELECT_COLOR);
            };
            kf.Expression.prototype.unselect = function() {
                this.box.fill("transparent");
            };
            // 扩展解析和逆解析
            parser.getKFParser().expand({
                parse: {
                    placeholder: {
                        name: "placeholder",
                        handler: function handler(info) {
                            delete info.handler;
                            info.operand = [];
                            return info;
                        },
                        sign: false
                    }
                },
                reverse: {
                    placeholder: function placeholder() {
                        return "\\placeholder ";
                    }
                }
            });
        }
        return {
            ext: ext
        };
    }
};

//.tmp_build/src/kf-ext/operator/placeholder.js
/**
 * 占位符操作符
 */
_p[20] = {
    value: function(require, exports, modules) {
        var kity = _p.r(22), // FILL_COLOR = _p.r(31).rootPlaceholder.color,
        SELECT_COLOR = _p.r(17).selectColor, ALL_SELECT_COLOR = _p.r(17).allSelectColor;
        return kity.createClass("PlaceholderOperator", {
            base: _p.r(21).Operator,
            constructor: function constructor() {
                this.opShape = null;
                this.callBase("Placeholder");
            },
            applyOperand: function applyOperand() {
                this.opShape = generateOpShape(this, this.parentExpression.getLabel());
                this.parentExpression.expand(20, 20);
                this.parentExpression.translateElement(10, 10);
            },
            select: function select() {
                // 默认placeholder改为光标后, select要置为黑色
                var isPlaceholder = !!this.parentExpression.getLabel();
                this.opShape.fill(isPlaceholder ? "#000" : SELECT_COLOR);
            },
            selectAll: function selectAll() {
                this.opShape.fill(ALL_SELECT_COLOR);
            },
            unselect: function unselect() {
                this.opShape.fill("transparent");
            }
        });
        function generateOpShape(operator, label) {
            if (label !== null) {
                return createCursor(operator, label);
            } else {
                return createCommonShape(operator);
            }
        }
        // 创建通用图形
        function createCommonShape(operator) {
            var w = 35, h = 50, shape = null;
            shape = new kity.Rect(w, h, 0, 0).stroke("black").fill("transparent");
            shape.setAttr("stroke-dasharray", "5, 5");
            operator.addOperatorShape(shape);
            return shape;
        }
        function createCursor(operator, label) {
            var cursorShape = new kity.Rect(1, 50, 0, 0).fill("#000");
            cursorShape.setAttr("style", "display: block");
            operator.addOperatorShape(cursorShape);
            return cursorShape;
        }
    }
};

//.tmp_build/src/kf.js
/**
 * Created by hn on 14-3-12.
 */
_p[21] = {
    value: function() {
        return window.kf;
    }
};

//.tmp_build/src/kity.js
/**
 * 数学公式Latex语法解析器
 */
_p[22] = {
    value: function() {
        return window.kity;
    }
};

//.tmp_build/src/parse/parser.js
/**
 * 数学公式解析器
 */
_p[23] = {
    value: function(require) {
        var KFParser = _p.r(21).Parser, kity = _p.r(22), CURSOR_CHAR = _p.r(31).cursorCharacter, VGROUP_LIST = _p.r(24), ROOT_P_TEXT = _p.r(31).rootPlaceholder.content, COMBINATION_NAME = "combination", PID_PREFIX = "_kf_editor_", GROUP_TYPE = _p.r(12), PID = 0;
        var Parser = kity.createClass("Parser", {
            constructor: function constructor(kfEditor) {
                this.kfEditor = kfEditor;
                this.callBase();
                // kityformula 解析器
                this.kfParser = KFParser.use("latex");
                this.initKFormulExtension();
                this.pid = generateId();
                this.groupRecord = 0;
                this.tree = null;
                this.isResetId = true;
                this.initServices();
            },
            parse: function parse(str, isResetId) {
                var parsedResult = null;
                this.isResetId = !!isResetId;
                if (this.isResetId) {
                    this.resetGroupId();
                }
                parsedResult = this.kfParser.parse(str);
                // 对解析出来的结果树做适当的处理，使得编辑器能够更容易地识别当前表达式的语义
                supplementTree(this, parsedResult.tree);
                return parsedResult;
            },
            // 序列化， parse的逆过程
            serialization: function serialization(tree) {
                return this.kfParser.serialization(tree);
            },
            initServices: function initServices() {
                this.kfEditor.registerService("parser.parse", this, {
                    parse: this.parse
                });
                this.kfEditor.registerService("parser.latex.serialization", this, {
                    serialization: this.serialization
                });
            },
            getKFParser: function getKFParser() {
                return this.kfParser;
            },
            // 初始化KF扩展
            initKFormulExtension: function initKFormulExtension() {
                _p.r(19).ext(this);
            },
            resetGroupId: function resetGroupId() {
                this.groupRecord = 0;
            },
            getGroupId: function getGroupId() {
                return this.pid + "_" + ++this.groupRecord;
            }
        });
        // 把解析树丰富成公式编辑器的语义树, 该语义化的树同时也是合法的解析树
        function supplementTree(parser, tree, parentTree) {
            var currentOperand = null, // 只有根节点才没有parentTree
            isRoot = !parentTree;
            tree.attr = tree.attr || {};
            tree.attr.id = parser.getGroupId();
            if (isRoot) {
                processRootGroup(parser, tree);
            } else if (parentTree.attr["data-root"] && tree.name === "placeholder" && onlyPlaceholder(parentTree.operand)) {
                tree.attr.label = ROOT_P_TEXT;
            }
            for (var i = 0, len = tree.operand.length; i < len; i++) {
                currentOperand = tree.operand[i];
                if (isVirtualGroup(tree)) {
                    // 虚拟组处理
                    processVirtualGroup(parser, i, tree, currentOperand);
                } else {
                    processGroup(parser, i, tree, currentOperand);
                }
            }
            return tree;
        }
        function generateId() {
            return PID_PREFIX + ++PID;
        }
        function processRootGroup(parser, tree) {
            // 如果isResetId为false， 表示当前生成的是子树
            // 则不做data-root标记， 同时更改该包裹的类型为GROUP_TYPE.VIRTUAL
            if (!parser.isResetId) {
                tree.attr["data-type"] = GROUP_TYPE.VIRTUAL;
            } else {
                tree.attr["data-root"] = "true";
            }
        }
        /**
   * 虚拟组处理
   * @param parser 解析器实例
   * @param index 当前处理的子树所在其父节点的索引位置
   * @param tree 需要处理的树父树
   * @param subtree 当前需要处理的树
   */
        function processVirtualGroup(parser, index, tree, subtree) {
            // 括号组的前两个元素不用处理
            if (tree.name === "brackets" && index < 2) {
                return;
            } else if (tree.name === "function" && index === 0) {
                return;
            }
            tree.attr["data-type"] = GROUP_TYPE.VIRTUAL;
            if (!subtree) {
                tree.operand[index] = subtree;
            } else if (typeof subtree === "string") {
                tree.operand[index] = createGroup(parser);
                tree.operand[index].operand[0] = subtree;
            } else if (isPlaceholder(subtree)) {
                tree.operand[index] = createGroup(parser);
                tree.operand[index].operand[0] = supplementTree(parser, subtree, tree.operand[index]);
            } else {
                tree.operand[index] = supplementTree(parser, subtree, tree);
            }
        }
        function processGroup(parser, index, tree, subtree) {
            tree.attr["data-type"] = GROUP_TYPE.GROUP;
            if (!subtree || typeof subtree === "string") {
                tree.operand[index] = subtree;
            } else if (subtree.name === "text") {
                tree.operand[index] = subtree;
            } else {
                tree.operand[index] = supplementTree(parser, subtree, tree);
            }
        }
        /**
   * 判断给定的操作数列表内是否仅有一个占位符存在, 该判断仅支持对根内部的表达式做判断
   * @param operands 操作数列表
   * @returns {boolean}
   */
        function onlyPlaceholder(operands) {
            var result = 1;
            if (operands.length > 3) {
                return false;
            }
            for (var i = 0, len = operands.length; i < len; i++) {
                if (operands[i] === CURSOR_CHAR) {
                    continue;
                }
                if (operands[i] && operands[i].name === "placeholder") {
                    result--;
                }
            }
            return !result;
        }
        // 判断给定的树是否是一个虚拟组
        function isVirtualGroup(tree) {
            return !!VGROUP_LIST[tree.name];
        }
        // 判断给定的树是否是一个占位符
        function isPlaceholder(tree) {
            return tree.name === "placeholder";
        }
        // 创建一个新组， 组的内容是空
        function createGroup(parser) {
            return {
                name: COMBINATION_NAME,
                attr: {
                    "data-type": GROUP_TYPE.GROUP,
                    id: parser.getGroupId()
                },
                operand: []
            };
        }
        return Parser;
    }
};

//.tmp_build/src/parse/vgroup-def.js
/*!
 * 虚拟组列表
 */
_p[24] = {
    value: function() {
        return {
            radical: true,
            fraction: true,
            summation: true,
            integration: true,
            placeholder: true,
            script: true,
            superscript: true,
            subscript: true,
            brackets: true,
            "function": true
        };
    }
};

//.tmp_build/src/position/position.js
/*!
 * 定位模块
 */
_p[25] = {
    value: function(require) {
        var kity = _p.r(22), kfUtils = _p.r(4), PositionComponenet = kity.createClass("PositionComponenet", {
            constructor: function constructor(kfEditor) {
                this.kfEditor = kfEditor;
                this.initServices();
            },
            initServices: function initServices() {
                this.kfEditor.registerService("position.get.group", this, {
                    getGroupByTarget: this.getGroupByTarget
                });
                this.kfEditor.registerService("position.get.index", this, {
                    getIndexByTargetInGroup: this.getIndexByTargetInGroup
                });
                this.kfEditor.registerService("position.get.location.info", this, {
                    getLocationInfo: this.getLocationInfo
                });
                this.kfEditor.registerService("position.get.parent.group", this, {
                    getParentGroupByTarget: this.getParentGroupByTarget
                });
                this.kfEditor.registerService("position.get.wrap", this, {
                    getWrap: this.getWrap
                });
                this.kfEditor.registerService("position.get.area", this, {
                    getAreaByCursorInGroup: this.getAreaByCursorInGroup
                });
                this.kfEditor.registerService("position.get.group.info", this, {
                    getGroupInfoByNode: this.getGroupInfoByNode
                });
                this.kfEditor.registerService("position.get.parent.info", this, {
                    getParentInfoByNode: this.getParentInfoByNode
                });
            },
            getGroupByTarget: function getGroupByTarget(target) {
                var groupDom = getGroup(target, false, false);
                if (groupDom) {
                    return this.kfEditor.requestService("syntax.get.group.content", groupDom.id);
                }
                return null;
            },
            /**
     * 根据给定的组节点和目标节点， 获取目标节点在组节点内部的索引
     * @param groupNode 组节点
     * @param targetNode 目标节点
     */
            getIndexByTargetInGroup: function getIndexByTargetInGroup(groupNode, targetNode) {
                var groupInfo = this.kfEditor.requestService("syntax.get.group.content", groupNode.id), index = -1;
                kity.Utils.each(groupInfo.content, function(child, i) {
                    index = i;
                    if (kfUtils.contains(child, targetNode)) {
                        return false;
                    }
                });
                return index;
            },
            /**
     * 根据给定的组节点和给定的偏移值，获取当前偏移值在组中的区域值。
     * 该区域值的取值为true时， 表示在右区域， 反之则在左区域
     * @param groupNode 组节点
     * @param offset 偏移值
     */
            getAreaByCursorInGroup: function getAreaByCursorInGroup(groupNode, offset) {
                var groupRect = kfUtils.getRect(groupNode);
                return groupRect.left + groupRect.width / 2 < offset;
            },
            getLocationInfo: function getLocationInfo(distance, groupInfo) {
                var index = -1, children = groupInfo.content, boundingRect = null;
                for (var i = children.length - 1, child = null; i >= 0; i--) {
                    index = i;
                    child = children[i];
                    boundingRect = kfUtils.getRect(child);
                    if (boundingRect.left < distance) {
                        if (boundingRect.left + boundingRect.width / 2 < distance) {
                            index += 1;
                        }
                        break;
                    }
                }
                return index;
            },
            getParentGroupByTarget: function getParentGroupByTarget(target) {
                var groupDom = getGroup(target, true, false);
                if (groupDom) {
                    return this.kfEditor.requestService("syntax.get.group.content", groupDom.id);
                }
                return null;
            },
            getWrap: function getWrap(node) {
                return getGroup(node, true, true);
            },
            /**
     * 给定一个节点， 获取其节点所属的组及其在该组内的偏移
     * @param target 目标节点
     */
            getGroupInfoByNode: function getGroupInfoByNode(target) {
                var result = {}, containerNode = getGroup(target, false, false), containerInfo = null;
                if (!containerNode) {
                    return null;
                }
                containerInfo = this.kfEditor.requestService("syntax.get.group.content", containerNode.id);
                for (var i = 0, len = containerInfo.content.length; i < len; i++) {
                    result.index = i;
                    if (kfUtils.contains(containerInfo.content[i], target)) {
                        break;
                    }
                }
                result.group = containerInfo;
                return result;
            },
            /**
     * 给定一个节点， 获取其节点所属的直接包含组及其在该直接包含组内的偏移
     * @param target 目标节点
     */
            getParentInfoByNode: function getParentInfoByNode(target) {
                var group = getGroup(target, true, false);
                group = this.kfEditor.requestService("syntax.get.group.content", group.id);
                return {
                    group: group,
                    index: group.content.indexOf(target)
                };
            }
        });
        /**
   * 获取给定节点元素所属的组
   * @param node 当前点击的节点
   * @param isAllowVirtual 是否允许选择虚拟组
   * @param isAllowWrap 是否允许选择目标节点的最小包裹单位
   * @returns {*}
   */
        function getGroup(node, isAllowVirtual, isAllowWrap) {
            var tagName = null;
            if (!node.ownerSVGElement) {
                return null;
            }
            node = node.parentNode;
            tagName = node.tagName.toLowerCase();
            if (node && tagName !== "body" && tagName !== "svg") {
                if (node.getAttribute("data-type") === "kf-editor-group") {
                    return node;
                }
                if (isAllowVirtual && node.getAttribute("data-type") === "kf-editor-virtual-group") {
                    return node;
                }
                if (isAllowWrap && node.getAttribute("data-flag") !== null) {
                    return node;
                }
                return getGroup(node, isAllowVirtual, isAllowWrap);
            } else {
                return null;
            }
        }
        return PositionComponenet;
    }
};

//.tmp_build/src/print/printer.js
/*!
 * 打印服务
 */
_p[26] = {
    value: function(require) {
        var kity = _p.r(22);
        return kity.createClass("Printer", {
            constructor: function constructor(kfEditor) {
                this.kfEditor = kfEditor;
                this.initServices();
                this.initCommands();
            },
            initServices: function initServices() {
                this.kfEditor.registerService("print.image", this, {
                    printImage: this.printImage
                });
            },
            initCommands: function initCommands() {
                this.kfEditor.registerCommand("get.image.data", this, this.getImageData);
            },
            printImage: function printImage(type) {
                var formula = this.kfEditor.requestService("render.get.paper");
                this._formatCanvas();
                formula.toPNG(function(dataUrl) {
                    document.body.innerHTML = '<img style="background: red;" src="' + dataUrl + '">';
                });
                this._restoreCanvas();
            },
            getImageData: function getImageData(cb) {
                var canvas = this.kfEditor.requestService("render.get.canvas"), formula = this.kfEditor.requestService("render.get.paper");
                this._formatCanvas();
                formula.toPNG(function(dataUrl) {
                    cb({
                        width: canvas.width,
                        height: canvas.height,
                        img: dataUrl
                    });
                });
                this._restoreCanvas();
            },
            _formatCanvas: function _formatCanvas() {
                var canvas = this.kfEditor.requestService("render.get.canvas"), rect = canvas.container.getRenderBox();
                canvas.node.setAttribute("width", rect.width);
                canvas.node.setAttribute("height", rect.height);
                this.kfEditor.requestService("render.clear.canvas.transform");
                this.kfEditor.requestService("control.cursor.hide");
                this.kfEditor.requestService("render.clear.select");
            },
            _restoreCanvas: function _restoreCanvas() {
                var canvas = this.kfEditor.requestService("render.get.canvas");
                canvas.node.setAttribute("width", "100%");
                canvas.node.setAttribute("height", "100%");
                this.kfEditor.requestService("render.revert.canvas.transform");
                this.kfEditor.requestService("control.cursor.relocation");
                this.kfEditor.requestService("render.reselect");
            }
        });
    }
};

//.tmp_build/src/render/render.js
/**
 * Created by hn on 14-3-17.
 */
_p[27] = {
    value: function(require) {
        var kity = _p.r(22), Assembly = _p.r(21).Assembly, DEFAULT_OPTIONS = {
            autoresize: false,
            fontsize: 50,
            padding: [ 0, 0 ]
        }, RenderComponenet = kity.createClass("RenderComponent", {
            // 异步组件
            base: _p.r(1),
            constructor: function constructor(kfEditor, options) {
                this.callBase();
                this.options = kity.Utils.extend({}, DEFAULT_OPTIONS, options);
                this.kfEditor = kfEditor;
                this.assembly = null;
                this.formula = null;
                // 是否禁用重定位
                this.relDisabled = true;
                this.canvasZoom = 1;
                this.record = {
                    select: {},
                    cursor: {},
                    // 画布信息
                    canvas: {}
                };
                this.initCanvas();
                this.initServices();
                this.initCommands();
            },
            initCanvas: function initCanvas() {
                var canvasContainer = this.kfEditor.requestService("ui.get.canvas.container"), Formula = this.kfEditor.getFormulaClass();
                this.assembly = new Assembly(new Formula(canvasContainer, this.options));
                this.formula = this.assembly.formula;
                this.setCanvasToCenter();
            },
            setCanvasOffset: function setCanvasOffset(offsetX, offsetY) {
                var viewBox = this.formula.getViewBox();
                offsetY = offsetY !== undefined ? offsetY : -viewBox.height / 2;
                this.formula.setViewBox(offsetX, offsetY, viewBox.width, viewBox.height);
            },
            setCanvasToCenter: function setCanvasToCenter() {
                var viewBox = this.formula.getViewBox();
                this.formula.setViewBox(-viewBox.width / 2, -viewBox.height / 2, viewBox.width, viewBox.height);
            },
            initServices: function initServices() {
                this.kfEditor.registerService("render.get.canvas", this, {
                    getCanvas: this.getCanvas
                });
                this.kfEditor.registerService("render.get.content.size", this, {
                    getContentSize: this.getContentSize
                });
                this.kfEditor.registerService("render.clear.canvas.transform", this, {
                    clearCanvasOffset: this.clearCanvasTransform
                });
                this.kfEditor.registerService("render.set.canvas.offset", this, {
                    setCanvasOffset: this.setCanvasOffset
                });
                this.kfEditor.registerService("render.set.canvas.to.center", this, {
                    setCanvasToCenter: this.setCanvasToCenter
                });
                this.kfEditor.registerService("render.revert.canvas.transform", this, {
                    revertCanvasTransform: this.revertCanvasTransform
                });
                this.kfEditor.registerService("render.relocation", this, {
                    relocation: this.relocation
                });
                this.kfEditor.registerService("render.disable.relocation", this, {
                    disableRelocation: this.disableRelocation
                });
                this.kfEditor.registerService("render.enable.relocation", this, {
                    enableRelocation: this.enableRelocation
                });
                this.kfEditor.registerService("render.select.group.content", this, {
                    selectGroupContent: this.selectGroupContent
                });
                this.kfEditor.registerService("render.select.group", this, {
                    selectGroup: this.selectGroup
                });
                this.kfEditor.registerService("render.select.group.all", this, {
                    selectAllGroup: this.selectAllGroup
                });
                this.kfEditor.registerService("render.tint.current.cursor", this, {
                    tintCurrentGroup: this.tintCurrentGroup
                });
                this.kfEditor.registerService("render.select.current.cursor", this, {
                    selectCurrentCursor: this.selectCurrentCursor
                });
                this.kfEditor.registerService("render.reselect", this, {
                    reselect: this.reselect
                });
                this.kfEditor.registerService("render.clear.select", this, {
                    clearSelect: this.clearSelect
                });
                this.kfEditor.registerService("render.set.canvas.zoom", this, {
                    setCanvasZoom: this.setCanvasZoom
                });
                this.kfEditor.registerService("render.get.canvas.zoom", this, {
                    getCanvasZoom: this.getCanvasZoom
                });
                this.kfEditor.registerService("render.get.paper.offset", this, {
                    getPaperOffset: this.getPaperOffset
                });
                this.kfEditor.registerService("render.draw", this, {
                    render: this.render
                });
                this.kfEditor.registerService("render.insert.string", this, {
                    insertString: this.insertString
                });
                this.kfEditor.registerService("render.insert.group", this, {
                    insertGroup: this.insertGroup
                });
                this.kfEditor.registerService("render.get.paper", this, {
                    getPaper: this.getPaper
                });
            },
            initCommands: function initCommands() {
                this.kfEditor.registerCommand("render", this, function(str) {
                    this.render(str);
                    this.kfEditor.requestService("ui.update.canvas.view");
                });
                this.kfEditor.registerCommand("getPaper", this, this.getPaper);
            },
            relocation: function relocation() {
                if (!this.relDisabled) {
                    this.relocationToCenter();
                } else {
                    this.relocationToLeft();
                }
            },
            relocationToCenter: function relocationToCenter() {
                var formulaSpace = this.formula.container.getRenderBox();
                this.formula.container.setTranslate(-formulaSpace.width / 2, -formulaSpace.height / 2);
                this.setCanvasToCenter();
            },
            relocationToLeft: function relocationToLeft() {
                var formulaSpace = this.formula.container.getRenderBox();
                this.formula.container.setTranslate(0, -formulaSpace.height / 2);
                this.setCanvasOffset(0);
            },
            selectGroup: function selectGroup(groupId) {
                var groupObject = this.kfEditor.requestService("syntax.get.group.object", groupId);
                this.clearSelect();
                if (groupObject.node.getAttribute("data-root")) {
                    // 根节点不着色
                    return;
                }
                this.record.select.lastSelect = groupObject;
                groupObject.select();
            },
            selectGroupContent: function selectGroupContent(group) {
                // 处理占位符
                if (group.groupObj.getAttribute("data-placeholder") !== null) {
                    group = {
                        id: group.content[0].id
                    };
                }
                var groupObject = this.kfEditor.requestService("syntax.get.group.object", group.id);
                this.clearSelect();
                this.record.select.lastSelect = groupObject;
                if (groupObject.node.getAttribute("data-root")) {
                    // 根节点不着色
                    return;
                }
                groupObject.select();
            },
            selectAllGroup: function selectAllGroup(group) {
                // 处理占位符
                if (group.groupObj.getAttribute("data-placeholder") !== null) {
                    group = {
                        id: group.content[0].id
                    };
                }
                var groupObject = this.kfEditor.requestService("syntax.get.group.object", group.id);
                this.clearSelect();
                this.record.select.lastSelect = groupObject;
                groupObject.selectAll();
            },
            /**
     * 根据当前光标信息绘制选区
     */
            selectCurrentCursor: function selectCurrentCursor() {
                var cursorInfo = this.kfEditor.requestService("syntax.get.record.cursor"), group = this.kfEditor.requestService("syntax.get.group.object", cursorInfo.groupId), box = null, offset = -1, width = 0, startIndex = Math.min(cursorInfo.startOffset, cursorInfo.endOffset), endIndex = Math.max(cursorInfo.startOffset, cursorInfo.endOffset);
                this.clearSelect();
                // 更新记录
                this.record.select.lastSelect = group;
                for (var i = startIndex, len = endIndex; i < len; i++) {
                    box = group.getOperand(i).getRenderBox(group);
                    if (offset == -1) {
                        offset = box.x;
                    }
                    width += box.width;
                }
                group.setBoxWidth(width);
                group.selectAll();
                group.getBox().setTranslate(offset, 0);
            },
            /**
     * 根据当前的光标信息，对当前光标所在的容器进行着色
     */
            tintCurrentGroup: function tintCurrentGroup() {
                var groupId = this.kfEditor.requestService("syntax.get.record.cursor").groupId, groupObject = this.kfEditor.requestService("syntax.get.group.object", groupId), isPlaceholder = this.kfEditor.requestService("syntax.is.placeholder.node", groupId);
                this.clearSelect();
                if (groupObject.node.getAttribute("data-root")) {
                    // 根节点不着色
                    return;
                }
                // 占位符着色
                if (isPlaceholder) {
                    // 替换占位符包裹组为占位符本身
                    groupObject = this.kfEditor.requestService("syntax.get.group.object", groupObject.operands[0].node.id);
                }
                this.record.select.lastSelect = groupObject;
                groupObject.select();
            },
            reselect: function reselect() {
                var cursorInfo = this.kfEditor.requestService("syntax.get.record.cursor"), groupObject = null;
                groupObject = this.kfEditor.requestService("syntax.get.group.object", cursorInfo.groupId);
                this.clearSelect();
                this.record.select.lastSelect = groupObject;
                if (groupObject.node.getAttribute("data-root")) {
                    // 根节点不着色
                    return;
                }
                groupObject.select();
            },
            clearSelect: function clearSelect() {
                var box = null, currentSelect = this.record.select.lastSelect;
                if (!currentSelect || !currentSelect.node.ownerSVGElement) {
                    return;
                }
                currentSelect.unselect();
                box = currentSelect.getRenderBox(currentSelect);
                currentSelect.setBoxWidth(box.width);
                currentSelect.getBox().setTranslate(0, 0);
            },
            getPaper: function getPaper() {
                return this.formula;
            },
            render: function render(latexStr) {
                var parsedTree = this.kfEditor.requestService("parser.parse", latexStr, true), objTree = this.assembly.regenerateBy(parsedTree);
                // 更新语法模块所维护的树
                this.kfEditor.requestService("syntax.update.objtree", objTree);
            },
            enableRelocation: function enableRelocation() {},
            disableRelocation: function disableRelocation() {},
            setCanvasZoom: function setCanvasZoom(zoom) {
                var viewPort = this.formula.getViewPort();
                this.canvasZoom = zoom;
                viewPort.zoom = zoom;
                this.formula.setViewPort(viewPort);
            },
            getCanvas: function getCanvas() {
                return this.formula;
            },
            getContentSize: function getContentSize() {
                return this.formula.container.getRenderBox();
            },
            /**
     * 清除编辑器里内容的偏移
     */
            clearCanvasTransform: function clearCanvasTransform() {
                var canvasInfo = this.record.canvas;
                canvasInfo.viewBox = this.formula.getViewBox();
                canvasInfo.contentOffset = this.formula.container.getTranslate();
                this.setCanvasToCenter();
                this.formula.node.removeAttribute("viewBox");
                this.formula.container.setTranslate(0, 0);
            },
            /**
     * 恢复被clearCanvasTransform清除的偏移， 该方法仅针对上一次清除有效，
     * 且该方法应该只有在调用clearCanvasTransform后才可以调用该方法，并且两者之间应该配对出现
     * @returns {boolean}
     */
            revertCanvasTransform: function revertCanvasTransform() {
                var canvasInfo = this.record.canvas, viewBox = canvasInfo.viewBox;
                if (!viewBox) {
                    return false;
                }
                this.formula.setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
                this.formula.container.setTranslate(canvasInfo.contentOffset);
                canvasInfo.viewBox = null;
                canvasInfo.contentOffset = null;
            },
            getCanvasZoom: function getCanvasZoom() {
                return this.canvasZoom;
            }
        });
        return RenderComponenet;
    }
};

//.tmp_build/src/syntax/delete.js
/*！
 * 删除控制
 */
_p[28] = {
    value: function(require, exports, module) {
        var kity = _p.r(22);
        return kity.createClass("DeleteComponent", {
            constructor: function constructor(parentComponent, kfEditor) {
                this.parentComponent = parentComponent;
                this.kfEditor = kfEditor;
            },
            deleteGroup: function deleteGroup() {
                var cursorInfo = this.parentComponent.getCursorRecord(), objTree = this.parentComponent.getObjectTree(), // 当前的树信息
                currentTree = objTree.mapping[cursorInfo.groupId].strGroup;
                // 选区长度为0, 则删除前一个组
                if (cursorInfo.startOffset === cursorInfo.endOffset) {
                    // 已经到最前， 需要进一步处理
                    if (cursorInfo.startOffset === 0) {
                        // 根节点时， 直接退出， 不做任何处理
                        if (this.parentComponent.isRootTree(currentTree)) {
                            return false;
                        }
                        // 不是根节点时， 选中当前容器的父容器
                        cursorInfo = this.selectParentContainer(cursorInfo.groupId);
                        this.parentComponent.updateCursor(cursorInfo);
                        return false;
                    } else {
                        // 还有更多剩余内容， 则直接删除前一个组
                        if (currentTree.operand.length > 1) {
                            cursorInfo = this.deletePrevGroup(currentTree, cursorInfo);
                        } else {
                            // 更新光标位置
                            cursorInfo.startOffset = 0;
                            cursorInfo.endOffset = 1;
                            // 处理组类型， 选中该组即可
                            if (currentTree.operand[0].attr && this.parentComponent.isGroupNode(currentTree.operand[0].attr.id)) {
                                this.parentComponent.updateCursor(cursorInfo);
                                return false;
                            } else {
                                // 替换成占位符
                                currentTree.operand[0] = {
                                    name: "placeholder",
                                    operand: []
                                };
                                this.parentComponent.updateCursor(cursorInfo);
                                return true;
                            }
                        }
                    }
                } else {
                    // 当前选中占位符的情况
                    if (this.parentComponent.isSelectPlaceholder()) {
                        // 如果是根节点， 则不允许删除
                        if (this.parentComponent.isRootTree(currentTree)) {
                            return false;
                        } else {
                            cursorInfo = this.selectParentContainer(cursorInfo.groupId);
                            this.parentComponent.updateCursor(cursorInfo);
                            return false;
                        }
                    } else {
                        return this.deleteSelection(currentTree, cursorInfo);
                    }
                }
                this.parentComponent.updateCursor(cursorInfo);
                // 选区长度为0， 则可以判定当前公式发生了改变
                if (cursorInfo.startOffset === cursorInfo.endOffset) {
                    return true;
                }
                return false;
            },
            // 删除前一个节点, 返回更新后的光标信息
            deletePrevGroup: function deletePrevGroup(tree, cursorInfo) {
                // 待删除的组
                var index = cursorInfo.startOffset - 1, group = tree.operand[index];
                // 叶子节点可以直接删除
                if (this.parentComponent.isLeafTree(group)) {
                    tree.operand.splice(index, 1);
                    cursorInfo.startOffset -= 1;
                    cursorInfo.endOffset -= 1;
                } else {
                    cursorInfo.startOffset -= 1;
                }
                return cursorInfo;
            },
            // 删除选区内容
            deleteSelection: function deleteSelection(tree, cursorInfo) {
                // 选中的是容器内的所有内容
                if (cursorInfo.startOffset === 0 && cursorInfo.endOffset === tree.operand.length) {
                    tree.operand.length = 1;
                    tree.operand[0] = {
                        name: "placeholder",
                        operand: []
                    };
                    cursorInfo.endOffset = 1;
                } else {
                    tree.operand.splice(cursorInfo.startOffset, cursorInfo.endOffset - cursorInfo.startOffset);
                    cursorInfo.endOffset = cursorInfo.startOffset;
                }
                this.parentComponent.updateCursor(cursorInfo);
                return true;
            },
            // 选中给定ID节点的父容器
            selectParentContainer: function selectParentContainer(groupId) {
                var currentGroupNode = this.parentComponent.getGroupObject(groupId).node, parentContainerInfo = this.kfEditor.requestService("position.get.group", currentGroupNode), // 当前组在父容器中的索引
                index = this.kfEditor.requestService("position.get.index", parentContainerInfo.groupObj, currentGroupNode);
                // 返回新的光标信息
                return {
                    groupId: parentContainerInfo.id,
                    startOffset: index,
                    endOffset: index + 1
                };
            }
        });
    }
};

//.tmp_build/src/syntax/move.js
/*！
 * 光标移动控制
 */
_p[29] = {
    value: function(require, exports, module) {
        var kity = _p.r(22), DIRECTION = {
            LEFT: "left",
            RIGHT: "right"
        };
        return kity.createClass("MoveComponent", {
            constructor: function constructor(parentComponent, kfEditor) {
                this.parentComponent = parentComponent;
                this.kfEditor = kfEditor;
            },
            leftMove: function leftMove() {
                var cursorInfo = this.parentComponent.getCursorRecord();
                cursorInfo = updateCursorGoLeft.call(this, cursorInfo);
                // cursorInfo 为null则不用处理
                if (cursorInfo) {
                    this.parentComponent.updateCursor(cursorInfo);
                }
            },
            rightMove: function rightMove() {
                var cursorInfo = this.parentComponent.getCursorRecord();
                cursorInfo = updateCursorGoRight.call(this, cursorInfo);
                // cursorInfo 为null则不用处理
                if (cursorInfo) {
                    this.parentComponent.updateCursor(cursorInfo);
                }
            }
        });
        function updateCursorGoLeft(cursorInfo) {
            var prevGroupNode = null, syntaxComponent = this.parentComponent, containerInfo = null;
            containerInfo = syntaxComponent.getGroupContent(cursorInfo.groupId);
            // 当前处于占位符中
            if (syntaxComponent.isSelectPlaceholder()) {
                return locateOuterIndex(this, containerInfo.content[cursorInfo.startOffset], DIRECTION.LEFT);
            }
            if (cursorInfo.startOffset === cursorInfo.endOffset) {
                if (cursorInfo.startOffset > 0) {
                    prevGroupNode = containerInfo.content[cursorInfo.startOffset - 1];
                    if (isGroupNode(prevGroupNode)) {
                        cursorInfo = locateIndex(this, prevGroupNode, DIRECTION.LEFT);
                    } else {
                        cursorInfo.startOffset -= 1;
                        // 非占位符处理
                        if (!isPlaceholderNode(prevGroupNode)) {
                            cursorInfo.endOffset = cursorInfo.startOffset;
                        }
                    }
                } else {
                    cursorInfo = locateOuterIndex(this, containerInfo.groupObj, DIRECTION.LEFT);
                }
            } else {
                cursorInfo.startOffset = Math.min(cursorInfo.startOffset, cursorInfo.endOffset);
                // 收缩
                cursorInfo.endOffset = cursorInfo.startOffset;
            }
            return cursorInfo;
        }
        function updateCursorGoRight(cursorInfo) {
            var nextGroupNode = null, syntaxComponent = this.parentComponent, containerInfo = null;
            containerInfo = syntaxComponent.getGroupContent(cursorInfo.groupId);
            // 当前处于占位符中
            if (syntaxComponent.isSelectPlaceholder()) {
                return locateOuterIndex(this, containerInfo.content[cursorInfo.startOffset], DIRECTION.RIGHT);
            }
            if (cursorInfo.startOffset === cursorInfo.endOffset) {
                if (cursorInfo.startOffset < containerInfo.content.length) {
                    nextGroupNode = containerInfo.content[cursorInfo.startOffset];
                    // 进入容器内部
                    if (isGroupNode(nextGroupNode)) {
                        cursorInfo = locateIndex(this, nextGroupNode, DIRECTION.RIGHT);
                    } else {
                        cursorInfo.startOffset += 1;
                        // 非占位符同时更新结束偏移
                        if (!isPlaceholderNode(nextGroupNode)) {
                            cursorInfo.endOffset = cursorInfo.startOffset;
                        }
                    }
                } else {
                    cursorInfo = locateOuterIndex(this, containerInfo.groupObj, DIRECTION.RIGHT);
                }
            } else {
                cursorInfo.endOffset = Math.max(cursorInfo.startOffset, cursorInfo.endOffset);
                // 收缩
                cursorInfo.startOffset = cursorInfo.endOffset;
            }
            return cursorInfo;
        }
        /**
   * 组内寻址, 入组
   */
        function locateIndex(moveComponent, groupNode, dir) {
            switch (dir) {
              case DIRECTION.LEFT:
                return locateLeftIndex(moveComponent, groupNode);

              case DIRECTION.RIGHT:
                return locateRightIndex(moveComponent, groupNode);
            }
            throw new Error("undefined move direction!");
        }
        /**
   * 组外寻址, 出组
   */
        function locateOuterIndex(moveComponent, groupNode, dir) {
            switch (dir) {
              case DIRECTION.LEFT:
                return locateOuterLeftIndex(moveComponent, groupNode);

              case DIRECTION.RIGHT:
                return locateOuterRightIndex(moveComponent, groupNode);
            }
            throw new Error("undefined move direction!");
        }
        // 左移内部定位
        function locateLeftIndex(moveComponent, groupNode) {
            var syntaxComponent = moveComponent.parentComponent, groupInfo = null, groupElement = null;
            if (isPlaceholderNode(groupNode) || isEmptyNode(groupNode)) {
                return locateOuterLeftIndex(moveComponent, groupNode);
            }
            if (isGroupNode(groupNode)) {
                groupInfo = syntaxComponent.getGroupContent(groupNode.id);
                // 容器内部中末尾的元素
                groupElement = groupInfo.content[groupInfo.content.length - 1];
                // 空检测
                if (isEmptyNode(groupElement)) {
                    // 做跳出处理
                    return locateOuterLeftIndex(moveComponent, groupElement);
                }
                // 待定位的组本身就是一个容器, 则检测其内部结构是否还包含容器
                if (isContainerNode(groupNode)) {
                    // 进入到占位符包裹容器内
                    if (isPlaceholderNode(groupElement)) {
                        return {
                            groupId: groupNode.id,
                            startOffset: groupInfo.content.length - 1,
                            endOffset: groupInfo.content.length
                        };
                    } else if (isContainerNode(groupElement) && groupInfo.content.length === 1) {
                        return locateLeftIndex(moveComponent, groupElement);
                    }
                    return {
                        groupId: groupNode.id,
                        startOffset: groupInfo.content.length,
                        endOffset: groupInfo.content.length
                    };
                } else {
                    while (!isContainerNode(groupElement) && !isEmptyNode(groupElement) && !isPlaceholderNode(groupElement)) {
                        groupInfo = syntaxComponent.getGroupContent(groupElement.id);
                        groupElement = groupInfo.content[groupInfo.content.length - 1];
                    }
                    if (isEmptyNode(groupElement)) {
                        return locateOuterLeftIndex(moveComponent, groupElement);
                    }
                    if (isPlaceholderNode(groupElement)) {
                        return {
                            groupId: groupElement.id,
                            startOffset: groupInfo.content.length,
                            endOffset: groupInfo.content.length
                        };
                    }
                    return locateLeftIndex(moveComponent, groupElement);
                }
            }
            return null;
        }
        // 左移外部定位
        function locateOuterLeftIndex(moveComponent, groupNode) {
            var kfEditor = moveComponent.kfEditor, outerGroupInfo = null, groupInfo = null;
            // 根容器， 不用再跳出
            if (isRootNode(groupNode)) {
                return null;
            }
            outerGroupInfo = kfEditor.requestService("position.get.parent.info", groupNode);
            while (outerGroupInfo.index === 0) {
                if (isRootNode(outerGroupInfo.group.groupObj)) {
                    return {
                        groupId: outerGroupInfo.group.id,
                        startOffset: 0,
                        endOffset: 0
                    };
                }
                // 如果父组是一个容器， 并且该容器包含不止一个节点， 则跳到父组开头
                if (isContainerNode(outerGroupInfo.group.groupObj) && outerGroupInfo.group.content.length > 1) {
                    return {
                        groupId: outerGroupInfo.group.id,
                        startOffset: 0,
                        endOffset: 0
                    };
                }
                outerGroupInfo = kfEditor.requestService("position.get.parent.info", outerGroupInfo.group.groupObj);
            }
            // 如果外部组是容器， 则直接定位即可
            if (isContainerNode(outerGroupInfo.group.groupObj)) {
                return {
                    groupId: outerGroupInfo.group.id,
                    startOffset: outerGroupInfo.index,
                    endOffset: outerGroupInfo.index
                };
            }
            groupNode = outerGroupInfo.group.content[outerGroupInfo.index - 1];
            // 定位到的组是一个容器， 则定位到容器尾部
            if (isGroupNode(groupNode)) {
                // 容器节点
                if (isContainerNode(groupNode)) {
                    // 进入容器内部
                    return locateLeftIndex(moveComponent, groupNode);
                } else {
                    return locateLeftIndex(moveComponent, groupNode);
                }
                return {
                    groupId: groupNode.id,
                    startOffset: groupInfo.content.length,
                    endOffset: groupInfo.content.length
                };
            }
            if (isEmptyNode(groupNode)) {
                return locateOuterLeftIndex(moveComponent, groupNode);
            }
            return {
                groupId: outerGroupInfo.group.id,
                startOffset: outerGroupInfo.index,
                endOffset: outerGroupInfo.index
            };
        }
        // 右移内部定位
        function locateRightIndex(moveComponent, groupNode) {
            var syntaxComponent = moveComponent.parentComponent, groupInfo = null, groupElement = null;
            if (isGroupNode(groupNode)) {
                groupInfo = syntaxComponent.getGroupContent(groupNode.id);
                // 容器内部中末尾的元素
                groupElement = groupInfo.content[0];
                // 待定位的组本身就是一个容器, 则检测其内部结构是否还包含容器
                if (isContainerNode(groupNode)) {
                    // 内部元素仍然是一个容器
                    if (isContainerNode(groupElement)) {
                        // 递归处理
                        return locateRightIndex(moveComponent, groupElement);
                    }
                    if (isPlaceholderNode(groupElement)) {
                        return {
                            groupId: groupNode.id,
                            startOffset: 0,
                            endOffset: 1
                        };
                    }
                    return {
                        groupId: groupNode.id,
                        startOffset: 0,
                        endOffset: 0
                    };
                } else {
                    while (!isContainerNode(groupElement) && !isPlaceholderNode(groupElement) && !isEmptyNode(groupElement)) {
                        groupInfo = syntaxComponent.getGroupContent(groupElement.id);
                        groupElement = groupInfo.content[0];
                    }
                    // 定位到占位符内部
                    if (isPlaceholderNode(groupElement)) {
                        return {
                            groupId: groupElement.id,
                            startOffset: 0,
                            endOffset: 0
                        };
                    } else if (isEmptyNode(groupElement)) {
                        return locateOuterRightIndex(moveComponent, groupElement);
                    } else {
                        return locateRightIndex(moveComponent, groupElement);
                    }
                }
            }
            return null;
        }
        // 右移外部定位
        function locateOuterRightIndex(moveComponent, groupNode) {
            var kfEditor = moveComponent.kfEditor, syntaxComponent = moveComponent.parentComponent, outerGroupInfo = null, groupInfo = null;
            // 根容器， 不用再跳出
            if (isRootNode(groupNode)) {
                return null;
            }
            outerGroupInfo = kfEditor.requestService("position.get.parent.info", groupNode);
            // 仍然需要回溯
            while (outerGroupInfo.index === outerGroupInfo.group.content.length - 1) {
                if (isRootNode(outerGroupInfo.group.groupObj)) {
                    return {
                        groupId: outerGroupInfo.group.id,
                        startOffset: outerGroupInfo.group.content.length,
                        endOffset: outerGroupInfo.group.content.length
                    };
                }
                // 如果父组是一个容器， 并且该容器包含不止一个节点， 则跳到父组末尾
                if (isContainerNode(outerGroupInfo.group.groupObj) && outerGroupInfo.group.content.length > 1) {
                    return {
                        groupId: outerGroupInfo.group.id,
                        startOffset: outerGroupInfo.group.content.length,
                        endOffset: outerGroupInfo.group.content.length
                    };
                }
                outerGroupInfo = kfEditor.requestService("position.get.parent.info", outerGroupInfo.group.groupObj);
            }
            groupNode = outerGroupInfo.group.content[outerGroupInfo.index + 1];
            // 空节点处理
            if (isEmptyNode(groupNode)) {
                return locateOuterRightIndex(moveComponent, groupNode);
            }
            // 定位到的组是一个容器， 则定位到容器内部开头位置上
            if (isContainerNode(groupNode)) {
                groupInfo = syntaxComponent.getGroupContent(groupNode.id);
                // 检查内容开始元素是否是占位符
                if (syntaxComponent.isPlaceholder(groupInfo.content[0].id)) {
                    return {
                        groupId: groupNode.id,
                        startOffset: 0,
                        endOffset: 1
                    };
                }
                return {
                    groupId: groupNode.id,
                    startOffset: 0,
                    endOffset: 0
                };
            }
            return {
                groupId: outerGroupInfo.group.id,
                startOffset: outerGroupInfo.index + 1,
                endOffset: outerGroupInfo.index + 1
            };
        }
        function isRootNode(node) {
            return !!node.getAttribute("data-root");
        }
        function isContainerNode(node) {
            return node.getAttribute("data-type") === "kf-editor-group";
        }
        function isGroupNode(node) {
            var dataType = node.getAttribute("data-type");
            return dataType === "kf-editor-group" || dataType === "kf-editor-virtual-group";
        }
        function isPlaceholderNode(node) {
            return node.getAttribute("data-flag") === "Placeholder";
        }
        function isEmptyNode(node) {
            return node.getAttribute("data-flag") === "Empty";
        }
    }
};

//.tmp_build/src/syntax/syntax.js
/*!
 * 语法控制单元
 */
_p[30] = {
    value: function(require) {
        var kity = _p.r(22), MoveComponent = _p.r(29), DeleteComponent = _p.r(28), CURSOR_CHAR = _p.r(31).cursorCharacter, GROUP_TYPE = _p.r(12), SyntaxComponenet = kity.createClass("SyntaxComponenet", {
            constructor: function constructor(kfEditor) {
                this.kfEditor = kfEditor;
                // 数据记录表
                this.record = {
                    // 光标位置
                    cursor: {
                        group: null,
                        startOffset: -1,
                        endOffset: -1
                    }
                };
                // 子组件结构
                this.components = {};
                // 对象树
                this.objTree = null;
                this.initComponents();
                this.initServices();
                this.initCommands();
            },
            initComponents: function initComponents() {
                this.components.move = new MoveComponent(this, this.kfEditor);
                this.components["delete"] = new DeleteComponent(this, this.kfEditor);
            },
            initServices: function initServices() {
                this.kfEditor.registerService("syntax.update.objtree", this, {
                    updateObjTree: this.updateObjTree
                });
                this.kfEditor.registerService("syntax.get.objtree", this, {
                    getObjectTree: this.getObjectTree
                });
                this.kfEditor.registerService("syntax.get.group.object", this, {
                    getGroupObject: this.getGroupObject
                });
                this.kfEditor.registerService("syntax.is.root.node", this, {
                    isRootNode: this.isRootNode
                });
                this.kfEditor.registerService("syntax.is.group.node", this, {
                    isGroupNode: this.isGroupNode
                });
                this.kfEditor.registerService("syntax.is.virtual.node", this, {
                    isVirtualNode: this.isVirtualNode
                });
                this.kfEditor.registerService("syntax.is.placeholder.node", this, {
                    isPlaceholder: this.isPlaceholder
                });
                this.kfEditor.registerService("syntax.is.select.placeholder", this, {
                    isSelectPlaceholder: this.isSelectPlaceholder
                });
                this.kfEditor.registerService("syntax.has.root.placeholder", this, {
                    hasRootplaceholder: this.hasRootplaceholder
                });
                this.kfEditor.registerService("syntax.valid.brackets", this, {
                    isBrackets: this.isBrackets
                });
                this.kfEditor.registerService("syntax.get.group.content", this, {
                    getGroupContent: this.getGroupContent
                });
                this.kfEditor.registerService("syntax.get.root.group.info", this, {
                    getRootGroupInfo: this.getRootGroupInfo
                });
                this.kfEditor.registerService("syntax.get.root", this, {
                    getRootObject: this.getRootObject
                });
                this.kfEditor.registerService("syntax.update.record.cursor", this, {
                    updateCursor: this.updateCursor
                });
                this.kfEditor.registerService("syntax.update.selection", this, {
                    updateSelection: this.updateSelection
                });
                this.kfEditor.registerService("syntax.get.record.cursor", this, {
                    getCursorRecord: this.getCursorRecord
                });
                this.kfEditor.registerService("syntax.has.cursor.info", this, {
                    hasCursorInfo: this.hasCursorInfo
                });
                this.kfEditor.registerService("syntax.serialization", this, {
                    serialization: this.serialization
                });
                this.kfEditor.registerService("syntax.cursor.move.left", this, {
                    leftMove: this.leftMove
                });
                this.kfEditor.registerService("syntax.cursor.move.right", this, {
                    rightMove: this.rightMove
                });
                this.kfEditor.registerService("syntax.delete.group", this, {
                    deleteGroup: this.deleteGroup
                });
            },
            initCommands: function initCommands() {
                this.kfEditor.registerCommand("get.source", this, this.getSource);
                this.kfEditor.registerCommand("content.is.empty", this, this.isEmpty);
            },
            updateObjTree: function updateObjTree(objTree) {
                var selectInfo = objTree.select;
                if (selectInfo && selectInfo.groupId) {
                    this.updateCursor(selectInfo.groupId, selectInfo.startOffset, selectInfo.endOffset);
                }
                this.objTree = objTree;
            },
            hasCursorInfo: function hasCursorInfo() {
                return this.record.cursor.group !== null;
            },
            // 验证给定ID的组是否是根节点
            isRootNode: function isRootNode(groupId) {
                return this.objTree.mapping.root.strGroup.attr.id === groupId;
            },
            // 验证给定ID的组是否是组节点
            isGroupNode: function isGroupNode(groupId) {
                var type = this.objTree.mapping[groupId].strGroup.attr["data-type"];
                return type === GROUP_TYPE.GROUP || type === GROUP_TYPE.VIRTUAL;
            },
            isVirtualNode: function isVirtualNode(groupId) {
                return this.objTree.mapping[groupId].strGroup.attr["data-type"] === GROUP_TYPE.VIRTUAL;
            },
            // 验证给定ID的组是否是占位符
            isPlaceholder: function isPlaceholder(groupId) {
                var currentNode = this.objTree.mapping[groupId];
                if (!currentNode) {
                    return false;
                }
                currentNode = currentNode.objGroup.node;
                return currentNode.getAttribute("data-flag") === "Placeholder";
            },
            isBrackets: function isBrackets(groupId) {
                return !!this.objTree.mapping[groupId].objGroup.node.getAttribute("data-brackets");
            },
            // 当前是否存在“根占位符”
            hasRootplaceholder: function hasRootplaceholder() {
                return this.objTree.mapping.root.strGroup.operand[0].name === "placeholder";
            },
            // 当前光标选中的是否是占位符
            isSelectPlaceholder: function isSelectPlaceholder() {
                var cursorInfo = this.record.cursor, groupInfo = null;
                if (cursorInfo.endOffset - cursorInfo.startOffset !== 1) {
                    return false;
                }
                groupInfo = this.getGroupContent(cursorInfo.groupId);
                if (!this.isPlaceholder(groupInfo.content[cursorInfo.startOffset].id)) {
                    return false;
                }
                return true;
            },
            // 给定的子树是否是一个叶子节点
            isLeafTree: function isLeafTree(tree) {
                return typeof tree === "string";
            },
            // 给定的子树是否是根节点
            isRootTree: function isRootTree(tree) {
                return tree.attr && tree.attr["data-root"];
            },
            getObjectTree: function getObjectTree() {
                return this.objTree;
            },
            getGroupObject: function getGroupObject(id) {
                return this.objTree.mapping[id].objGroup || null;
            },
            getCursorRecord: function getCursorRecord() {
                return kity.Utils.extend({}, this.record.cursor) || null;
            },
            getGroupContent: function getGroupContent(groupId) {
                var groupInfo = this.objTree.mapping[groupId], content = [], operands = groupInfo.objGroup.operands, offset = operands.length - 1, isLtr = groupInfo.strGroup.traversal !== "rtl";
                kity.Utils.each(operands, function(operand, i) {
                    if (isLtr) {
                        content.push(operand.node);
                    } else {
                        content[offset - i] = operand.node;
                    }
                });
                return {
                    id: groupId,
                    traversal: groupInfo.strGroup.traversal || "ltr",
                    groupObj: groupInfo.objGroup.node,
                    content: content
                };
            },
            getRootObject: function getRootObject() {
                return this.objTree.mapping.root.objGroup;
            },
            getRootGroupInfo: function getRootGroupInfo() {
                var rootGroupId = this.objTree.mapping.root.strGroup.attr.id;
                return this.getGroupContent(rootGroupId);
            },
            updateSelection: function updateSelection(group) {
                var groupObj = this.objTree.mapping[group.id], curStrGroup = groupObj.strGroup, parentGroup = null, parentGroupObj = null, resultStr = null, startOffset = -1, endOffset = -1;
                parentGroup = group;
                parentGroupObj = groupObj;
                if (curStrGroup.name === "combination") {
                    this.record.cursor = {
                        groupId: parentGroup.id,
                        startOffset: 0,
                        endOffset: curStrGroup.operand.length
                    };
                    // 字符内容处理
                    curStrGroup.operand.unshift(CURSOR_CHAR);
                    curStrGroup.operand.push(CURSOR_CHAR);
                } else {
                    // 函数处理， 找到函数所处的最大范围
                    while (parentGroupObj.strGroup.name !== "combination" || parentGroup.content === 1) {
                        group = parentGroup;
                        groupObj = parentGroupObj;
                        parentGroup = this.kfEditor.requestService("position.get.parent.group", groupObj.objGroup.node);
                        parentGroupObj = this.objTree.mapping[parentGroup.id];
                    }
                    var parentIndex = [].indexOf.call(parentGroup.content, group.groupObj);
                    this.record.cursor = {
                        groupId: parentGroup.id,
                        startOffset: parentIndex,
                        endOffset: parentIndex + 1
                    };
                    // 在当前函数所在的位置作标记
                    parentGroupObj.strGroup.operand.splice(parentIndex + 1, 0, CURSOR_CHAR);
                    parentGroupObj.strGroup.operand.splice(parentIndex, 0, CURSOR_CHAR);
                }
                // 返回结构树进过序列化后所对应的latex表达式， 同时包含有当前光标定位点信息
                resultStr = this.kfEditor.requestService("parser.latex.serialization", this.objTree.parsedTree);
                startOffset = resultStr.indexOf(CURSOR_CHAR);
                resultStr = resultStr.replace(CURSOR_CHAR, "");
                endOffset = resultStr.indexOf(CURSOR_CHAR);
                parentGroupObj.strGroup.operand.splice(this.record.cursor.startOffset, 1);
                parentGroupObj.strGroup.operand.splice(this.record.cursor.endOffset, 1);
                return {
                    str: resultStr,
                    startOffset: startOffset,
                    endOffset: endOffset
                };
            },
            getSource: function getSource() {
                return this.serialization().str.replace(CURSOR_CHAR, "").replace(CURSOR_CHAR, "");
            },
            isEmpty: function isEmpty() {
                return this.hasRootplaceholder();
            },
            serialization: function serialization() {
                var cursor = this.record.cursor, objGroup = this.objTree.mapping[cursor.groupId], curStrGroup = objGroup.strGroup, resultStr = null, strStartIndex = -1, strEndIndex = -1;
                // 格式化偏移值， 保证在处理操作数时， 标记位置不会出错
                strStartIndex = Math.min(cursor.endOffset, cursor.startOffset);
                strEndIndex = Math.max(cursor.endOffset, cursor.startOffset);
                curStrGroup.operand.splice(strEndIndex, 0, CURSOR_CHAR);
                curStrGroup.operand.splice(strStartIndex, 0, CURSOR_CHAR);
                strEndIndex += 1;
                // 返回结构树进过序列化后所对应的latex表达式， 同时包含有当前光标定位点信息
                resultStr = this.kfEditor.requestService("parser.latex.serialization", this.objTree.parsedTree);
                curStrGroup.operand.splice(strEndIndex, 1);
                curStrGroup.operand.splice(strStartIndex, 1);
                strStartIndex = resultStr.indexOf(CURSOR_CHAR);
                // 选区长度为0, 则只使用一个标记位
                if (cursor.startOffset === cursor.endOffset) {
                    resultStr = resultStr.replace(CURSOR_CHAR, "");
                }
                strEndIndex = resultStr.lastIndexOf(CURSOR_CHAR);
                return {
                    str: resultStr,
                    startOffset: strStartIndex,
                    endOffset: strEndIndex
                };
            },
            // 更新光标记录， 同时更新数据
            updateCursor: function updateCursor(groupId, startOffset, endOffset) {
                var tmp = null;
                // 支持一个cursorinfo对象
                if (arguments.length === 1) {
                    endOffset = groupId.endOffset;
                    startOffset = groupId.startOffset;
                    groupId = groupId.groupId;
                }
                if (endOffset === undefined) {
                    endOffset = startOffset;
                }
                if (startOffset > endOffset) {
                    tmp = endOffset;
                    endOffset = startOffset;
                    startOffset = tmp;
                }
                this.record.cursor = {
                    groupId: groupId,
                    startOffset: startOffset,
                    endOffset: endOffset
                };
            },
            leftMove: function leftMove() {
                this.components.move.leftMove();
            },
            rightMove: function rightMove() {
                this.components.move.rightMove();
            },
            // 根据当前光标的信息，删除组
            deleteGroup: function deleteGroup() {
                return this.components["delete"].deleteGroup();
            },
            insertSubtree: function insertSubtree(subtree) {
                var cursorInfo = this.record.cursor, // 当前光标信息所在的子树
                startOffset = 0, endOffset = 0, currentTree = null, diff = 0;
                if (this.isPlaceholder(cursorInfo.groupId)) {
                    // 当前在占位符内，所以用子树替换占位符
                    this.replaceTree(subtree);
                } else {
                    startOffset = Math.min(cursorInfo.startOffset, cursorInfo.endOffset);
                    endOffset = Math.max(cursorInfo.startOffset, cursorInfo.endOffset);
                    diff = endOffset - startOffset;
                    currentTree = this.objTree.mapping[cursorInfo.groupId].strGroup;
                    // 插入子树
                    currentTree.operand.splice(startOffset, diff, subtree);
                    // 更新光标记录
                    cursorInfo.startOffset += 1;
                    cursorInfo.endOffset = cursorInfo.startOffset;
                }
            },
            replaceTree: function replaceTree(subtree) {
                var cursorInfo = this.record.cursor, groupNode = this.objTree.mapping[cursorInfo.groupId].objGroup.node, parentInfo = this.kfEditor.requestService("position.get.parent.info", groupNode), currentTree = this.objTree.mapping[parentInfo.group.id].strGroup;
                // 替换占位符为子树
                currentTree.operand[parentInfo.index] = subtree;
                // 更新光标
                cursorInfo.groupId = parentInfo.group.id;
                cursorInfo.startOffset = parentInfo.index + 1;
                cursorInfo.endOffset = parentInfo.index + 1;
            }
        });
        return SyntaxComponenet;
    }
};

//.tmp_build/src/sysconf.js
/*!
 * 系统配置文件
 */
_p[31] = {
    value: function() {
        return {
            // 光标符号
            cursorCharacter: "",
            // 根占位符内容与颜色
            rootPlaceholder: {
                color: "#666",
                content: "在此处键入公式",
                fontsize: 16
            },
            scrollbar: {
                padding: 5,
                step: 150
            }
        };
    }
};

//.tmp_build/src/ui/char-position.data.js
/**
 * 特殊字符区域的icon位置数据
 */
_p[32] = {
    value: function() {
        return {
            "\\pm": {
                x: 5,
                y: 0
            },
            "\\infty": {
                x: 42,
                y: 0
            },
            "=": {
                x: 79,
                y: 0
            },
            "\\sim": {
                x: 116,
                y: 0
            },
            "\\times": {
                x: 153,
                y: 0
            },
            "\\div": {
                x: 190,
                y: 0
            },
            "!": {
                x: 227,
                y: 0
            },
            "<": {
                x: 264,
                y: 0
            },
            "\\ll": {
                x: 301,
                y: 0
            },
            ">": {
                x: 338,
                y: 0
            },
            "\\gg": {
                x: 375,
                y: 0
            },
            "\\leq": {
                x: 412,
                y: 0
            },
            "\\geq": {
                x: 449,
                y: 0
            },
            "\\mp": {
                x: 486,
                y: 0
            },
            "\\cong": {
                x: 523,
                y: 0
            },
            "\\equiv": {
                x: 560,
                y: 0
            },
            "\\propto": {
                x: 597,
                y: 0
            },
            "\\approx": {
                x: 634,
                y: 0
            },
            "\\forall": {
                x: 671,
                y: 0
            },
            "\\partial": {
                x: 708,
                y: 0
            },
            "\\surd": {
                x: 745,
                y: 0
            },
            "\\cup": {
                x: 782,
                y: 0
            },
            "\\cap": {
                x: 819,
                y: 0
            },
            "\\varnothing": {
                x: 856,
                y: 0
            },
            "%": {
                x: 893,
                y: 0
            },
            "\\circ": {
                x: 930,
                y: 0
            },
            "\\exists": {
                x: 967,
                y: 0
            },
            "\\nexists": {
                x: 1004,
                y: 0
            },
            "\\in": {
                x: 1041,
                y: 0
            },
            "\\ni": {
                x: 1078,
                y: 0
            },
            "\\gets": {
                x: 5,
                y: 37
            },
            "\\uparrow": {
                x: 42,
                y: 37
            },
            "\\to": {
                x: 79,
                y: 37
            },
            "\\downarrow": {
                x: 116,
                y: 37
            },
            "\\leftrightarrow": {
                x: 153,
                y: 37
            },
            "\\therefore": {
                x: 190,
                y: 37
            },
            "\\because": {
                x: 227,
                y: 37
            },
            "+": {
                x: 264,
                y: 37
            },
            "-": {
                x: 301,
                y: 37
            },
            "\\neg": {
                x: 338,
                y: 37
            },
            "\\ast": {
                x: 375,
                y: 37
            },
            "\\cdot": {
                x: 412,
                y: 37
            },
            "\\vdots": {
                x: 449,
                y: 37
            },
            "\\ddots": {
                x: 486,
                y: 37
            },
            "\\aleph": {
                x: 523,
                y: 37
            },
            "\\beth": {
                x: 560,
                y: 37
            },
            "\\blacksquare": {
                x: 597,
                y: 37
            },
            "\\alpha": {
                x: 634,
                y: 37
            },
            "\\beta": {
                x: 671,
                y: 37
            },
            "\\gamma": {
                x: 708,
                y: 37
            },
            "\\delta": {
                x: 745,
                y: 37
            },
            "\\epsilon": {
                x: 782,
                y: 37
            },
            "\\zeta": {
                x: 819,
                y: 37
            },
            "\\eta": {
                x: 856,
                y: 37
            },
            "\\theta": {
                x: 893,
                y: 37
            },
            "\\iota": {
                x: 930,
                y: 37
            },
            "\\kappa": {
                x: 967,
                y: 37
            },
            "\\lambda": {
                x: 1004,
                y: 37
            },
            "\\mu": {
                x: 1041,
                y: 37
            },
            "\\nu": {
                x: 1078,
                y: 37
            },
            "\\xi": {
                x: 5,
                y: 74
            },
            "\\omicron": {
                x: 42,
                y: 74
            },
            "\\pi": {
                x: 79,
                y: 74
            },
            "\\rho": {
                x: 116,
                y: 74
            },
            "\\sigma": {
                x: 153,
                y: 74
            },
            "\\tau": {
                x: 190,
                y: 74
            },
            "\\upsilon": {
                x: 227,
                y: 74
            },
            "\\phi": {
                x: 264,
                y: 74
            },
            "\\chi": {
                x: 301,
                y: 74
            },
            "\\psi": {
                x: 338,
                y: 74
            },
            "\\omega": {
                x: 375,
                y: 74
            },
            "\\Alpha": {
                x: 412,
                y: 74
            },
            "\\Beta": {
                x: 449,
                y: 74
            },
            "\\Gamma": {
                x: 486,
                y: 74
            },
            "\\Delta": {
                x: 523,
                y: 74
            },
            "\\Epsilon": {
                x: 560,
                y: 74
            },
            "\\Zeta": {
                x: 597,
                y: 74
            },
            "\\Eta": {
                x: 634,
                y: 74
            },
            "\\Theta": {
                x: 671,
                y: 74
            },
            "\\Iota": {
                x: 708,
                y: 74
            },
            "\\Kappa": {
                x: 745,
                y: 74
            },
            "\\Lambda": {
                x: 782,
                y: 74
            },
            "\\Mu": {
                x: 819,
                y: 74
            },
            "\\Nu": {
                x: 856,
                y: 74
            },
            "\\Xi": {
                x: 893,
                y: 74
            },
            "\\Omicron": {
                x: 930,
                y: 74
            },
            "\\Pi": {
                x: 967,
                y: 74
            },
            "\\Rho": {
                x: 1004,
                y: 74
            },
            "\\Sigma": {
                x: 1041,
                y: 74
            },
            "\\Tau": {
                x: 1078,
                y: 74
            },
            "\\Upsilon": {
                x: 5,
                y: 111
            },
            "\\Phi": {
                x: 42,
                y: 111
            },
            "\\Chi": {
                x: 79,
                y: 111
            },
            "\\Psi": {
                x: 116,
                y: 111
            },
            "\\Omega": {
                x: 153,
                y: 111
            },
            "\\digamma": {
                x: 190,
                y: 111
            },
            "\\varepsilon": {
                x: 227,
                y: 111
            },
            "\\varkappa": {
                x: 264,
                y: 111
            },
            "\\varphi": {
                x: 301,
                y: 111
            },
            "\\varpi": {
                x: 338,
                y: 111
            },
            "\\varrho": {
                x: 375,
                y: 111
            },
            "\\varsigma": {
                x: 412,
                y: 111
            },
            "\\vartheta": {
                x: 449,
                y: 111
            },
            "\\neq": {
                x: 486,
                y: 111
            },
            "\\nless": {
                x: 523,
                y: 111
            },
            "\\ngtr": {
                x: 560,
                y: 111
            },
            "\\nleq": {
                x: 597,
                y: 111
            },
            "\\ngeq": {
                x: 634,
                y: 111
            },
            "\\nsim": {
                x: 671,
                y: 111
            },
            "\\lneqq": {
                x: 708,
                y: 111
            },
            "\\gneqq": {
                x: 745,
                y: 111
            },
            "\\nprec": {
                x: 782,
                y: 111
            },
            "\\nsucc": {
                x: 819,
                y: 111
            },
            "\\notin": {
                x: 856,
                y: 111
            },
            "\\nsubseteq": {
                x: 893,
                y: 111
            },
            "\\nsupseteq": {
                x: 930,
                y: 111
            },
            "\\subsetneq": {
                x: 967,
                y: 111
            },
            "\\supsetneq": {
                x: 1004,
                y: 111
            },
            "\\lnsim": {
                x: 1041,
                y: 111
            },
            "\\gnsim": {
                x: 1078,
                y: 111
            },
            "\\precnsim": {
                x: 5,
                y: 148
            },
            "\\succnsim": {
                x: 42,
                y: 148
            },
            "\\ntriangleleft": {
                x: 79,
                y: 148
            },
            "\\ntriangleright": {
                x: 116,
                y: 148
            },
            "\\ntrianglelefteq": {
                x: 153,
                y: 148
            },
            "\\ntrianglerighteq": {
                x: 190,
                y: 148
            },
            "\\nmid": {
                x: 227,
                y: 148
            },
            "\\nparallel": {
                x: 264,
                y: 148
            },
            "\\nvdash": {
                x: 301,
                y: 148
            },
            "\\nVdash": {
                x: 338,
                y: 148
            },
            "\\nvDash": {
                x: 375,
                y: 148
            },
            "\\nVDash": {
                x: 412,
                y: 148
            },
            "\\daleth": {
                x: 449,
                y: 148
            },
            "\\gimel": {
                x: 486,
                y: 148
            },
            "\\complement": {
                x: 523,
                y: 148
            },
            "\\ell": {
                x: 560,
                y: 148
            },
            "\\eth": {
                x: 597,
                y: 148
            },
            "\\hbar": {
                x: 634,
                y: 148
            },
            "\\hslash": {
                x: 671,
                y: 148
            },
            "\\mho": {
                x: 708,
                y: 148
            },
            "\\wp": {
                x: 745,
                y: 148
            },
            "\\circledS": {
                x: 782,
                y: 148
            },
            "\\Bbbk": {
                x: 819,
                y: 148
            },
            "\\Finv": {
                x: 856,
                y: 148
            },
            "\\Game": {
                x: 893,
                y: 148
            },
            "\\Im": {
                x: 930,
                y: 148
            },
            "\\Re": {
                x: 967,
                y: 148
            },
            "\\updownarrow": {
                x: 1004,
                y: 148
            },
            "\\Leftarrow": {
                x: 1041,
                y: 148
            },
            "\\Rightarrow": {
                x: 1078,
                y: 148
            },
            "\\Uparrow": {
                x: 5,
                y: 185
            },
            "\\Downarrow": {
                x: 42,
                y: 185
            },
            "\\Leftrightarrow": {
                x: 79,
                y: 185
            },
            "\\Updownarrow": {
                x: 116,
                y: 185
            },
            "\\longleftarrow": {
                x: 153,
                y: 185
            },
            "\\longrightarrow": {
                x: 190,
                y: 185
            },
            "\\longleftrightarrow": {
                x: 227,
                y: 185
            },
            "\\Longleftarrow": {
                x: 264,
                y: 185
            },
            "\\Longrightarrow": {
                x: 301,
                y: 185
            },
            "\\Longleftrightarrow": {
                x: 338,
                y: 185
            },
            "\\nearrow": {
                x: 375,
                y: 185
            },
            "\\nwarrow": {
                x: 412,
                y: 185
            },
            "\\searrow": {
                x: 449,
                y: 185
            },
            "\\swarrow": {
                x: 486,
                y: 185
            },
            "\\nleftarrow": {
                x: 523,
                y: 185
            },
            "\\nrightarrow": {
                x: 560,
                y: 185
            },
            "\\nLeftarrow": {
                x: 597,
                y: 185
            },
            "\\nRightarrow": {
                x: 634,
                y: 185
            },
            "\\nLeftrightarrow": {
                x: 671,
                y: 185
            },
            "\\leftharpoonup": {
                x: 708,
                y: 185
            },
            "\\leftharpoondown": {
                x: 745,
                y: 185
            },
            "\\rightharpoonup": {
                x: 782,
                y: 185
            },
            "\\rightharpoondown": {
                x: 819,
                y: 185
            },
            "\\upharpoonleft": {
                x: 856,
                y: 185
            },
            "\\upharpoonright": {
                x: 893,
                y: 185
            },
            "\\downharpoonleft": {
                x: 930,
                y: 185
            },
            "\\downharpoonright": {
                x: 967,
                y: 185
            },
            "\\leftrightharpoons": {
                x: 1004,
                y: 185
            },
            "\\rightleftharpoons": {
                x: 1041,
                y: 185
            },
            "\\leftleftarrows": {
                x: 1078,
                y: 185
            },
            "\\rightrightarrows": {
                x: 5,
                y: 222
            },
            "\\upuparrows": {
                x: 42,
                y: 222
            },
            "\\downdownarrows": {
                x: 79,
                y: 222
            },
            "\\leftrightarrows": {
                x: 116,
                y: 222
            },
            "\\rightleftarrows": {
                x: 153,
                y: 222
            },
            "\\looparrowleft": {
                x: 190,
                y: 222
            },
            "\\looparrowright": {
                x: 227,
                y: 222
            },
            "\\leftarrowtail": {
                x: 264,
                y: 222
            },
            "\\rightarrowtail": {
                x: 301,
                y: 222
            },
            "\\Lsh": {
                x: 338,
                y: 222
            },
            "\\Rsh": {
                x: 375,
                y: 222
            },
            "\\Lleftarrow": {
                x: 412,
                y: 222
            },
            "\\Rrightarrow": {
                x: 449,
                y: 222
            },
            "\\curvearrowleft": {
                x: 486,
                y: 222
            },
            "\\curvearrowright": {
                x: 523,
                y: 222
            },
            "\\circlearrowleft": {
                x: 560,
                y: 222
            },
            "\\circlearrowright": {
                x: 597,
                y: 222
            },
            "\\multimap": {
                x: 634,
                y: 222
            },
            "\\leftrightsquigarrow": {
                x: 671,
                y: 222
            },
            "\\twoheadleftarrow": {
                x: 708,
                y: 222
            },
            "\\twoheadrightarrow": {
                x: 745,
                y: 222
            },
            "\\rightsquigarrow": {
                x: 782,
                y: 222
            },
            "\\mathcal{A}": {
                x: 819,
                y: 222
            },
            "\\mathcal{B}": {
                x: 856,
                y: 222
            },
            "\\mathcal{C}": {
                x: 893,
                y: 222
            },
            "\\mathcal{D}": {
                x: 930,
                y: 222
            },
            "\\mathcal{E}": {
                x: 967,
                y: 222
            },
            "\\mathcal{F}": {
                x: 1004,
                y: 222
            },
            "\\mathcal{G}": {
                x: 1041,
                y: 222
            },
            "\\mathcal{H}": {
                x: 1078,
                y: 222
            },
            "\\mathcal{I}": {
                x: 5,
                y: 259
            },
            "\\mathcal{J}": {
                x: 42,
                y: 259
            },
            "\\mathcal{K}": {
                x: 79,
                y: 259
            },
            "\\mathcal{L}": {
                x: 116,
                y: 259
            },
            "\\mathcal{M}": {
                x: 153,
                y: 259
            },
            "\\mathcal{N}": {
                x: 190,
                y: 259
            },
            "\\mathcal{O}": {
                x: 227,
                y: 259
            },
            "\\mathcal{P}": {
                x: 264,
                y: 259
            },
            "\\mathcal{Q}": {
                x: 301,
                y: 259
            },
            "\\mathcal{R}": {
                x: 338,
                y: 259
            },
            "\\mathcal{S}": {
                x: 375,
                y: 259
            },
            "\\mathcal{T}": {
                x: 412,
                y: 259
            },
            "\\mathcal{U}": {
                x: 449,
                y: 259
            },
            "\\mathcal{V}": {
                x: 486,
                y: 259
            },
            "\\mathcal{W}": {
                x: 523,
                y: 259
            },
            "\\mathcal{X}": {
                x: 560,
                y: 259
            },
            "\\mathcal{Y}": {
                x: 597,
                y: 259
            },
            "\\mathcal{Z}": {
                x: 634,
                y: 259
            },
            "\\mathfrak{A}": {
                x: 671,
                y: 259
            },
            "\\mathfrak{B}": {
                x: 708,
                y: 259
            },
            "\\mathfrak{C}": {
                x: 745,
                y: 259
            },
            "\\mathfrak{D}": {
                x: 782,
                y: 259
            },
            "\\mathfrak{E}": {
                x: 819,
                y: 259
            },
            "\\mathfrak{F}": {
                x: 856,
                y: 259
            },
            "\\mathfrak{G}": {
                x: 893,
                y: 259
            },
            "\\mathfrak{H}": {
                x: 930,
                y: 259
            },
            "\\mathfrak{I}": {
                x: 967,
                y: 259
            },
            "\\mathfrak{J}": {
                x: 1004,
                y: 259
            },
            "\\mathfrak{K}": {
                x: 1041,
                y: 259
            },
            "\\mathfrak{L}": {
                x: 1078,
                y: 259
            },
            "\\mathfrak{M}": {
                x: 5,
                y: 296
            },
            "\\mathfrak{N}": {
                x: 42,
                y: 296
            },
            "\\mathfrak{O}": {
                x: 79,
                y: 296
            },
            "\\mathfrak{P}": {
                x: 116,
                y: 296
            },
            "\\mathfrak{Q}": {
                x: 153,
                y: 296
            },
            "\\mathfrak{R}": {
                x: 190,
                y: 296
            },
            "\\mathfrak{S}": {
                x: 227,
                y: 296
            },
            "\\mathfrak{T}": {
                x: 264,
                y: 296
            },
            "\\mathfrak{U}": {
                x: 301,
                y: 296
            },
            "\\mathfrak{V}": {
                x: 338,
                y: 296
            },
            "\\mathfrak{W}": {
                x: 375,
                y: 296
            },
            "\\mathfrak{X}": {
                x: 412,
                y: 296
            },
            "\\mathfrak{Y}": {
                x: 449,
                y: 296
            },
            "\\mathfrak{Z}": {
                x: 486,
                y: 296
            },
            "\\mathfrak{a}": {
                x: 523,
                y: 296
            },
            "\\mathfrak{b}": {
                x: 560,
                y: 296
            },
            "\\mathfrak{c}": {
                x: 597,
                y: 296
            },
            "\\mathfrak{d}": {
                x: 634,
                y: 296
            },
            "\\mathfrak{e}": {
                x: 671,
                y: 296
            },
            "\\mathfrak{f}": {
                x: 708,
                y: 296
            },
            "\\mathfrak{g}": {
                x: 745,
                y: 296
            },
            "\\mathfrak{h}": {
                x: 782,
                y: 296
            },
            "\\mathfrak{i}": {
                x: 819,
                y: 296
            },
            "\\mathfrak{j}": {
                x: 856,
                y: 296
            },
            "\\mathfrak{k}": {
                x: 893,
                y: 296
            },
            "\\mathfrak{l}": {
                x: 930,
                y: 296
            },
            "\\mathfrak{m}": {
                x: 967,
                y: 296
            },
            "\\mathfrak{n}": {
                x: 1004,
                y: 296
            },
            "\\mathfrak{o}": {
                x: 1041,
                y: 296
            },
            "\\mathfrak{p}": {
                x: 1078,
                y: 296
            },
            "\\mathfrak{q}": {
                x: 5,
                y: 333
            },
            "\\mathfrak{r}": {
                x: 42,
                y: 333
            },
            "\\mathfrak{s}": {
                x: 79,
                y: 333
            },
            "\\mathfrak{t}": {
                x: 116,
                y: 333
            },
            "\\mathfrak{u}": {
                x: 153,
                y: 333
            },
            "\\mathfrak{v}": {
                x: 190,
                y: 333
            },
            "\\mathfrak{w}": {
                x: 227,
                y: 333
            },
            "\\mathfrak{x}": {
                x: 264,
                y: 333
            },
            "\\mathfrak{y}": {
                x: 301,
                y: 333
            },
            "\\mathfrak{z}": {
                x: 338,
                y: 333
            },
            "\\mathbb{A}": {
                x: 375,
                y: 333
            },
            "\\mathbb{B}": {
                x: 412,
                y: 333
            },
            "\\mathbb{C}": {
                x: 449,
                y: 333
            },
            "\\mathbb{D}": {
                x: 486,
                y: 333
            },
            "\\mathbb{E}": {
                x: 523,
                y: 333
            },
            "\\mathbb{F}": {
                x: 560,
                y: 333
            },
            "\\mathbb{G}": {
                x: 597,
                y: 333
            },
            "\\mathbb{H}": {
                x: 634,
                y: 333
            },
            "\\mathbb{I}": {
                x: 671,
                y: 333
            },
            "\\mathbb{J}": {
                x: 708,
                y: 333
            },
            "\\mathbb{K}": {
                x: 745,
                y: 333
            },
            "\\mathbb{L}": {
                x: 782,
                y: 333
            },
            "\\mathbb{M}": {
                x: 819,
                y: 333
            },
            "\\mathbb{N}": {
                x: 856,
                y: 333
            },
            "\\mathbb{O}": {
                x: 893,
                y: 333
            },
            "\\mathbb{P}": {
                x: 930,
                y: 333
            },
            "\\mathbb{Q}": {
                x: 967,
                y: 333
            },
            "\\mathbb{R}": {
                x: 1004,
                y: 333
            },
            "\\mathbb{S}": {
                x: 1041,
                y: 333
            },
            "\\mathbb{T}": {
                x: 1078,
                y: 333
            },
            "\\mathbb{U}": {
                x: 5,
                y: 370
            },
            "\\mathbb{V}": {
                x: 42,
                y: 370
            },
            "\\mathbb{W}": {
                x: 79,
                y: 370
            },
            "\\mathbb{X}": {
                x: 116,
                y: 370
            },
            "\\mathbb{Y}": {
                x: 153,
                y: 370
            },
            "\\mathbb{Z}": {
                x: 190,
                y: 370
            },
            "\\mathrm{A}": {
                x: 227,
                y: 370
            },
            "\\mathrm{B}": {
                x: 264,
                y: 370
            },
            "\\mathrm{C}": {
                x: 301,
                y: 370
            },
            "\\mathrm{D}": {
                x: 338,
                y: 370
            },
            "\\mathrm{E}": {
                x: 375,
                y: 370
            },
            "\\mathrm{F}": {
                x: 412,
                y: 370
            },
            "\\mathrm{G}": {
                x: 449,
                y: 370
            },
            "\\mathrm{H}": {
                x: 486,
                y: 370
            },
            "\\mathrm{I}": {
                x: 523,
                y: 370
            },
            "\\mathrm{J}": {
                x: 560,
                y: 370
            },
            "\\mathrm{K}": {
                x: 597,
                y: 370
            },
            "\\mathrm{L}": {
                x: 634,
                y: 370
            },
            "\\mathrm{M}": {
                x: 671,
                y: 370
            },
            "\\mathrm{N}": {
                x: 708,
                y: 370
            },
            "\\mathrm{O}": {
                x: 745,
                y: 370
            },
            "\\mathrm{P}": {
                x: 782,
                y: 370
            },
            "\\mathrm{Q}": {
                x: 819,
                y: 370
            },
            "\\mathrm{R}": {
                x: 856,
                y: 370
            },
            "\\mathrm{S}": {
                x: 893,
                y: 370
            },
            "\\mathrm{T}": {
                x: 930,
                y: 370
            },
            "\\mathrm{U}": {
                x: 967,
                y: 370
            },
            "\\mathrm{V}": {
                x: 1004,
                y: 370
            },
            "\\mathrm{W}": {
                x: 1041,
                y: 370
            },
            "\\mathrm{X}": {
                x: 1078,
                y: 370
            },
            "\\mathrm{Y}": {
                x: 5,
                y: 407
            },
            "\\mathrm{Z}": {
                x: 42,
                y: 407
            },
            "\\mathrm{a}": {
                x: 79,
                y: 407
            },
            "\\mathrm{b}": {
                x: 116,
                y: 407
            },
            "\\mathrm{c}": {
                x: 153,
                y: 407
            },
            "\\mathrm{d}": {
                x: 190,
                y: 407
            },
            "\\mathrm{e}": {
                x: 227,
                y: 407
            },
            "\\mathrm{f}": {
                x: 264,
                y: 407
            },
            "\\mathrm{g}": {
                x: 301,
                y: 407
            },
            "\\mathrm{h}": {
                x: 338,
                y: 407
            },
            "\\mathrm{i}": {
                x: 375,
                y: 407
            },
            "\\mathrm{j}": {
                x: 412,
                y: 407
            },
            "\\mathrm{k}": {
                x: 449,
                y: 407
            },
            "\\mathrm{l}": {
                x: 486,
                y: 407
            },
            "\\mathrm{m}": {
                x: 523,
                y: 407
            },
            "\\mathrm{n}": {
                x: 560,
                y: 407
            },
            "\\mathrm{o}": {
                x: 597,
                y: 407
            },
            "\\mathrm{p}": {
                x: 634,
                y: 407
            },
            "\\mathrm{q}": {
                x: 671,
                y: 407
            },
            "\\mathrm{r}": {
                x: 708,
                y: 407
            },
            "\\mathrm{s}": {
                x: 745,
                y: 407
            },
            "\\mathrm{t}": {
                x: 782,
                y: 407
            },
            "\\mathrm{u}": {
                x: 819,
                y: 407
            },
            "\\mathrm{v}": {
                x: 856,
                y: 407
            },
            "\\mathrm{w}": {
                x: 893,
                y: 407
            },
            "\\mathrm{x}": {
                x: 930,
                y: 407
            },
            "\\mathrm{y}": {
                x: 967,
                y: 407
            },
            "\\mathrm{z}": {
                x: 1004,
                y: 407
            }
        };
    }
};

//.tmp_build/src/ui/control/zoom.js
/*!
 * 滚动缩放控制器
 */
_p[33] = {
    value: function(require) {
        var Utils = _p.r(4), kity = _p.r(22), DEFAULT_OPTIONS = {
            min: 1,
            max: 2
        }, ScrollZoomController = kity.createClass("ScrollZoomController", {
            constructor: function constructor(parentComponent, kfEditor, target, options) {
                this.kfEditor = kfEditor;
                this.target = target;
                this.zoom = 1;
                this.step = .05;
                this.options = Utils.extend({}, DEFAULT_OPTIONS, options);
                this.initEvent();
            },
            initEvent: function initEvent() {
                var kfEditor = this.kfEditor, _self = this, min = this.options.min, max = this.options.max, step = this.step;
                Utils.addEvent(this.target, "mousewheel", function(e) {
                    e.preventDefault();
                    if (e.wheelDelta < 0) {
                        // 缩小
                        _self.zoom -= _self.zoom * step;
                    } else {
                        // 放大
                        _self.zoom += _self.zoom * step;
                    }
                    _self.zoom = Math.max(_self.zoom, min);
                    _self.zoom = Math.min(_self.zoom, max);
                    kfEditor.requestService("render.set.canvas.zoom", _self.zoom);
                });
            }
        });
        return ScrollZoomController;
    }
};

//.tmp_build/src/ui/def.js
/*!
 * UI定义
 */
_p[34] = {
    value: function(require) {
        return {
            // 视窗状态
            VIEW_STATE: {
                // 内容未超出画布
                NO_OVERFLOW: 0,
                // 内容溢出
                OVERFLOW: 1
            },
            scrollbar: {
                step: 50,
                thumbMinSize: 50
            }
        };
    }
};

//.tmp_build/src/ui/header/header.js
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
_p[35] = {
    value: function(require) {
        var kity = _p.r(22), $$ = _p.r(60), Header = kity.createClass("Header", {
            constructor: function constructor(uiComponent, kfEditor) {
                this.prefix = "kf-editor-header-container";
                this.kfEditor = kfEditor;
                this.uiComponent = uiComponent;
                this.initKeyboardElements();
                this.initEvent();
            },
            initEvent: function initEvent() {
                var _this = this;
                $$.delegate(this.uiComponent.header, "." + this.prefix, "click", function() {
                    _this.kfEditor.eclassWebService.send({
                        type: "common.closeModal"
                    });
                });
            },
            initKeyboardElements: function initKeyboardElements() {
                var doc = this.uiComponent.header.ownerDocument;
                var ele = this.createHeader(doc, this.kfEditor);
                this.uiComponent.header.appendChild(ele);
            },
            createHeader: function createHeader(doc, kfEditor) {
                return $$.ele(doc, "div", {
                    className: this.prefix,
                    content: '\n                <div class="'.concat(this.prefix, '-title">插入字符</div>\n                <div class="').concat(this.prefix, '-close"></div>\n              ')
                });
            }
        });
        return Header;
    }
};

//.tmp_build/src/ui/keyboard/keyboard.js
/*
 * @Author: Demian
 * @Date: 2020-04-14 16:31:36
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-23 09:48:01
 */
_p[36] = {
    value: function(require) {
        var kity = _p.r(22), UiImpl = _p.r(61), $$ = _p.r(60), Keyboard = kity.createClass("Keyboard", {
            constructor: function constructor(uiComponent, kfEditor) {
                this.kfEditor = kfEditor;
                this.uiComponent = uiComponent;
                this.initKeyboardElements();
                // this.initServices();
                this.initEvent();
            },
            // initServices: function () {
            //   this.kfEditor.registerService('ui.toolbar.disable', this, {
            //     disableToolbar: this.disableToolbar,
            //   });
            //   this.kfEditor.registerService('ui.toolbar.enable', this, {
            //     enableToolbar: this.enableToolbar,
            //   });
            //   this.kfEditor.registerService('ui.toolbar.close', this, {
            //     closeToolbar: this.closeToolbar,
            //   });
            // },
            initEvent: function initEvent() {
                var _self = this;
                $$.on(this.uiComponent.keyboardContainer, "mousedown", function(e) {
                    e.preventDefault();
                });
                $$.on(this.uiComponent.keyboardContainer, "mousewheel", function(e) {
                    e.preventDefault();
                });
                // // 通知所有组件关闭
                // $$.on(this.kfEditor.getContainer(), 'mousedown', function () {
                //   _self.notify('closeAll');
                // });
                // 订阅数据选择主题
                $$.subscribe("panel.select", function(data) {
                    _self.insertSource(data);
                });
            },
            insertSource: function insertSource(val) {
                this.kfEditor.requestService("control.insert.string", val);
            },
            // disableToolbar: function () {
            //   kity.Utils.each(this.elements, function (ele) {
            //     ele.disable && ele.disable();
            //   });
            // },
            // enableToolbar: function () {
            //   kity.Utils.each(this.elements, function (ele) {
            //     ele.enable && ele.enable();
            //   });
            // },
            // getContainer: function () {
            //   return this.kfEditor.requestService('ui.get.canvas.container');
            // },
            // closeToolbar: function () {
            //   this.closeElement();
            // },
            // 接受到关闭通知
            // notify: function (type) {
            //   switch (type) {
            //     // 关闭所有组件
            //     case 'closeAll':
            //     // 关闭其他组件
            //     case 'closeOther':
            //       this.closeElement(arguments[1]);
            //       return;
            //   }
            // },
            // closeElement: function (exception) {
            //   kity.Utils.each(this.elements, function (ele) {
            //     if (ele != exception) {
            //       ele.hide && ele.hide();
            //     }
            //   });
            // },
            initKeyboardElements: function initKeyboardElements() {
                var doc = this.uiComponent.keyboardContainer.ownerDocument;
                var ele = createKeyboard(doc, this.kfEditor);
                this.appendElement(ele);
            },
            appendElement: function appendElement(uiElement) {
                uiElement.attachTo(this.uiComponent.keyboardContainer);
            }
        });
        function createKeyboard(doc, kfEditor) {
            return new UiImpl.Keyboard(doc, kfEditor);
        }
        return Keyboard;
    }
};

//.tmp_build/src/ui/other-position.data.js
/**
 * 特殊字符区域之外的icon位置和大小数据
 */
_p[37] = {
    value: function() {
        return {
            "x=\\frac {-b\\pm\\sqrt {b^2-4ac}}{2a}": {
                pos: {
                    x: 0,
                    y: 0
                },
                size: {
                    width: 310,
                    height: 73
                }
            },
            "{\\placeholder/\\placeholder}": {
                pos: {
                    x: 315,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\frac \\placeholder\\placeholder": {
                pos: {
                    x: 376,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "a^2+b^2=c^2": {
                pos: {
                    x: 437,
                    y: 0
                },
                size: {
                    width: 310,
                    height: 73
                }
            },
            "{\\left(x+a\\right)}^2=\\sum^n_{k=0}{\\left(^n_k\\right)x^ka^{n-k}}": {
                pos: {
                    x: 752,
                    y: 0
                },
                size: {
                    width: 310,
                    height: 73
                }
            },
            "\\frac {dy}{dx}": {
                pos: {
                    x: 1067,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\frac {\\Delta y}{\\Delta x}": {
                pos: {
                    x: 1128,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\frac {\\delta y}{\\delta x}": {
                pos: {
                    x: 1189,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\frac \\pi 2": {
                pos: {
                    x: 1250,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\placeholder^\\placeholder": {
                pos: {
                    x: 1311,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\placeholder^\\placeholder_\\placeholder": {
                pos: {
                    x: 1372,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\placeholder_\\placeholder": {
                pos: {
                    x: 1433,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "{^\\placeholder_\\placeholder\\placeholder}": {
                pos: {
                    x: 1494,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "e^{-i\\omega t}": {
                pos: {
                    x: 1555,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "x^2": {
                pos: {
                    x: 1616,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "{}^n_1Y": {
                pos: {
                    x: 1677,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sqrt \\placeholder": {
                pos: {
                    x: 1738,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sqrt [\\placeholder] \\placeholder": {
                pos: {
                    x: 1799,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sqrt [2] \\placeholder": {
                pos: {
                    x: 1860,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sqrt [3] \\placeholder": {
                pos: {
                    x: 1921,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\frac {-b\\pm\\sqrt{b^2-4ac}}{2a}": {
                pos: {
                    x: 1982,
                    y: 0
                },
                size: {
                    width: 137,
                    height: 75
                }
            },
            "\\sqrt {a^2+b^2}": {
                pos: {
                    x: 2124,
                    y: 0
                },
                size: {
                    width: 137,
                    height: 75
                }
            },
            "\\int \\placeholder": {
                pos: {
                    x: 2266,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\int^\\placeholder_\\placeholder\\placeholder": {
                pos: {
                    x: 2327,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\iint\\placeholder": {
                pos: {
                    x: 2388,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\iint^\\placeholder_\\placeholder\\placeholder": {
                pos: {
                    x: 2449,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\iiint\\placeholder": {
                pos: {
                    x: 2510,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\iiint^\\placeholder_\\placeholder\\placeholder": {
                pos: {
                    x: 2571,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sum\\placeholder": {
                pos: {
                    x: 2632,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sum^\\placeholder_\\placeholder\\placeholder": {
                pos: {
                    x: 2693,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sum_\\placeholder\\placeholder": {
                pos: {
                    x: 2754,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\left(\\placeholder\\right)": {
                pos: {
                    x: 2815,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\left[\\placeholder\\right]": {
                pos: {
                    x: 2876,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\left\\{\\placeholder\\right\\}": {
                pos: {
                    x: 2937,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\left|\\placeholder\\right|": {
                pos: {
                    x: 2998,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sin\\placeholder": {
                pos: {
                    x: 3059,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\cos\\placeholder": {
                pos: {
                    x: 3120,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\tan\\placeholder": {
                pos: {
                    x: 3181,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\csc\\placeholder": {
                pos: {
                    x: 3242,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sec\\placeholder": {
                pos: {
                    x: 3303,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\cot\\placeholder": {
                pos: {
                    x: 3364,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\sin\\theta": {
                pos: {
                    x: 3425,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\cos{2x}": {
                pos: {
                    x: 3486,
                    y: 0
                },
                size: {
                    width: 56,
                    height: 75
                }
            },
            "\\tan\\theta=\\frac {\\sin\\theta}{\\cos\\theta}": {
                pos: {
                    x: 3547,
                    y: 0
                },
                size: {
                    width: 137,
                    height: 75
                }
            }
        };
    }
};

//.tmp_build/src/ui/toolbar-ele-list.bak.js
/*!
 * toolbar元素列表定义
 */
_p[38] = {
    value: function(require) {
        var UI_ELE_TYPE = _p.r(45), BOX_TYPE = _p.r(44), kity = _p.r(22);
        var config = [ {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "预设<br/>",
                    className: "yushe-btn",
                    icon: "assets/images/toolbar/button/fx.png",
                    iconSize: {
                        w: 40
                    }
                },
                box: {
                    width: 367,
                    group: [ {
                        title: "预设公式",
                        items: [ {
                            title: "预设公式",
                            content: [ {
                                label: "二次公式",
                                item: {
                                    show: "assets/images/toolbar/ys/1.png",
                                    val: "x=\\frac {-b\\pm\\sqrt {b^2-4ac}}{2a}"
                                }
                            }, {
                                label: "二项式定理",
                                item: {
                                    show: "assets/images/toolbar/ys/2.png",
                                    val: "{\\left(x+a\\right)}^2=\\sum^n_{k=0}{\\left(^n_k\\right)x^ka^{n-k}}"
                                }
                            }, {
                                label: "勾股定理",
                                item: {
                                    show: "assets/images/toolbar/ys/3.png",
                                    val: "a^2+b^2=c^2"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DELIMITER
        }, {
            type: UI_ELE_TYPE.AREA,
            options: {
                box: {
                    fixOffset: true,
                    width: 527,
                    type: BOX_TYPE.OVERLAP,
                    group: [ {
                        title: "基础数学",
                        items: []
                    }, {
                        title: "希腊字母",
                        items: []
                    }, {
                        title: "求反关系运算符",
                        items: []
                    }, {
                        title: "字母类符号",
                        items: []
                    }, {
                        title: "箭头",
                        items: []
                    }, {
                        title: "手写体",
                        items: []
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DELIMITER
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "分数<br/>",
                    icon: "assets/images/toolbar/button/frac.png"
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "分数",
                        items: [ {
                            title: "分数",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/frac/1.png",
                                    val: "\\frac \\placeholder\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/frac/2.png",
                                    val: "{\\placeholder/\\placeholder}"
                                }
                            } ]
                        }, {
                            title: "常用分数",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/frac/c1.png",
                                    val: "\\frac {dy}{dx}"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/frac/c2.png",
                                    val: "\\frac {\\Delta y}{\\Delta x}"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/frac/c4.png",
                                    val: "\\frac {\\delta y}{\\delta x}"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/frac/c5.png",
                                    val: "\\frac \\pi 2"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "上下标<br/>",
                    icon: "assets/images/toolbar/button/script.png"
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "上标和下标",
                        items: [ {
                            title: "上标和下标",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/script/1.png",
                                    val: "\\placeholder^\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/script/2.png",
                                    val: "\\placeholder_\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/script/3.png",
                                    val: "\\placeholder^\\placeholder_\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/script/4.png",
                                    val: "{^\\placeholder_\\placeholder\\placeholder}"
                                }
                            } ]
                        }, {
                            title: "常用的上标和下标",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/script/c1.png",
                                    val: "e^{-i\\omega t}"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/script/c2.png",
                                    val: "x^2"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/script/c3.png",
                                    val: "{}^n_1Y"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "根式<br/>",
                    icon: "assets/images/toolbar/button/sqrt.png"
                },
                box: {
                    width: 342,
                    group: [ {
                        title: "根式",
                        items: [ {
                            title: "根式",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/sqrt/1.png",
                                    val: "\\sqrt \\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/sqrt/2.png",
                                    val: "\\sqrt [\\placeholder] \\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/sqrt/3.png",
                                    val: "\\sqrt [2] \\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/sqrt/4.png",
                                    val: "\\sqrt [3] \\placeholder"
                                }
                            } ]
                        }, {
                            title: "常用根式",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/sqrt/c1.png",
                                    val: "\\frac {-b\\pm\\sqrt{b^2-4ac}}{2a}"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/sqrt/c2.png",
                                    val: "\\sqrt {a^2+b^2}"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "积分<br/>",
                    icon: "assets/images/toolbar/button/int.png"
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "积分",
                        items: [ {
                            title: "积分",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/int/1.png",
                                    val: "\\int \\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/int/2.png",
                                    val: "\\int^\\placeholder_\\placeholder\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/int/3.png",
                                    val: "\\iint\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/int/4.png",
                                    val: "\\iint^\\placeholder_\\placeholder\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/int/5.png",
                                    val: "\\iiint\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/int/6.png",
                                    val: "\\iiint^\\placeholder_\\placeholder\\placeholder"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "大型<br/>运算符",
                    icon: "assets/images/toolbar/button/sum.png"
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "求和",
                        items: [ {
                            title: "求和",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/large/1.png",
                                    val: "\\sum\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/large/2.png",
                                    val: "\\sum^\\placeholder_\\placeholder\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/large/3.png",
                                    val: "\\sum_\\placeholder\\placeholder"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "括号<br/>",
                    icon: "assets/images/toolbar/button/brackets.png"
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "方括号",
                        items: [ {
                            title: "方括号",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/brackets/1.png",
                                    val: "\\left(\\placeholder\\right)"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/brackets/2.png",
                                    val: "\\left[\\placeholder\\right]"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/brackets/3.png",
                                    val: "\\left\\{\\placeholder\\right\\}"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/brackets/4.png",
                                    val: "\\left|\\placeholder\\right|"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "函数<br/>",
                    icon: "assets/images/toolbar/button/sin.png"
                },
                box: {
                    width: 340,
                    group: [ {
                        title: "函数",
                        items: [ {
                            title: "三角函数",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/func/1.png",
                                    val: "\\sin\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/func/2.png",
                                    val: "\\cos\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/func/3.png",
                                    val: "\\tan\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/func/4.png",
                                    val: "\\csc\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/func/5.png",
                                    val: "\\sec\\placeholder"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/func/6.png",
                                    val: "\\cot\\placeholder"
                                }
                            } ]
                        }, {
                            title: "常用函数",
                            content: [ {
                                item: {
                                    show: "assets/images/toolbar/func/c1.png",
                                    val: "\\sin\\theta"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/func/c2.png",
                                    val: "\\sin{2x}"
                                }
                            }, {
                                item: {
                                    show: "assets/images/toolbar/func/c3.png",
                                    val: "\\tan\\theta=\\frac {\\sin\\theta}{\\cos\\theta}"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        } ];
        // 初始化基础数学
        (function() {
            var list = [ "pm", "infty", {
                key: "=",
                img: "eq"
            }, "sim", "times", "div", {
                key: "!",
                img: "tanhao"
            }, {
                key: "<",
                img: "lt"
            }, "ll", {
                key: ">",
                img: "gt"
            }, "gg", "leq", "geq", "mp", "cong", "equiv", "propto", "approx", "forall", "partial", "surd", "cup", "cap", "varnothing", {
                key: "%",
                img: "baifenhao"
            }, "circ", "exists", "nexists", "in", "ni", "gets", "uparrow", "to", "downarrow", "leftrightarrow", "therefore", "because", {
                key: "+",
                img: "plus"
            }, {
                key: "-",
                img: "minus"
            }, "neg", "ast", "cdot", "vdots", "ddots", "aleph", "beth", "blacksquare" ], configList = config[2].options.box.group[0].items;
            configList.push({
                title: "基础数学",
                content: getContents({
                    path: "assets/images/toolbar/char/math/",
                    values: list
                })
            });
        })();
        // 初始化希腊字符配置
        (function() {
            var greekList = [ {
                title: "小写",
                values: [ "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega" ]
            }, {
                title: "大写",
                values: [ "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega" ]
            }, {
                title: "变体",
                values: [ "digamma", "varepsilon", "varkappa", "varphi", "varpi", "varrho", "varsigma", "vartheta" ]
            } ], greekConfigList = config[2].options.box.group[1].items;
            // 小写处理
            greekConfigList.push({
                title: greekList[0].title,
                content: getContents({
                    path: "assets/images/toolbar/char/greek/lower/",
                    values: greekList[0].values
                })
            });
            // 大写处理
            greekConfigList.push({
                title: greekList[1].title,
                content: getContents({
                    path: "assets/images/toolbar/char/greek/upper/",
                    values: greekList[1].values
                })
            });
            // 变体处理
            greekConfigList.push({
                title: greekList[2].title,
                content: getContents({
                    path: "assets/images/toolbar/char/greek/misc/",
                    values: greekList[2].values
                })
            });
        })();
        // 初始化求反运算符
        (function() {
            var greekList = [ {
                title: "求反关系运算符",
                values: [ "neq", "nless", "ngtr", "nleq", "ngeq", "nsim", "lneqq", "gneqq", "nprec", "nsucc", "notin", "nsubseteq", "nsupseteq", "subsetneq", "supsetneq", "lnsim", "gnsim", "precnsim", "succnsim", "ntriangleleft", "ntriangleright", "ntrianglelefteq", "ntrianglerighteq", "nmid", "nparallel", "nvdash", {
                    key: "\\nVdash",
                    img: "nvdash-1"
                }, {
                    key: "\\nvDash",
                    img: "nvdash-2"
                }, {
                    key: "\\nVDash",
                    img: "nvdash-3"
                }, "nexists" ]
            } ], greekConfigList = config[2].options.box.group[2].items;
            greekConfigList.push({
                title: greekList[0].title,
                content: getContents({
                    path: "assets/images/toolbar/char/not/",
                    values: greekList[0].values
                })
            });
        })();
        // 初始字母类符号
        (function() {
            var list = [ "aleph", "beth", "daleth", "gimel", "complement", "ell", "eth", "hbar", "hslash", "mho", "partial", "wp", "circledS", "Bbbk", "Finv", "Game", "Im", "Re" ], configList = config[2].options.box.group[3].items;
            configList.push({
                title: "字母类符号",
                content: getContents({
                    path: "assets/images/toolbar/alphabetic/",
                    values: list
                })
            });
        })();
        (function() {
            var list = [ "gets", "to", "uparrow", "downarrow", "leftrightarrow", "updownarrow", {
                key: "\\Leftarrow",
                img: "u-leftarrow"
            }, {
                key: "\\Rightarrow",
                img: "u-rightarrow"
            }, {
                key: "\\Uparrow",
                img: "u-uparrow"
            }, {
                key: "\\Downarrow",
                img: "u-downarrow"
            }, {
                key: "\\Leftrightarrow",
                img: "u-leftrightarrow"
            }, {
                key: "\\Updownarrow",
                img: "u-updownarrow"
            }, "longleftarrow", "longrightarrow", "longleftrightarrow", {
                key: "\\Longleftarrow",
                img: "u-longleftarrow"
            }, {
                key: "\\Longrightarrow",
                img: "u-longrightarrow"
            }, {
                key: "\\Longleftrightarrow",
                img: "u-longleftrightarrow"
            }, "nearrow", "nwarrow", "searrow", "swarrow", "nleftarrow", "nrightarrow", {
                key: "\\nLeftarrow",
                img: "u-nleftarrow"
            }, {
                key: "\\nRightarrow",
                img: "u-nrightarrow"
            }, {
                key: "\\nLeftrightarrow",
                img: "u-nleftrightarrow"
            }, "leftharpoonup", "leftharpoondown", "rightharpoonup", "rightharpoondown", "upharpoonleft", "upharpoonright", "downharpoonleft", "downharpoonright", "leftrightharpoons", "rightleftharpoons", "leftleftarrows", "rightrightarrows", "upuparrows", "downdownarrows", "leftrightarrows", "rightleftarrows", "looparrowleft", "looparrowright", "leftarrowtail", "rightarrowtail", {
                key: "\\Lsh",
                img: "u-lsh"
            }, {
                key: "\\Rsh",
                img: "u-rsh"
            }, {
                key: "\\Lleftarrow",
                img: "u-lleftarrow"
            }, {
                key: "\\Rrightarrow",
                img: "u-rrightarrow"
            }, "curvearrowleft", "curvearrowright", "circlearrowleft", "circlearrowright", "multimap", "leftrightsquigarrow", "twoheadleftarrow", "twoheadrightarrow", "rightsquigarrow" ], configList = config[2].options.box.group[4].items;
            configList.push({
                title: "箭头",
                content: getContents({
                    path: "assets/images/toolbar/arrow/",
                    values: list
                })
            });
        })();
        (function() {
            var list = [ {
                title: "手写体",
                values: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ]
            }, {
                title: "花体",
                values: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ]
            }, {
                title: "双线",
                values: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ]
            }, {
                title: "罗马",
                values: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ]
            } ], configList = config[2].options.box.group[5].items;
            kity.Utils.each(list[0].values, function(item, index) {
                list[0].values[index] = {
                    key: "\\mathcal{" + item + "}",
                    img: item.toLowerCase()
                };
            });
            kity.Utils.each(list[1].values, function(item, index) {
                list[1].values[index] = {
                    key: "\\mathfrak{" + item + "}",
                    img: item.replace(/[A-Z]/, function(match) {
                        return "u" + match.toLowerCase();
                    })
                };
            });
            kity.Utils.each(list[2].values, function(item, index) {
                list[2].values[index] = {
                    key: "\\mathbb{" + item + "}",
                    img: item.toLowerCase()
                };
            });
            kity.Utils.each(list[3].values, function(item, index) {
                list[3].values[index] = {
                    key: "\\mathrm{" + item + "}",
                    img: item.replace(/[A-Z]/, function(match) {
                        return "u" + match.toLowerCase();
                    })
                };
            });
            // 手写体
            configList.push({
                title: list[0].title,
                content: getContents({
                    path: "assets/images/toolbar/char/cal/",
                    values: list[0].values
                })
            });
            configList.push({
                title: list[1].title,
                content: getContents({
                    path: "assets/images/toolbar/char/frak/",
                    values: list[1].values
                })
            });
            configList.push({
                title: list[2].title,
                content: getContents({
                    path: "assets/images/toolbar/char/bb/",
                    values: list[2].values
                })
            });
            configList.push({
                title: list[3].title,
                content: getContents({
                    path: "assets/images/toolbar/char/rm/",
                    values: list[3].values
                })
            });
        })();
        function getContents(data) {
            var result = [], path = data.path, values = data.values;
            kity.Utils.each(values, function(value) {
                var img = value, val = value;
                if (typeof value !== "string") {
                    img = value.img;
                    val = value.key;
                } else {
                    val = "\\" + value;
                }
                result.push({
                    item: {
                        show: "" + path + img.toLowerCase() + ".png",
                        val: val
                    }
                });
            });
            return result;
        }
        window.iconConfig = config;
        return config;
    }
};

//.tmp_build/src/ui/toolbar-ele-list.js
/*!
 * toolbar元素列表定义
 */
_p[39] = {
    value: function(require) {
        var UI_ELE_TYPE = _p.r(45), BOX_TYPE = _p.r(44), CHAR_POSITION = _p.r(32), OTHER_POSITION = _p.r(37), kity = _p.r(22);
        var config = [ {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "预设<br/>",
                    className: "yushe-btn",
                    icon: {
                        src: "assets/images/toolbar/btn.png",
                        x: 0,
                        y: 0
                    },
                    iconSize: {
                        w: 40
                    }
                },
                box: {
                    width: 367,
                    group: [ {
                        title: "预设公式",
                        items: [ {
                            title: "预设公式",
                            content: [ {
                                label: "二次公式",
                                item: {
                                    val: "x=\\frac {-b\\pm\\sqrt {b^2-4ac}}{2a}"
                                }
                            }, {
                                label: "二项式定理",
                                item: {
                                    val: "{\\left(x+a\\right)}^2=\\sum^n_{k=0}{\\left(^n_k\\right)x^ka^{n-k}}"
                                }
                            }, {
                                label: "勾股定理",
                                item: {
                                    val: "a^2+b^2=c^2"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DELIMITER
        }, {
            type: UI_ELE_TYPE.AREA,
            options: {
                box: {
                    fixOffset: true,
                    width: 527,
                    type: BOX_TYPE.OVERLAP,
                    group: [ {
                        title: "基础数学",
                        items: []
                    }, {
                        title: "希腊字母",
                        items: []
                    }, {
                        title: "求反关系运算符",
                        items: []
                    }, {
                        title: "字母类符号",
                        items: []
                    }, {
                        title: "箭头",
                        items: []
                    }, {
                        title: "手写体",
                        items: []
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DELIMITER
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "分数<br/>",
                    icon: {
                        src: "assets/images/toolbar/btn.png",
                        x: 45,
                        y: 0
                    }
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "分数",
                        items: [ {
                            title: "分数",
                            content: [ {
                                item: {
                                    val: "\\frac \\placeholder\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "{\\placeholder/\\placeholder}"
                                }
                            } ]
                        }, {
                            title: "常用分数",
                            content: [ {
                                item: {
                                    val: "\\frac {dy}{dx}"
                                }
                            }, {
                                item: {
                                    val: "\\frac {\\Delta y}{\\Delta x}"
                                }
                            }, {
                                item: {
                                    val: "\\frac {\\delta y}{\\delta x}"
                                }
                            }, {
                                item: {
                                    val: "\\frac \\pi 2"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "上下标<br/>",
                    icon: {
                        src: "assets/images/toolbar/btn.png",
                        x: 82,
                        y: 0
                    }
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "上标和下标",
                        items: [ {
                            title: "上标和下标",
                            content: [ {
                                item: {
                                    val: "\\placeholder^\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\placeholder_\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\placeholder^\\placeholder_\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "{^\\placeholder_\\placeholder\\placeholder}"
                                }
                            } ]
                        }, {
                            title: "常用的上标和下标",
                            content: [ {
                                item: {
                                    val: "e^{-i\\omega t}"
                                }
                            }, {
                                item: {
                                    val: "x^2"
                                }
                            }, {
                                item: {
                                    val: "{}^n_1Y"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "根式<br/>",
                    icon: {
                        src: "assets/images/toolbar/btn.png",
                        x: 119,
                        y: 0
                    }
                },
                box: {
                    width: 342,
                    group: [ {
                        title: "根式",
                        items: [ {
                            title: "根式",
                            content: [ {
                                item: {
                                    val: "\\sqrt \\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\sqrt [\\placeholder] \\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\sqrt [2] \\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\sqrt [3] \\placeholder"
                                }
                            } ]
                        }, {
                            title: "常用根式",
                            content: [ {
                                item: {
                                    val: "\\frac {-b\\pm\\sqrt{b^2-4ac}}{2a}"
                                }
                            }, {
                                item: {
                                    val: "\\sqrt {a^2+b^2}"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "积分<br/>",
                    icon: {
                        src: "assets/images/toolbar/btn.png",
                        x: 156,
                        y: 0
                    }
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "积分",
                        items: [ {
                            title: "积分",
                            content: [ {
                                item: {
                                    val: "\\int \\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\int^\\placeholder_\\placeholder\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\iint\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\iint^\\placeholder_\\placeholder\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\iiint\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\iiint^\\placeholder_\\placeholder\\placeholder"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "大型<br/>运算符",
                    icon: {
                        src: "assets/images/toolbar/btn.png",
                        x: 193,
                        y: 0
                    }
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "求和",
                        items: [ {
                            title: "求和",
                            content: [ {
                                item: {
                                    val: "\\sum\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\sum^\\placeholder_\\placeholder\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\sum_\\placeholder\\placeholder"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "括号<br/>",
                    icon: {
                        src: "assets/images/toolbar/btn.png",
                        x: 230,
                        y: 0
                    }
                },
                box: {
                    width: 332,
                    group: [ {
                        title: "方括号",
                        items: [ {
                            title: "方括号",
                            content: [ {
                                item: {
                                    val: "\\left(\\placeholder\\right)"
                                }
                            }, {
                                item: {
                                    val: "\\left[\\placeholder\\right]"
                                }
                            }, {
                                item: {
                                    val: "\\left\\{\\placeholder\\right\\}"
                                }
                            }, {
                                item: {
                                    val: "\\left|\\placeholder\\right|"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        }, {
            type: UI_ELE_TYPE.DRAPDOWN_BOX,
            options: {
                button: {
                    label: "函数<br/>",
                    icon: {
                        src: "assets/images/toolbar/btn.png",
                        x: 267,
                        y: 0
                    }
                },
                box: {
                    width: 340,
                    group: [ {
                        title: "函数",
                        items: [ {
                            title: "三角函数",
                            content: [ {
                                item: {
                                    val: "\\sin\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\cos\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\tan\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\csc\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\sec\\placeholder"
                                }
                            }, {
                                item: {
                                    val: "\\cot\\placeholder"
                                }
                            } ]
                        }, {
                            title: "常用函数",
                            content: [ {
                                item: {
                                    val: "\\sin\\theta"
                                }
                            }, {
                                item: {
                                    val: "\\cos{2x}"
                                }
                            }, {
                                item: {
                                    val: "\\tan\\theta=\\frac {\\sin\\theta}{\\cos\\theta}"
                                }
                            } ]
                        } ]
                    } ]
                }
            }
        } ];
        //--------------------------------------------- 初始化特殊字符区域以外的配置项
        (function() {
            var tmp = [], otherImageSrc = "assets/images/toolbar/other.png", currentConf = [];
            kity.Utils.each(config, function(conf) {
                if (conf.type === UI_ELE_TYPE.DELIMITER) {
                    return;
                }
                conf = conf.options.box.group;
                tmp = tmp.concat(conf);
            });
            kity.Utils.each(tmp, function(conf) {
                conf = conf.items;
                for (var i = 0, len = conf.length; i < len; i++) {
                    currentConf = currentConf.concat(conf[i].content);
                }
            });
            // 添加定位信息
            kity.Utils.each(currentConf, function(conf) {
                var data = OTHER_POSITION[conf.item.val];
                if (!data) {
                    return;
                }
                conf.item.img = otherImageSrc;
                conf.item.pos = data.pos;
                conf.item.size = data.size;
            });
        })();
        //--------------------------------------------- 初始化特殊字符区域
        // 基础数学
        (function() {
            var list = [ "pm", "infty", "=", "sim", "times", "div", "!", "<", "ll", ">", "gg", "leq", "geq", "mp", "cong", "equiv", "propto", "approx", "forall", "partial", "surd", "cup", "cap", "varnothing", "%", "circ", "exists", "nexists", "in", "ni", "gets", "uparrow", "to", "downarrow", "leftrightarrow", "therefore", "because", "+", "-", "neg", "ast", "cdot", "vdots", /* "ddots",*/
            "aleph", "beth", "blacksquare" ], configList = config[2].options.box.group[0].items;
            configList.push({
                title: "基础数学",
                content: getIconContents(list, "assets/images/toolbar/char.png")
            });
        })();
        // 希腊字符配置
        (function() {
            var greekList = [ {
                title: "小写",
                values: [ "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega" ]
            }, {
                title: "大写",
                values: [ "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega" ]
            }, {
                title: "变体",
                values: [ "digamma", "varepsilon", "varkappa", "varphi", "varpi", "varrho", "varsigma", "vartheta" ]
            } ], greekConfigList = config[2].options.box.group[1].items;
            // 小写处理
            greekConfigList.push({
                title: greekList[0].title,
                content: getIconContents(greekList[0].values, "assets/images/toolbar/char.png")
            });
            // 大写处理
            greekConfigList.push({
                title: greekList[1].title,
                content: getIconContents(greekList[1].values, "assets/images/toolbar/char.png")
            });
            // 变体处理
            greekConfigList.push({
                title: greekList[2].title,
                content: getIconContents(greekList[2].values, "assets/images/toolbar/char.png")
            });
        })();
        // 求反运算符
        (function() {
            var greekList = [ {
                title: "求反关系运算符",
                values: [ "neq", "nless", "ngtr", "nleq", "ngeq", "nsim", "lneqq", "gneqq", "nprec", "nsucc", "notin", "nsubseteq", "nsupseteq", "subsetneq", "supsetneq", "lnsim", "gnsim", "precnsim", "succnsim", "ntriangleleft", "ntriangleright", "ntrianglelefteq", "ntrianglerighteq", "nmid", "nparallel", "nvdash", "nVdash", "nvDash", "nVDash", "nexists" ]
            } ], greekConfigList = config[2].options.box.group[2].items;
            greekConfigList.push({
                title: greekList[0].title,
                content: getIconContents(greekList[0].values, "assets/images/toolbar/char.png")
            });
        })();
        // 字母类符号
        (function() {
            var list = [ "aleph", "beth", "daleth", "gimel", "complement", "ell", "eth", "hbar", "hslash", "mho", "partial", "wp", "circledS", "Bbbk", "Finv", "Game", "Im", "Re" ], configList = config[2].options.box.group[3].items;
            configList.push({
                title: "字母类符号",
                content: getIconContents(list, "assets/images/toolbar/char.png")
            });
        })();
        // 化箭头
        (function() {
            var list = [ "gets", "to", "uparrow", "downarrow", "leftrightarrow", "updownarrow", "Leftarrow", "Rightarrow", "Uparrow", "Downarrow", "Leftrightarrow", "Updownarrow", "longleftarrow", "longrightarrow", "longleftrightarrow", "Longleftarrow", "Longrightarrow", "Longleftrightarrow", "nearrow", "nwarrow", "searrow", "swarrow", "nleftarrow", "nrightarrow", "nLeftarrow", "nRightarrow", "nLeftrightarrow", "leftharpoonup", "leftharpoondown", "rightharpoonup", "rightharpoondown", "upharpoonleft", "upharpoonright", "downharpoonleft", "downharpoonright", "leftrightharpoons", "rightleftharpoons", "leftleftarrows", "rightrightarrows", "upuparrows", "downdownarrows", "leftrightarrows", "rightleftarrows", "looparrowleft", "looparrowright", "leftarrowtail", "rightarrowtail", "Lsh", "Rsh", "Lleftarrow", "Rrightarrow", "curvearrowleft", "curvearrowright", "circlearrowleft", "circlearrowright", "multimap", "leftrightsquigarrow", "twoheadleftarrow", "twoheadrightarrow", "rightsquigarrow" ], configList = config[2].options.box.group[4].items;
            configList.push({
                title: "箭头",
                content: getIconContents(list, "assets/images/toolbar/char.png")
            });
        })();
        // 手写体
        (function() {
            var list = [ {
                title: "手写体",
                values: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ]
            }, {
                title: "花体",
                values: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ]
            }, {
                title: "双线",
                values: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ]
            }, {
                title: "罗马",
                values: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ]
            } ], configList = config[2].options.box.group[5].items;
            kity.Utils.each(list[0].values, function(item, index) {
                list[0].values[index] = "mathcal{" + item + "}";
            });
            kity.Utils.each(list[1].values, function(item, index) {
                list[1].values[index] = "mathfrak{" + item + "}";
            });
            kity.Utils.each(list[2].values, function(item, index) {
                list[2].values[index] = "mathbb{" + item + "}";
            });
            kity.Utils.each(list[3].values, function(item, index) {
                list[3].values[index] = "mathrm{" + item + "}";
            });
            // 手写体
            configList.push({
                title: list[0].title,
                content: getIconContents(list[0].values, "assets/images/toolbar/char.png")
            });
            configList.push({
                title: list[1].title,
                content: getIconContents(list[1].values, "assets/images/toolbar/char.png")
            });
            configList.push({
                title: list[2].title,
                content: getIconContents(list[2].values, "assets/images/toolbar/char.png")
            });
            configList.push({
                title: list[3].title,
                content: getIconContents(list[3].values, "assets/images/toolbar/char.png")
            });
        })();
        function getIconContents(keySet, imgSrc) {
            var result = [];
            kity.Utils.each(keySet, function(key) {
                if (key.length > 1) {
                    key = "\\" + key;
                }
                result.push({
                    key: key,
                    img: imgSrc,
                    pos: CHAR_POSITION[key]
                });
            });
            return result;
        }
        return config;
    }
};

//.tmp_build/src/ui/toolbar/toolbar.js
/*!
 * 工具条组件
 */
_p[40] = {
    value: function(require) {
        var kity = _p.r(22), UiImpl = _p.r(61), $$ = _p.r(60), UI_ELE_TYPE = _p.r(45), Tollbar = kity.createClass("Tollbar", {
            constructor: function constructor(uiComponent, kfEditor, elementList) {
                this.kfEditor = kfEditor;
                this.uiComponent = uiComponent;
                // 工具栏元素定义列表
                this.elementList = elementList;
                this.elements = [];
                this.initToolbarElements();
                this.initServices();
                this.initEvent();
            },
            initServices: function initServices() {
                this.kfEditor.registerService("ui.toolbar.disable", this, {
                    disableToolbar: this.disableToolbar
                });
                this.kfEditor.registerService("ui.toolbar.enable", this, {
                    enableToolbar: this.enableToolbar
                });
                this.kfEditor.registerService("ui.toolbar.close", this, {
                    closeToolbar: this.closeToolbar
                });
            },
            initEvent: function initEvent() {
                var _self = this;
                $$.on(this.uiComponent.toolbarContainer, "mousedown", function(e) {
                    e.preventDefault();
                });
                $$.on(this.uiComponent.toolbarContainer, "mousewheel", function(e) {
                    e.preventDefault();
                });
                // 通知所有组件关闭
                $$.on(this.kfEditor.getContainer(), "mousedown", function() {
                    _self.notify("closeAll");
                });
                // 订阅数据选择主题
                $$.subscribe("data.select", function(data) {
                    _self.insertSource(data);
                });
            },
            insertSource: function insertSource(val) {
                this.kfEditor.requestService("control.insert.string", val);
            },
            disableToolbar: function disableToolbar() {
                kity.Utils.each(this.elements, function(ele) {
                    ele.disable && ele.disable();
                });
            },
            enableToolbar: function enableToolbar() {
                kity.Utils.each(this.elements, function(ele) {
                    ele.enable && ele.enable();
                });
            },
            getContainer: function getContainer() {
                return this.kfEditor.requestService("ui.get.canvas.container");
            },
            closeToolbar: function closeToolbar() {
                this.closeElement();
            },
            // 接受到关闭通知
            notify: function notify(type) {
                switch (type) {
                  // 关闭所有组件
                    case "closeAll":
                  // 关闭其他组件
                    case "closeOther":
                    this.closeElement(arguments[1]);
                    return;
                }
            },
            closeElement: function closeElement(exception) {
                kity.Utils.each(this.elements, function(ele) {
                    if (ele != exception) {
                        ele.hide && ele.hide();
                    }
                });
            },
            initToolbarElements: function initToolbarElements() {
                var elements = this.elements, doc = this.uiComponent.toolbarContainer.ownerDocument, _self = this;
                kity.Utils.each(this.elementList, function(eleInfo, i) {
                    var ele = createElement(eleInfo.type, doc, eleInfo.options);
                    elements.push(ele);
                    _self.appendElement(ele);
                });
            },
            appendElement: function appendElement(uiElement) {
                uiElement.setToolbar(this);
                uiElement.attachTo(this.uiComponent.toolbarContainer);
            }
        });
        function createElement(type, doc, options) {
            switch (type) {
              case UI_ELE_TYPE.DRAPDOWN_BOX:
                return createDrapdownBox(doc, options);

              case UI_ELE_TYPE.DELIMITER:
                return createDelimiter(doc);

              case UI_ELE_TYPE.AREA:
                return createArea(doc, options);
            }
        }
        function createDrapdownBox(doc, options) {
            return new UiImpl.DrapdownBox(doc, options);
        }
        function createDelimiter(doc) {
            return new UiImpl.Delimiter(doc);
        }
        function createArea(doc, options) {
            return new UiImpl.Area(doc, options);
        }
        return Tollbar;
    }
};

//.tmp_build/src/ui/ui-impl/area.js
/*!
 * 特殊字符区域
 */
_p[41] = {
    value: function(require) {
        var kity = _p.r(22), PREFIX = "kf-editor-ui-", PANEL_HEIGHT = 66, // UiUitls
        $$ = _p.r(60), Box = _p.r(42), Area = kity.createClass("Area", {
            constructor: function constructor(doc, options) {
                this.options = options;
                this.doc = doc;
                this.toolbar = null;
                this.disabled = true;
                this.panelIndex = 0;
                this.maxPanelIndex = 0;
                this.currentItemCount = 0;
                this.lineMaxCount = 9;
                this.element = this.createArea();
                this.container = this.createContainer();
                this.panel = this.createPanel();
                this.buttonContainer = this.createButtonContainer();
                this.button = this.createButton();
                this.mountPoint = this.createMountPoint();
                this.moveDownButton = this.createMoveDownButton();
                this.moveUpButton = this.createMoveUpButton();
                this.boxObject = this.createBox();
                this.mergeElement();
                this.mount();
                this.setListener();
                this.initEvent();
            },
            initEvent: function initEvent() {
                var _self = this;
                $$.on(this.button, "mousedown", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.which !== 1 || _self.disabled) {
                        return;
                    }
                    _self.showMount();
                    _self.toolbar.notify("closeOther", _self);
                });
                $$.on(this.moveDownButton, "mousedown", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.which !== 1 || _self.disabled) {
                        return;
                    }
                    _self.nextPanel();
                    _self.toolbar.notify("closeOther", _self);
                });
                $$.on(this.moveUpButton, "mousedown", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.which !== 1 || _self.disabled) {
                        return;
                    }
                    _self.prevPanel();
                    _self.toolbar.notify("closeOther", _self);
                });
                $$.delegate(this.container, ".kf-editor-ui-area-item", "mousedown", function(e) {
                    e.preventDefault();
                    if (e.which !== 1 || _self.disabled) {
                        return;
                    }
                    $$.publish("data.select", this.getAttribute("data-value"));
                });
                this.boxObject.initEvent();
            },
            disable: function disable() {
                this.disabled = true;
                this.boxObject.disable();
                $$.getClassList(this.element).remove(PREFIX + "enabled");
            },
            enable: function enable() {
                this.disabled = false;
                this.boxObject.enable();
                $$.getClassList(this.element).add(PREFIX + "enabled");
            },
            setListener: function setListener() {
                var _self = this;
                this.boxObject.setSelectHandler(function(val) {
                    // 发布
                    $$.publish("data.select", val);
                    _self.hide();
                });
                // 内容面板切换
                this.boxObject.setChangeHandler(function(index) {
                    _self.updateContent();
                });
            },
            createArea: function createArea() {
                var areaNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "area"
                });
                if ("width" in this.options) {
                    areaNode.style.width = this.options.width + "px";
                }
                return areaNode;
            },
            checkMaxPanelIndex: function checkMaxPanelIndex() {
                this.maxPanelIndex = Math.ceil(this.currentItemCount / this.lineMaxCount / 2);
            },
            updateContent: function updateContent() {
                var items = this.boxObject.getOverlapContent(), count = 0, style = null, lineno = 0, colno = 0, lineMaxCount = this.lineMaxCount, newContent = [];
                // 清空原有内容
                this.panel.innerHTML = "";
                kity.Utils.each(items, function(item) {
                    var contents = item.content;
                    kity.Utils.each(contents, function(currentContent, index) {
                        lineno = Math.floor(count / lineMaxCount);
                        colno = count % lineMaxCount;
                        count++;
                        style = "top: " + (lineno * 33 + 5) + "px; left: " + (colno * 32 + 5) + "px;";
                        newContent.push('<div class="' + PREFIX + 'area-item" data-value="' + currentContent.key + '" style="' + style + '"><div class="' + PREFIX + 'area-item-inner"><div class="' + PREFIX + 'area-item-img" style="background: url(' + currentContent.img + ") no-repeat " + -currentContent.pos.x + "px " + -currentContent.pos.y + 'px;"></div></div></div>');
                    });
                });
                this.currentItemCount = count;
                this.panelIndex = 0;
                this.panel.style.top = 0;
                this.panel.innerHTML = newContent.join("");
                this.checkMaxPanelIndex();
                this.updatePanelButtonState();
            },
            // 挂载
            mount: function mount() {
                this.boxObject.mountTo(this.mountPoint);
            },
            showMount: function showMount() {
                this.mountPoint.style.display = "block";
                this.boxObject.updateSize();
            },
            hideMount: function hideMount() {
                this.mountPoint.style.display = "none";
            },
            hide: function hide() {
                this.hideMount();
                this.boxObject.hide();
            },
            createButton: function createButton() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "area-button"
                });
            },
            createMoveDownButton: function createMoveDownButton() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "movedown-button",
                    content: ""
                });
            },
            createMoveUpButton: function createMoveUpButton() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "moveup-button",
                    content: ""
                });
            },
            createMountPoint: function createMountPoint() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "area-mount"
                });
            },
            createBox: function createBox() {
                return new Box(this.doc, this.options.box);
            },
            createContainer: function createContainer() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "area-container"
                });
            },
            createPanel: function createPanel() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "area-panel"
                });
            },
            createButtonContainer: function createButtonContainer() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "area-button-container"
                });
            },
            mergeElement: function mergeElement() {
                this.buttonContainer.appendChild(this.moveUpButton);
                this.buttonContainer.appendChild(this.moveDownButton);
                this.buttonContainer.appendChild(this.button);
                this.container.appendChild(this.panel);
                this.element.appendChild(this.container);
                this.element.appendChild(this.buttonContainer);
                this.element.appendChild(this.mountPoint);
            },
            disablePanelUp: function disablePanelUp() {
                this.disabledUp = true;
                $$.getClassList(this.moveUpButton).add("kf-editor-ui-disabled");
            },
            enablePanelUp: function enablePanelUp() {
                this.disabledUp = false;
                $$.getClassList(this.moveUpButton).remove("kf-editor-ui-disabled");
            },
            disablePanelDown: function disablePanelDown() {
                this.disabledDown = true;
                $$.getClassList(this.moveDownButton).add("kf-editor-ui-disabled");
            },
            enablePanelDown: function enablePanelDown() {
                this.disabledDown = false;
                $$.getClassList(this.moveDownButton).remove("kf-editor-ui-disabled");
            },
            updatePanelButtonState: function updatePanelButtonState() {
                if (this.panelIndex === 0) {
                    this.disablePanelUp();
                } else {
                    this.enablePanelUp();
                }
                if (this.panelIndex + 1 >= this.maxPanelIndex) {
                    this.disablePanelDown();
                } else {
                    this.enablePanelDown();
                }
            },
            nextPanel: function nextPanel() {
                if (this.disabledDown) {
                    return;
                }
                if (this.panelIndex + 1 >= this.maxPanelIndex) {
                    return;
                }
                this.panelIndex++;
                this.panel.style.top = -this.panelIndex * PANEL_HEIGHT + "px";
                this.updatePanelButtonState();
            },
            prevPanel: function prevPanel() {
                if (this.disabledUp) {
                    return;
                }
                if (this.panelIndex === 0) {
                    return;
                }
                this.panelIndex--;
                this.panel.style.top = -this.panelIndex * PANEL_HEIGHT + "px";
                this.updatePanelButtonState();
            },
            setToolbar: function setToolbar(toolbar) {
                this.toolbar = toolbar;
                this.boxObject.setToolbar(toolbar);
            },
            attachTo: function attachTo(container) {
                container.appendChild(this.element);
                this.updateContent();
                this.updatePanelButtonState();
            }
        });
        return Area;
    }
};

//.tmp_build/src/ui/ui-impl/box.js
/**
 * Created by hn on 14-3-31.
 */
_p[42] = {
    value: function(require) {
        var kity = _p.r(22), PREFIX = "kf-editor-ui-", // UiUitls
        $$ = _p.r(60), BOX_TYPE = _p.r(44), ITEM_TYPE = _p.r(46), Button = _p.r(43), List = _p.r(58), SCROLL_STEP = 20, Box = kity.createClass("Box", {
            constructor: function constructor(doc, options) {
                this.options = options;
                this.toolbar = null;
                this.options.type = this.options.type || BOX_TYPE.DETACHED;
                this.doc = doc;
                this.itemPanels = null;
                this.overlapButtonObject = null;
                this.overlapIndex = -1;
                this.element = this.createBox();
                this.groupContainer = this.createGroupContainer();
                this.itemGroups = this.createItemGroup();
                this.mergeElement();
            },
            createBox: function createBox() {
                var boxNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "box"
                });
                if ("width" in this.options) {
                    boxNode.style.width = this.options.width + "px";
                }
                return boxNode;
            },
            setToolbar: function setToolbar(toolbar) {
                this.toolbar = toolbar;
                if (this.overlapButtonObject) {
                    this.overlapButtonObject.setToolbar(toolbar);
                }
            },
            updateSize: function updateSize() {
                var containerBox = $$.getRectBox(this.toolbar.getContainer()), diff = 30, curBox = $$.getRectBox(this.element);
                if (this.options.type === BOX_TYPE.DETACHED) {
                    if (curBox.bottom <= containerBox.bottom) {
                        this.element.scrollTop = 0;
                        return;
                    }
                    this.element.style.height = curBox.height - (curBox.bottom - containerBox.bottom + diff) + "px";
                } else {
                    var panel = this.getCurrentItemPanel(), panelRect = null;
                    panel.scrollTop = 0;
                    if (curBox.bottom <= containerBox.bottom) {
                        return;
                    }
                    panelRect = getRectBox(panel);
                    panel.style.height = containerBox.bottom - panelRect.top - diff + "px";
                }
            },
            initEvent: function initEvent() {
                var className = "." + PREFIX + "box-item", _self = this;
                $$.delegate(this.groupContainer, className, "mousedown", function(e) {
                    e.preventDefault();
                    if (e.which !== 1) {
                        return;
                    }
                    _self.onselectHandler && _self.onselectHandler(this.getAttribute("data-value"));
                });
                $$.on(this.element, "mousedown", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                $$.on(this.element, "mousewheel", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _self.scroll(e.originalEvent.wheelDelta);
                });
            },
            getNode: function getNode() {
                return this.element;
            },
            setSelectHandler: function setSelectHandler(onselectHandler) {
                this.onselectHandler = onselectHandler;
            },
            scroll: function scroll(delta) {
                // down
                if (delta < 0) {
                    this.scrollDown();
                } else {
                    this.scrollUp();
                    this.element.scrollTop -= 20;
                }
            },
            scrollDown: function scrollDown() {
                if (this.options.type === BOX_TYPE.DETACHED) {
                    this.element.scrollTop += SCROLL_STEP;
                } else {
                    this.getCurrentItemPanel().scrollTop += SCROLL_STEP;
                }
            },
            scrollUp: function scrollUp() {
                if (this.options.type === BOX_TYPE.DETACHED) {
                    this.element.scrollTop -= SCROLL_STEP;
                } else {
                    this.getCurrentItemPanel().scrollTop -= SCROLL_STEP;
                }
            },
            setChangeHandler: function setChangeHandler(changeHandler) {
                this.onchangeHandler = changeHandler;
            },
            onchangeHandler: function onchangeHandler(index) {},
            createGroupContainer: function createGroupContainer() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "box-container"
                });
            },
            getPositionInfo: function getPositionInfo() {
                return $$.getRectBox(this.element);
            },
            createItemGroup: function createItemGroup() {
                var itemGroup = this.createGroup();
                switch (this.options.type) {
                  case BOX_TYPE.DETACHED:
                    return itemGroup.items[0];

                  case BOX_TYPE.OVERLAP:
                    return this.createOverlapGroup(itemGroup);
                }
                return null;
            },
            enable: function enable() {
                if (this.overlapButtonObject) {
                    this.overlapButtonObject.enable();
                }
            },
            disable: function disable() {
                if (this.overlapButtonObject) {
                    this.overlapButtonObject.disable();
                }
            },
            hide: function hide() {
                this.overlapButtonObject && this.overlapButtonObject.hideMount();
            },
            getOverlapContent: function getOverlapContent() {
                // 只有重叠式才可以获取重叠内容
                if (this.options.type !== BOX_TYPE.OVERLAP) {
                    return null;
                }
                return this.options.group[this.overlapIndex].items;
            },
            createOverlapGroup: function createOverlapGroup(itemGroup) {
                var classifyList = itemGroup.title, _self = this, overlapContainer = createOverlapContainer(this.doc), overlapButtonObject = createOverlapButton(this.doc, {
                    fixOffset: this.options.fixOffset
                }), overlapListObject = createOverlapList(this.doc, {
                    width: 150,
                    items: classifyList
                }), wrapNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "wrap-group"
                });
                this.overlapButtonObject = overlapButtonObject;
                // 组合选择组件
                overlapButtonObject.mount(overlapListObject);
                overlapButtonObject.initEvent();
                overlapListObject.initEvent();
                // 合并box的内容
                kity.Utils.each(itemGroup.items, function(itemArr, index) {
                    var itemWrapNode = wrapNode.cloneNode(false);
                    kity.Utils.each(itemArr, function(item) {
                        itemWrapNode.appendChild(item);
                    });
                    itemGroup.items[index] = itemWrapNode;
                });
                this.itemPanels = itemGroup.items;
                // 切换面板处理器
                overlapListObject.setSelectHandler(function(index, oldIndex) {
                    _self.overlapIndex = index;
                    overlapButtonObject.setLabel(classifyList[index]);
                    overlapButtonObject.hideMount();
                    // 切换内容
                    itemGroup.items[oldIndex].style.display = "none";
                    itemGroup.items[index].style.display = "block";
                    if (index !== oldIndex) {
                        _self.updateSize();
                    }
                    _self.onchangeHandler(index);
                });
                overlapContainer.appendChild(overlapButtonObject.getNode());
                kity.Utils.each(itemGroup.items, function(group, index) {
                    if (index > 0) {
                        group.style.display = "none";
                    }
                    overlapContainer.appendChild(group);
                });
                overlapListObject.select(0);
                return [ overlapContainer ];
            },
            getCurrentItemPanel: function getCurrentItemPanel() {
                return this.itemPanels[this.overlapIndex];
            },
            // 获取group的list列表, 该类表满足box的group参数格式
            getGroupList: function getGroupList() {
                var lists = [];
                kity.Utils.each(this.options.group, function(group, index) {
                    lists.push(group.title);
                });
                return {
                    width: 150,
                    items: lists
                };
            },
            createGroup: function createGroup() {
                var doc = this.doc, itemGroup = [], result = {
                    title: [],
                    items: []
                }, groupNode = null, groupTitle = null, itemType = BOX_TYPE.DETACHED === this.options.type ? ITEM_TYPE.BIG : ITEM_TYPE.SMALL, itemContainer = null;
                groupNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "box-group"
                });
                itemContainer = groupNode.cloneNode(false);
                itemContainer.className = PREFIX + "box-group-item-container";
                kity.Utils.each(this.options.group, function(group, i) {
                    result.title.push(group.title || "");
                    itemGroup = [];
                    kity.Utils.each(group.items, function(item) {
                        groupNode = groupNode.cloneNode(false);
                        itemContainer = itemContainer.cloneNode(false);
                        groupTitle = $$.ele(doc, "div", {
                            className: PREFIX + "box-group-title",
                            content: item.title
                        });
                        groupNode.appendChild(groupTitle);
                        groupNode.appendChild(itemContainer);
                        kity.Utils.each(createItems(doc, item.content, itemType), function(boxItem) {
                            boxItem.appendTo(itemContainer);
                        });
                        itemGroup.push(groupNode);
                    });
                    result.items.push(itemGroup);
                });
                return result;
            },
            mergeElement: function mergeElement() {
                var groupContainer = this.groupContainer;
                this.element.appendChild(groupContainer);
                kity.Utils.each(this.itemGroups, function(group) {
                    groupContainer.appendChild(group);
                });
            },
            mountTo: function mountTo(container) {
                container.appendChild(this.element);
            },
            appendTo: function appendTo(container) {
                container.appendChild(this.element);
            }
        }), BoxItem = kity.createClass("BoxItem", {
            constructor: function constructor(type, doc, options) {
                this.type = type;
                this.doc = doc;
                this.options = options;
                this.element = this.createItem();
                // 项的label是可选的
                this.labelNode = this.createLabel();
                this.contentNode = this.createContent();
                this.mergeElement();
            },
            getNode: function getNode() {
                return this.element;
            },
            createItem: function createItem() {
                var itemNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "box-item"
                });
                return itemNode;
            },
            createLabel: function createLabel() {
                var labelNode = null;
                if (!("label" in this.options)) {
                    return;
                }
                labelNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "box-item-label",
                    content: this.options.label
                });
                return labelNode;
            },
            getContent: function getContent() {},
            createContent: function createContent() {
                switch (this.type) {
                  case ITEM_TYPE.BIG:
                    return this.createBigContent();

                  case ITEM_TYPE.SMALL:
                    return this.createSmallContent();
                }
            },
            createBigContent: function createBigContent() {
                var doc = this.doc, contentNode = $$.ele(doc, "div", {
                    className: PREFIX + "box-item-content"
                }), cls = PREFIX + "box-item-val", tmpContent = this.options.item, tmpNode = null, styleStr = getStyleByData(tmpContent);
                tmpNode = $$.ele(doc, "div", {
                    className: cls
                });
                tmpNode.innerHTML = '<div class="' + PREFIX + 'item-image" style="' + styleStr + '"></div>';
                // 附加属性到项的根节点上
                this.element.setAttribute("data-value", tmpContent.val);
                contentNode.appendChild(tmpNode);
                return contentNode;
            },
            createSmallContent: function createSmallContent() {
                var doc = this.doc, contentNode = $$.ele(doc, "div", {
                    className: PREFIX + "box-item-content"
                }), cls = PREFIX + "box-item-val", tmpContent = this.options, tmpNode = null;
                tmpNode = $$.ele(doc, "div", {
                    className: cls
                });
                tmpNode.style.background = "url( " + tmpContent.img + " )";
                tmpNode.style.backgroundPosition = -tmpContent.pos.x + "px " + -tmpContent.pos.y + "px";
                // 附加属性到项的根节点上
                this.element.setAttribute("data-value", tmpContent.key);
                contentNode.appendChild(tmpNode);
                return contentNode;
            },
            mergeElement: function mergeElement() {
                if (this.labelNode) {
                    this.element.appendChild(this.labelNode);
                }
                this.element.appendChild(this.contentNode);
            },
            appendTo: function appendTo(container) {
                container.appendChild(this.element);
            }
        });
        function createItems(doc, group, type) {
            var items = [];
            kity.Utils.each(group, function(itemVal, i) {
                items.push(new BoxItem(type, doc, itemVal));
            });
            return items;
        }
        // 为重叠式box创建容器
        function createOverlapContainer(doc) {
            return $$.ele(doc, "div", {
                className: PREFIX + "overlap-container"
            });
        }
        function createOverlapButton(doc, options) {
            return new Button(doc, {
                className: "overlap-button",
                label: "",
                fixOffset: options.fixOffset
            });
        }
        function createOverlapList(doc, list) {
            return new List(doc, list);
        }
        function getRectBox(node) {
            return node.getBoundingClientRect();
        }
        function getStyleByData(data) {
            // background
            var style = "background: url( " + data.img + " ) no-repeat ";
            style += -data.pos.x + "px ";
            style += -data.pos.y + "px;";
            // width height
            style += " width: " + data.size.width + "px;";
            style += " height: " + data.size.height + "px;";
            return style;
        }
        return Box;
    }
};

//.tmp_build/src/ui/ui-impl/button.js
/**
 * Created by hn on 14-3-31.
 */
_p[43] = {
    value: function(require) {
        var kity = _p.r(22), PREFIX = "kf-editor-ui-", LIST_OFFSET = 7, DEFAULT_OPTIONS = {
            iconSize: {
                w: 32,
                h: 32
            }
        }, // UiUitls
        $$ = _p.r(60), Button = kity.createClass("Button", {
            constructor: function constructor(doc, options) {
                this.options = kity.Utils.extend({}, DEFAULT_OPTIONS, options);
                // 事件状态， 是否已经初始化
                this.eventState = false;
                this.toolbar = null;
                this.displayState = false;
                this.fixOffset = options.fixOffset || false;
                this.doc = doc;
                this.element = this.createButton();
                this.disabled = true;
                // 挂载的对象
                this.mountElement = null;
                this.icon = this.createIcon();
                this.label = this.createLabel();
                this.sign = this.createSign();
                this.mountPoint = this.createMountPoint();
                this.mergeElement();
            },
            initEvent: function initEvent() {
                var _self = this;
                if (this.eventState) {
                    return;
                }
                this.eventState = true;
                $$.on(this.element, "mousedown", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.which !== 1) {
                        return;
                    }
                    if (_self.disabled) {
                        return;
                    }
                    _self.toggleSelect();
                    _self.toggleMountElement();
                });
            },
            setToolbar: function setToolbar(toolbar) {
                this.toolbar = toolbar;
            },
            toggleMountElement: function toggleMountElement() {
                if (this.displayState) {
                    this.hideMount();
                } else {
                    this.showMount();
                }
            },
            setLabel: function setLabel(labelText) {
                var signText = "";
                if (this.sign) {
                    signText = '<div class="' + PREFIX + 'button-sign"></div>';
                }
                this.label.innerHTML = labelText + signText;
            },
            toggleSelect: function toggleSelect() {
                $$.getClassList(this.element).toggle(PREFIX + "button-in");
            },
            unselect: function unselect() {
                $$.getClassList(this.element).remove(PREFIX + "button-in");
            },
            select: function select() {
                $$.getClassList(this.element).add(PREFIX + "button-in");
            },
            show: function show() {
                this.select();
                this.showMount();
            },
            hide: function hide() {
                this.unselect();
                this.hideMount();
            },
            showMount: function showMount() {
                this.displayState = true;
                this.mountPoint.style.display = "block";
                if (this.fixOffset) {
                    var elementRect = this.element.getBoundingClientRect();
                    this.mountElement.setOffset(elementRect.left + LIST_OFFSET, elementRect.bottom);
                }
                var editorContainer = this.toolbar.getContainer(), currentBox = null, containerBox = $$.getRectBox(editorContainer), mountEleBox = this.mountElement.getPositionInfo();
                // 修正偏移
                if (mountEleBox.right > containerBox.right) {
                    currentBox = $$.getRectBox(this.element);
                    // 对齐到按钮的右边界
                    this.mountPoint.style.left = currentBox.right - mountEleBox.right - 1 + "px";
                }
                this.mountElement.updateSize && this.mountElement.updateSize();
            },
            hideMount: function hideMount() {
                this.displayState = false;
                this.mountPoint.style.display = "none";
            },
            getNode: function getNode() {
                return this.element;
            },
            mount: function mount(element) {
                this.mountElement = element;
                element.mountTo(this.mountPoint);
            },
            createButton: function createButton() {
                var buttonNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "button"
                });
                // 附加className
                if (this.options.className) {
                    buttonNode.className += " " + PREFIX + this.options.className;
                }
                return buttonNode;
            },
            createIcon: function createIcon() {
                if (!this.options.icon) {
                    return null;
                }
                var iconNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "button-icon"
                });
                if (typeof this.options.icon === "string") {
                    iconNode.style.backgroundImage = "url(" + this.options.icon + ") no-repeat";
                } else {
                    iconNode.style.background = getBackgroundStyle(this.options.icon);
                }
                if (this.options.iconSize.w) {
                    iconNode.style.width = this.options.iconSize.w + "px";
                }
                if (this.options.iconSize.h) {
                    iconNode.style.height = this.options.iconSize.h + "px";
                }
                return iconNode;
            },
            createLabel: function createLabel() {
                var labelNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "button-label",
                    content: this.options.label
                });
                return labelNode;
            },
            createSign: function createSign() {
                if (this.options.sign === false) {
                    return null;
                }
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "button-sign"
                });
            },
            createMountPoint: function createMountPoint() {
                return $$.ele(this.doc, "div", {
                    className: PREFIX + "button-mount-point"
                });
            },
            disable: function disable() {
                this.disabled = true;
                $$.getClassList(this.element).remove(PREFIX + "enabled");
            },
            enable: function enable() {
                this.disabled = false;
                $$.getClassList(this.element).add(PREFIX + "enabled");
            },
            mergeElement: function mergeElement() {
                this.icon && this.element.appendChild(this.icon);
                this.element.appendChild(this.label);
                this.sign && this.label.appendChild(this.sign);
                this.element.appendChild(this.mountPoint);
            }
        });
        function getBackgroundStyle(data) {
            var style = "url( " + data.src + " ) no-repeat ";
            style += -data.x + "px ";
            style += -data.y + "px";
            return style;
        }
        return Button;
    }
};

//.tmp_build/src/ui/ui-impl/def/box-type.js
/*!
 * box类型定义
 */
_p[44] = {
    value: function(require) {
        return {
            // 分离式
            DETACHED: 1,
            // 重叠式
            OVERLAP: 2
        };
    }
};

//.tmp_build/src/ui/ui-impl/def/ele-type.js
/*!
 * toolbar元素类型定义
 */
_p[45] = {
    value: function(require) {
        return {
            DRAPDOWN_BOX: 1,
            AREA: 2,
            DELIMITER: 3,
            KEYBOARD: 4
        };
    }
};

//.tmp_build/src/ui/ui-impl/def/item-type.js
/*!
 * 组元素类型定义
 */
_p[46] = {
    value: function(require) {
        return {
            BIG: 1,
            SMALL: 2
        };
    }
};

//.tmp_build/src/ui/ui-impl/delimiter.js
/*!
 * 分割符
 */
_p[47] = {
    value: function(require) {
        var kity = _p.r(22), PREFIX = "kf-editor-ui-", // UiUitls
        $$ = _p.r(60), Delimiter = kity.createClass("Delimiter", {
            constructor: function constructor(doc) {
                this.doc = doc;
                this.element = this.createDilimiter();
            },
            setToolbar: function setToolbar(toolbar) {},
            createDilimiter: function createDilimiter() {
                var dilimiterNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "delimiter"
                });
                dilimiterNode.appendChild($$.ele(this.doc, "div", {
                    className: PREFIX + "delimiter-line"
                }));
                return dilimiterNode;
            },
            attachTo: function attachTo(container) {
                container.appendChild(this.element);
            }
        });
        return Delimiter;
    }
};

//.tmp_build/src/ui/ui-impl/drapdown-box.js
/**
 * Created by hn on 14-3-31.
 */
_p[48] = {
    value: function(require) {
        var kity = _p.r(22), // UiUitls
        $$ = _p.r(60), Button = _p.r(43), Box = _p.r(42), DrapdownBox = kity.createClass("DrapdownBox", {
            constructor: function constructor(doc, options) {
                this.options = options;
                this.toolbar = null;
                this.doc = doc;
                this.buttonElement = this.createButton();
                this.element = this.buttonElement.getNode();
                this.boxElement = this.createBox();
                this.buttonElement.mount(this.boxElement);
                this.initEvent();
            },
            initEvent: function initEvent() {
                var _self = this;
                // 通知工具栏互斥
                $$.on(this.element, "mousedown", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _self.toolbar.notify("closeOther", _self);
                });
                this.buttonElement.initEvent();
                this.boxElement.initEvent();
                this.boxElement.setSelectHandler(function(val) {
                    // 发布
                    $$.publish("data.select", val);
                    _self.buttonElement.hide();
                });
            },
            disable: function disable() {
                this.buttonElement.disable();
            },
            enable: function enable() {
                this.buttonElement.enable();
            },
            setToolbar: function setToolbar(toolbar) {
                this.toolbar = toolbar;
                this.buttonElement.setToolbar(toolbar);
                this.boxElement.setToolbar(toolbar);
            },
            createButton: function createButton() {
                return new Button(this.doc, this.options.button);
            },
            show: function show() {
                this.buttonElement.show();
            },
            hide: function hide() {
                this.buttonElement.hide();
            },
            createBox: function createBox() {
                return new Box(this.doc, this.options.box);
            },
            attachTo: function attachTo(container) {
                container.appendChild(this.element);
            }
        });
        return DrapdownBox;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/const.js
/*
 * @Author: Demian
 * @Date: 2020-04-16 19:03:59
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-16 19:04:38
 */
/*
 * @Author: Demian
 * @Date: 2020-04-15 10:11:11
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-16 19:02:30
 */
_p[49] = {
    value: function(require) {
        var Constant = {
            Type: {
                Common: "common",
                Algebra: "algebra",
                Geometry: "geometry",
                Unit: "unit",
                Other: "other"
            }
        };
        return Constant;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/footer/index.js
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
_p[50] = {
    value: function(require) {
        var kity = _p.r(22);
        var $$ = _p.r(60);
        var Footer = kity.createClass("Footer", {
            constructor: function constructor(parentNode, parentProps) {
                this.parentNode = parentNode;
                this.props = parentProps;
                this.prefix = parentProps.prefix + "keyboard-footer";
                this.state = {};
                this.containerClassName = this.prefix;
                this.itemClassName = "".concat(this.prefix, "-button");
                this.cancelClassName = "".concat(this.itemClassName, "-cancel");
                this.submitClassName = "".concat(this.itemClassName, "-submit");
                this._onSubmit = this._onSubmit.bind(this);
                this._onCancel = this._onCancel.bind(this);
            },
            _render: function _render() {
                return $$.ele(this.props.doc, "div", {
                    className: this.containerClassName,
                    content: '\n          <div id="'.concat(this.cancelClassName, '">\n            <span>取消</span>\n          </div>\n          <div id="').concat(this.submitClassName, '">\n            <span>确定</span>\n          </div>\n        ')
                });
            },
            mount: function mount() {
                var node = this._render();
                $$.delegate(this.parentNode, "#".concat(this.cancelClassName), "click", this._onCancel);
                $$.delegate(this.parentNode, "#".concat(this.submitClassName), "click", this._onSubmit);
                this.parentNode.appendChild(node);
            },
            _onCancel: function _onCancel(e) {
                console.log("cancel");
                this.props.onCancel();
            },
            _onSubmit: function _onSubmit(e) {
                console.log("submit");
                this.props.onSubmit();
            }
        });
        return Footer;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/keyboard.js
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

/*!
 * 特殊字符区域
 */
_p[51] = {
    value: function(require) {
        var kity = _p.r(22), PREFIX = "kf-editor-ui-", // UiUitls
        $$ = _p.r(60), Menu = _p.r(52), Panel = _p.r(55), Page = _p.r(53), Constant = _p.r(49), PcPanelConstant = _p.r(56), AndroidPanelConstant = _p.r(54), Footer = _p.r(50), Keyboard = kity.createClass("Keyboard", {
            constructor: function constructor(doc, kfEditor) {
                var _this$typeEnum;
                this.doc = doc;
                this.kfEditor = kfEditor;
                this.pageSize = this.getDeviceType() === "android" ? 32 : 40;
                this.panelConstant = this.getConstant();
                this.typeEnum = (_this$typeEnum = {}, _defineProperty(_this$typeEnum, Constant.Type.Common, 0), 
                _defineProperty(_this$typeEnum, Constant.Type.Algebra, 1), _defineProperty(_this$typeEnum, Constant.Type.Geometry, 2), 
                _defineProperty(_this$typeEnum, Constant.Type.Other, 3), _defineProperty(_this$typeEnum, 0, Constant.Type.Common), 
                _defineProperty(_this$typeEnum, 1, Constant.Type.Algebra), _defineProperty(_this$typeEnum, 2, Constant.Type.Geometry), 
                _defineProperty(_this$typeEnum, 3, Constant.Type.Other), _this$typeEnum);
                this.state = {
                    type: Constant.Type.Common,
                    page: 0,
                    totalPage: this.getTotalPage(this.panelConstant[0].items.length)
                };
                this.element = this.render();
                // 完成组件渲染
                this.menuChild = new Menu(this.element, {
                    type: this.state.type,
                    prefix: PREFIX,
                    doc: this.doc,
                    onClick: this.onMenuClick.bind(this)
                });
                this.panelChild = new Panel(this.element, {
                    type: this.state.type,
                    page: this.state.page,
                    prefix: PREFIX,
                    doc: this.doc,
                    panelConstant: this.panelConstant,
                    scrollHeight: this.getDeviceType() === "android" ? 595 : 320,
                    onClick: this.onPanelClick.bind(this)
                });
                this.pageChild = new Page(this.element, {
                    type: this.state.type,
                    page: this.state.page,
                    totalPage: this.state.totalPage,
                    prefix: PREFIX,
                    doc: this.doc,
                    onPrevPage: this.onPrevPage.bind(this),
                    onNextPage: this.onNextPage.bind(this),
                    onDelete: this.onDelete.bind(this),
                    onSubmit: this.onSubmit.bind(this)
                });
                this.footerChild = new Footer(this.element, {
                    prefix: PREFIX,
                    doc: this.doc,
                    onSubmit: this.onSubmit.bind(this),
                    onCancel: this.onCancel.bind(this)
                });
                this.renderKeyboard();
            },
            renderKeyboard: function renderKeyboard() {
                this.menuChild.mount();
                this.panelChild.mount();
                this.pageChild.mount();
                this.footerChild.mount();
            },
            onMenuClick: function onMenuClick(val) {
                var charCollection = this.panelConstant.find(function(x) {
                    return x.type === val;
                }) || {};
                var len = charCollection.items ? charCollection.items.length : 0;
                this.setState({
                    type: val,
                    page: 0,
                    totalPage: this.getTotalPage(len)
                });
            },
            onPanelClick: function onPanelClick(val) {
                $$.publish("panel.select", val);
            },
            onPrevPage: function onPrevPage() {
                var _this$state = this.state, page = _this$state.page, type = _this$state.type;
                // 如果已到第一页，则自动切换至上一个模式，若已到最顶部模式，则禁止翻页
                if (page === 0 && type === Constant.Type.Common) {
                    return;
                }
                if (page === 0) {
                    this._prevMode(type);
                    return;
                }
                this.setState({
                    page: page - 1
                });
            },
            onNextPage: function onNextPage() {
                var _this$state2 = this.state, page = _this$state2.page, type = _this$state2.type, totalPage = _this$state2.totalPage;
                // 如果已到最后一页，则自动切换至下一个模式，若已到最底部模式，则禁止翻页
                if (page === totalPage - 1 && type === Constant.Type.Other) {
                    return;
                }
                if (page === totalPage - 1) {
                    this._nextMode(type);
                    return;
                }
                this.setState({
                    page: page + 1
                });
            },
            onDelete: function onDelete() {
                this.kfEditor.requestService("control.delete.string");
            },
            onSubmit: function onSubmit() {
                var _this = this;
                this.kfEditor.execCommand("get.image.data", function(data) {
                    var formula = _this.kfEditor.execCommand("get.source");
                    _this.kfEditor.eclassWebService.send({
                        type: "common.setFormula",
                        data: {
                            body: {
                                formulaSrc: data.img,
                                formula: formula
                            }
                        }
                    });
                });
            },
            onCancel: function onCancel() {
                this.kfEditor.eclassWebService.send({
                    type: "common.closeModal"
                });
            },
            render: function render() {
                var keyboardNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "keyboard"
                });
                return keyboardNode;
            },
            setState: function setState(nextState) {
                this.state = _objectSpread({}, this.state, {}, nextState);
                this.menuChild.update(this.state);
                this.panelChild.update(this.state);
                this.pageChild.update(this.state);
            },
            getTotalPage: function getTotalPage(len) {
                return Math.ceil(len / this.pageSize) || 1;
            },
            getDeviceType: function getDeviceType() {
                return this.kfEditor.options.ui.device;
            },
            getConstant: function getConstant() {
                var deviceType = this.getDeviceType();
                switch (deviceType) {
                  case "android":
                    return AndroidPanelConstant;

                  case "pc":
                    return PcPanelConstant;
                }
            },
            attachTo: function attachTo(container) {
                container.appendChild(this.element);
            },
            _prevMode: function _prevMode(curType) {
                var prevType = this.typeEnum[this.typeEnum[curType] - 1];
                var charCollection = this.panelConstant.find(function(x) {
                    return x.type === prevType;
                }) || {};
                var len = charCollection.items ? charCollection.items.length : 0;
                this.setState({
                    type: prevType,
                    page: 0,
                    totalPage: this.getTotalPage(len)
                });
                return;
            },
            _nextMode: function _nextMode(curType) {
                var nextType = this.typeEnum[this.typeEnum[curType] + 1];
                var charCollection = this.panelConstant.find(function(x) {
                    return x.type === nextType;
                }) || {};
                var len = charCollection.items ? charCollection.items.length : 0;
                this.setState({
                    type: nextType,
                    page: 0,
                    totalPage: this.getTotalPage(len)
                });
                return;
            }
        });
        return Keyboard;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/menu/index.js
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

/*
 * @Author: Demian
 * @Date: 2020-04-16 16:11:27
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-23 17:25:07
 */
_p[52] = {
    value: function(require) {
        var kity = _p.r(22);
        var $$ = _p.r(60);
        var Constant = _p.r(49);
        var Menu = kity.createClass("Menu", {
            constructor: function constructor(parentNode, parentProps) {
                this.parentNode = parentNode;
                this.props = parentProps;
                this.prefix = parentProps.prefix + "keyboard-menu";
                this.elementList = [ {
                    type: Constant.Type.Common,
                    title: "常用",
                    index: 0
                }, {
                    type: Constant.Type.Algebra,
                    title: "代数",
                    index: 1
                }, {
                    type: Constant.Type.Geometry,
                    title: "几何",
                    index: 2
                }, {
                    type: Constant.Type.Other,
                    title: "其他",
                    index: 3
                } ];
                this.state = {
                    type: Constant.Type.Common
                };
                this.containerClassName = this.prefix;
                this.listClassName = "".concat(this.prefix, "-list");
                this.itemClassName = "".concat(this.prefix, "-list-item");
                this._onClick = this._onClick.bind(this);
            },
            _render: function _render() {
                var _this = this;
                console.log("menu render");
                return $$.ele(this.props.doc, "div", {
                    className: this.containerClassName,
                    content: '\n          <ul id="'.concat(this.prefix, '" class="').concat(this.listClassName, '">\n            ').concat(this.elementList.map(function(x) {
                        return '<li class="'.concat(_this.itemClassName, " ").concat(isActive.call(_this, x.type) ? _this.itemClassName + "-active" : "", '" data-value="').concat(x.type, '">').concat(x.title, "</li>");
                    }).join(""), "\n          </ul>\n        ")
                });
                function isActive(type) {
                    return type === this.state.type;
                }
            },
            mount: function mount() {
                var node = this._render();
                $$.delegate(this.parentNode, "." + this.itemClassName, "click", this._onClick);
                this.parentNode.appendChild(node);
            },
            destroy: function destroy() {
                $(this.parentNode).find(this.prefix).remove();
            },
            update: function update(nextProps) {
                var _this2 = this;
                if (!this._shouldUpdate(nextProps)) return;
                Object.keys(nextProps).filter(function(x) {
                    return x in _this2.props;
                }).forEach(function(x) {
                    return _this2._setState(_defineProperty({}, x, nextProps[x]));
                });
                var node = this._render();
                $("." + this.prefix).html(node);
            },
            _shouldUpdate: function _shouldUpdate(nextProps) {
                var _this3 = this;
                var isSame = Object.keys(this.state).every(function(x) {
                    return nextProps[x] === _this3.state[x];
                });
                if (isSame) {
                    return false;
                }
                return true;
            },
            _onClick: function _onClick(e) {
                var val = e.target.dataset.value;
                this.props.onClick(val);
            },
            _setState: function _setState(nextState) {
                this.state = _objectSpread({}, this.state, {}, nextState);
            }
        });
        return Menu;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/page/index.js
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

/*
 * @Author: Demian
 * @Date: 2020-04-16 20:03:47
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-26 18:06:01
 */
_p[53] = {
    value: function(require) {
        var kity = _p.r(22);
        var $$ = _p.r(60);
        var Page = kity.createClass("Page", {
            constructor: function constructor(parentNode, parentProps) {
                this.parentNode = parentNode;
                this.props = parentProps;
                this.prefix = parentProps.prefix + "keyboard-page";
                this.elementList = [ {
                    type: "prev",
                    title: "上一页",
                    index: 0
                }, {
                    type: "next",
                    title: "下一页",
                    index: 1
                } ];
                this.state = {
                    type: this.props.type,
                    page: this.props.page,
                    totalPage: this.props.totalPage
                };
                this.containerClassName = this.prefix;
                this.listClassName = "".concat(this.prefix, "-list");
                this.itemClassName = "".concat(this.prefix, "-list-item");
                this._onClick = this._onClick.bind(this);
            },
            _render: function _render() {
                var _this = this;
                console.log("page render");
                return $$.ele(this.props.doc, "div", {
                    className: this.containerClassName,
                    content: '\n          <ul id="'.concat(this.prefix, '" class="').concat(this.listClassName, '">\n            <li class="').concat(this.itemClassName, " ").concat(this.itemClassName, '-delete" data-value="delete"></li>\n            ').concat(this.elementList.map(function(x) {
                        return '<li class="'.concat(_this.itemClassName, " ").concat(_this.itemClassName, "-").concat(x.type, " ").concat(isDisabled.call(_this, x.type) ? _this.itemClassName + "-disabled" : "", '" data-value="').concat(x.type, '"></li>');
                    }).join(""), '\n            <li class="').concat(this.itemClassName, " ").concat(this.itemClassName, '-ok" data-value="submit">完成</li>\n          </ul>\n        ')
                });
                function isDisabled(type) {
                    if (type === "prev") {
                        return this.state.page === 0 && this.state.type === "common";
                    } else if (type === "next") {
                        return this.state.page === this.state.totalPage - 1 && this.state.type === "other";
                    }
                }
            },
            mount: function mount() {
                var node = this._render();
                $$.delegate(this.parentNode, "." + this.itemClassName, "click", this._onClick);
                this.parentNode.appendChild(node);
            },
            update: function update(nextProps) {
                var _this2 = this;
                if (!this._shouldUpdate(nextProps)) return;
                Object.keys(nextProps).filter(function(x) {
                    return x in _this2.state;
                }).forEach(function(x) {
                    return _this2._setState(_defineProperty({}, x, nextProps[x]));
                });
                var node = this._render();
                $("." + this.prefix).html(node);
            },
            _shouldUpdate: function _shouldUpdate(nextProps) {
                var _this3 = this;
                var isSame = Object.keys(this.state).every(function(x) {
                    return nextProps[x] === _this3.state[x];
                });
                if (isSame) {
                    return false;
                }
                return true;
            },
            _onClick: function _onClick(e) {
                var val = e.target.dataset.value;
                switch (val) {
                  case "next":
                    this.props.onNextPage();
                    break;

                  case "prev":
                    this.props.onPrevPage();
                    break;

                  case "delete":
                    this.props.onDelete();
                    break;

                  case "submit":
                    this.props.onSubmit();
                    break;
                }
            },
            _setState: function _setState(nextState) {
                this.state = _objectSpread({}, this.state, {}, nextState);
            }
        });
        return Page;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/panel/androidConst.js
/*
 * @Author: Demian
 * @Date: 2020-04-22 18:00:32
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-29 10:38:59
 */
_p[54] = {
    value: function(require) {
        var kity = _p.r(22), CHAR_POSITION = _p.r(57), Constant = [ {
            type: "common",
            title: "常用",
            index: 0,
            items: []
        }, {
            type: "algebra",
            title: "代数",
            index: 1,
            items: []
        }, {
            type: "geometry",
            title: "几何",
            index: 2,
            items: []
        }, {
            type: "unit",
            title: "单位",
            index: 3,
            items: []
        }, {
            type: "other",
            title: "其他",
            index: 4,
            items: []
        } ];
        // ----------------------------取雪碧图icon
        // 常用
        (function() {
            var list = [ "<", "\\frac \\placeholder\\placeholder", "\\sqrt \\placeholder", "a", "+", "7", "8", "9", ">", "\\left|\\placeholder\\right|", "\\placeholder^2", "b", "-", "4", "5", "6", "\\leq", "\\left(\\placeholder\\right)", "\\sqrt [3] \\placeholder", "x", "\\pm", "1", "2", "3", "\\geq", "%", "\\placeholder^3", "y", ",", "0", ".", "=" ];
            Constant[0].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/161651900dba4c429c386fa19bf501bb");
        })();
        // 代数
        (function() {
            var list = [ "\\times", "\\div", "\\approx", "\\neq", "\\sqrt [\\placeholder] \\placeholder", "\\pi", "\\sigma", "\\left[\\placeholder\\right]", "\\placeholder^\\placeholder", "\\placeholder_\\placeholder", "{^\\placeholder_\\placeholder\\placeholder}", "\\placeholder^\\placeholder_\\placeholder", "\\sum\\placeholder", "\\sum_\\placeholder\\placeholder", "\\sum^\\placeholder_\\placeholder\\placeholder", "\\int \\placeholder", "\\int^\\placeholder_\\placeholder\\placeholder", "\\iint\\placeholder", "\\iint^\\placeholder_\\placeholder\\placeholder", "\\iiint\\placeholder", "\\iiint^\\placeholder_\\placeholder\\placeholder", "\\log\\placeholder", "\\ln\\placeholder", "\\land", "\\lor", "\\neg", "\\forall", "\\exists", "\\infty", "\\cup", "\\cap", "\\in", "\\notin", "\\subset", "\\subseteq", "\\supset", "\\supseteq", "\\varnothing" ];
            Constant[1].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/161651900dba4c429c386fa19bf501bb");
        })();
        // 几何
        (function() {
            var list = [ "\\sin\\placeholder", "\\cos\\placeholder", "\\tan\\placeholder", "\\sec\\placeholder", "\\csc\\placeholder", "\\cot\\placeholder", "\\arcsin\\placeholder", "\\arccos\\placeholder", "\\arctan\\placeholder", "\\triangle", "\\sim", "\\cong", "\\angle", "\\bot", "\\alpha", "\\beta", "\\gamma", "\\theta" ];
            Constant[2].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/161651900dba4c429c386fa19bf501bb");
        })();
        // 单位
        (function() {
            var list = [];
            Constant[3].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/161651900dba4c429c386fa19bf501bb");
        })();
        // 其他
        (function() {
            var list = [ "\\Omega", "\\because", "\\therefore", "\\Longrightarrow", "\\Leftrightarrow", "\\uparrow", "\\downarrow", "\\lambda", "\\kappa", "\\mu", "\\rho", "\\sigma", "\\tau", "\\upsilon", "\\varphi", "\\Psi", "\\omega", "\\varepsilon", "\\zeta", "\\eta", "\\nu", "\\xi", "\\chi" ];
            Constant[4].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/161651900dba4c429c386fa19bf501bb");
        })();
        function getIconContents(keySet, imgSrc) {
            var result = [];
            kity.Utils.each(keySet, function(key) {
                var point = CHAR_POSITION[key] || {
                    x: 0,
                    y: 0
                };
                var pos = {
                    x: point.x * 172,
                    y: point.y * 146 + 26
                };
                result.push({
                    key: key,
                    img: imgSrc,
                    pos: pos
                });
            });
            return result;
        }
        return Constant;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/panel/index.js
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

/*
 * @Author: Demian
 * @Date: 2020-04-16 18:52:57
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-27 21:04:59
 */
_p[55] = {
    value: function(require) {
        var kity = _p.r(22);
        var $$ = _p.r(60);
        var Panel = kity.createClass("Panel", {
            constructor: function constructor(parentNode, parentProps) {
                this.parentNode = parentNode;
                this.props = parentProps;
                this.prefix = parentProps.prefix + "keyboard-panel";
                this.scrollHeight = parentProps.scrollHeight;
                // 初始化状态
                this.state = {
                    type: this.props.type,
                    page: this.props.page
                };
                this.containerClassName = this.prefix;
                this.listClassName = "".concat(this.prefix, "-list");
                this.itemClassName = "".concat(this.prefix, "-list-item");
                this._onClick = this._onClick.bind(this);
            },
            _render: function _render() {
                var _this = this;
                console.log("panel render");
                var list = this.props.panelConstant.find(function(x) {
                    return x.type === _this.state.type;
                }).items || [];
                var table = list.reduce(function(acc, cur, index) {
                    var row = Math.floor(index / 8);
                    var col = Math.floor(index % 8);
                    if (!acc[row]) acc[row] = [];
                    acc[row][col] = cur;
                    return acc;
                }, []);
                return $$.ele(this.props.doc, "div", {
                    className: this.containerClassName,
                    content: '\n        <table id="'.concat(this.listClassName, '" class="').concat(this.listClassName, '" style="top: -').concat(this.state.page * this.scrollHeight, 'px" cellspacing="0" cellpadding="0">\n          ').concat(table.map(function(row) {
                        return "<tr>" + row.map(function(x) {
                            return "<td class='".concat(_this.itemClassName, "' style=\"background-image: url(").concat(x.img, ");background-position: ").concat(-x.pos.x, "px ").concat(-x.pos.y, 'px" data-value="').concat(x.key, '" />');
                        }).join("") + "</tr>";
                    }).join(""), "\n        </table>\n      ")
                });
            },
            mount: function mount() {
                var node = this._render();
                $$.delegate(this.parentNode, "." + this.itemClassName, "click", this._onClick);
                this.parentNode.appendChild(node);
            },
            update: function update(nextProps) {
                var _this2 = this;
                if (!this._shouldUpdate(nextProps)) return;
                if (this._justPageChange(nextProps)) return;
                Object.keys(nextProps).filter(function(x) {
                    return x in _this2.state;
                }).forEach(function(x) {
                    return _this2._setState(_defineProperty({}, x, nextProps[x]));
                });
                var node = this._render();
                $("." + this.prefix).html(node);
            },
            _shouldUpdate: function _shouldUpdate(nextProps) {
                var _this3 = this;
                var isSame = Object.keys(this.state).every(function(x) {
                    return nextProps[x] === _this3.state[x];
                });
                if (isSame) {
                    return false;
                }
                return true;
            },
            _justPageChange: function _justPageChange(nextProps) {
                var _this4 = this;
                var justPageChange = Object.keys(this.state).filter(function(k) {
                    return k !== "page";
                }).every(function(v) {
                    return _this4.state[v] === nextProps[v];
                });
                console.log(justPageChange, this.state, nextProps);
                if (justPageChange) {
                    $("#" + this.listClassName).css("top", -nextProps.page * this.scrollHeight + "px");
                    this._setState({
                        page: nextProps.page
                    });
                }
                return justPageChange;
            },
            _onClick: function _onClick(e) {
                var val = e.target.dataset.value;
                this.props.onClick(val);
            },
            _setState: function _setState(nextState) {
                this.state = _objectSpread({}, this.state, {}, nextState);
            }
        });
        return Panel;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/panel/pcConst.js
/*
 * @Author: Demian
 * @Date: 2020-04-15 10:11:11
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-29 10:37:10
 */
_p[56] = {
    value: function(require) {
        var kity = _p.r(22), CHAR_POSITION = _p.r(57), Constant = [ {
            type: "common",
            title: "常用",
            index: 0,
            items: []
        }, {
            type: "algebra",
            title: "代数",
            index: 1,
            items: []
        }, {
            type: "geometry",
            title: "几何",
            index: 2,
            items: []
        }, {
            type: "unit",
            title: "单位",
            index: 3,
            items: []
        }, {
            type: "other",
            title: "其他",
            index: 4,
            items: []
        } ];
        // ----------------------------取雪碧图icon
        // 常用
        (function() {
            var list = [ "<", "\\frac \\placeholder\\placeholder", "\\sqrt \\placeholder", "a", "+", "7", "8", "9", ">", "\\left|\\placeholder\\right|", "\\placeholder^2", "b", "-", "4", "5", "6", "\\leq", "\\left(\\placeholder\\right)", "\\sqrt [3] \\placeholder", "x", "\\pm", "1", "2", "3", "\\geq", "%", "\\placeholder^3", "y", ",", "0", ".", "=" ];
            Constant[0].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/a974c7f278ac4d2fa484b33f80435180");
        })();
        // 代数
        (function() {
            var list = [ "\\times", "\\div", "\\approx", "\\neq", "\\sqrt [\\placeholder] \\placeholder", "\\pi", "\\sigma", "\\left[\\placeholder\\right]", "\\placeholder^\\placeholder", "\\placeholder_\\placeholder", "{^\\placeholder_\\placeholder\\placeholder}", "\\placeholder^\\placeholder_\\placeholder", "\\sum\\placeholder", "\\sum_\\placeholder\\placeholder", "\\sum^\\placeholder_\\placeholder\\placeholder", "\\int \\placeholder", "\\int^\\placeholder_\\placeholder\\placeholder", "\\iint\\placeholder", "\\iint^\\placeholder_\\placeholder\\placeholder", "\\iiint\\placeholder", "\\iiint^\\placeholder_\\placeholder\\placeholder", "\\log\\placeholder", "\\ln\\placeholder", "\\land", "\\lor", "\\neg", "\\forall", "\\exists", "\\infty", "\\cup", "\\cap", "\\in", "\\notin", "\\subset", "\\subseteq", "\\supset", "\\supseteq", "\\varnothing" ];
            Constant[1].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/a974c7f278ac4d2fa484b33f80435180");
        })();
        // 几何
        (function() {
            var list = [ "\\sin\\placeholder", "\\cos\\placeholder", "\\tan\\placeholder", "\\sec\\placeholder", "\\csc\\placeholder", "\\cot\\placeholder", "\\arcsin\\placeholder", "\\arccos\\placeholder", "\\arctan\\placeholder", "\\triangle", "\\sim", "\\cong", "\\angle", "\\bot", "\\alpha", "\\beta", "\\gamma", "\\theta" ];
            Constant[2].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/a974c7f278ac4d2fa484b33f80435180");
        })();
        // 单位
        (function() {
            var list = [];
            Constant[3].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/a974c7f278ac4d2fa484b33f80435180");
        })();
        // 其他
        (function() {
            var list = [ "\\Omega", "\\because", "\\therefore", "\\Longrightarrow", "\\Leftrightarrow", "\\uparrow", "\\downarrow", "\\lambda", "\\kappa", "\\mu", "\\rho", "\\sigma", "\\tau", "\\upsilon", "\\varphi", "\\Psi", "\\omega", "\\varepsilon", "\\zeta", "\\eta", "\\nu", "\\xi", "\\chi" ];
            Constant[4].items = getIconContents(list, "https://store-g1.seewo.com/easiclass-public/a974c7f278ac4d2fa484b33f80435180");
        })();
        function getIconContents(keySet, imgSrc) {
            var result = [];
            kity.Utils.each(keySet, function(key) {
                var point = CHAR_POSITION[key] || {
                    x: 0,
                    y: 0
                };
                var pos = {
                    x: point.x * 83,
                    y: point.y * 65
                };
                result.push({
                    key: key,
                    img: imgSrc,
                    pos: pos
                });
            });
            return result;
        }
        return Constant;
    }
};

//.tmp_build/src/ui/ui-impl/keyboard/panel/position.data.js
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

/*
 * @Author: Demian
 * @Date: 2020-04-22 14:54:26
 * @LastEditor: Demian
 * @LastEditTime: 2020-04-26 10:24:49
 */
_p[57] = {
    value: function() {
        var _ref;
        return _ref = {
            "<": {
                x: 0,
                y: 0
            },
            "\\frac \\placeholder\\placeholder": {
                x: 1,
                y: 0
            },
            "\\sqrt \\placeholder": {
                x: 2,
                y: 0
            },
            a: {
                x: 3,
                y: 0
            },
            "+": {
                x: 4,
                y: 0
            },
            "7": {
                x: 5,
                y: 0
            },
            "8": {
                x: 6,
                y: 0
            },
            "9": {
                x: 7,
                y: 0
            },
            ">": {
                x: 0,
                y: 1
            },
            "\\left|\\placeholder\\right|": {
                x: 1,
                y: 1
            },
            "\\placeholder^2": {
                x: 2,
                y: 1
            },
            b: {
                x: 3,
                y: 1
            },
            "-": {
                x: 4,
                y: 1
            },
            "4": {
                x: 5,
                y: 1
            },
            "5": {
                x: 6,
                y: 1
            },
            "6": {
                x: 7,
                y: 1
            },
            "\\leq": {
                x: 0,
                y: 2
            },
            "\\left(\\placeholder\\right)": {
                x: 1,
                y: 2
            },
            "\\sqrt [3] \\placeholder": {
                x: 2,
                y: 2
            },
            x: {
                x: 3,
                y: 2
            },
            "\\pm": {
                x: 4,
                y: 2
            },
            "1": {
                x: 5,
                y: 2
            },
            "2": {
                x: 6,
                y: 2
            },
            "3": {
                x: 7,
                y: 2
            },
            "\\geq": {
                x: 0,
                y: 3
            },
            "%": {
                x: 1,
                y: 3
            },
            "\\placeholder^3": {
                x: 2,
                y: 3
            },
            y: {
                x: 3,
                y: 3
            },
            ",": {
                x: 4,
                y: 3
            },
            "0": {
                x: 5,
                y: 3
            },
            ".": {
                x: 6,
                y: 3
            },
            "=": {
                x: 7,
                y: 3
            },
            "\\times": {
                x: 0,
                y: 4
            },
            "\\div": {
                x: 1,
                y: 4
            },
            "\\approx": {
                x: 2,
                y: 4
            },
            "\\neq": {
                x: 3,
                y: 4
            },
            "\\sqrt [\\placeholder] \\placeholder": {
                x: 4,
                y: 4
            },
            "\\pi": {
                x: 5,
                y: 4
            },
            "\\sigma": {
                x: 6,
                y: 4
            },
            "\\left[\\placeholder\\right]": {
                x: 7,
                y: 4
            },
            "\\placeholder^\\placeholder": {
                x: 0,
                y: 5
            },
            "\\placeholder_\\placeholder": {
                x: 1,
                y: 5
            },
            "{^\\placeholder_\\placeholder\\placeholder}": {
                x: 2,
                y: 5
            },
            "\\placeholder^\\placeholder_\\placeholder": {
                x: 3,
                y: 5
            },
            "\\sum\\placeholder": {
                x: 4,
                y: 5
            },
            "\\sum_\\placeholder\\placeholder": {
                x: 5,
                y: 5
            },
            "\\sum^\\placeholder_\\placeholder\\placeholder": {
                x: 6,
                y: 5
            },
            "\\int \\placeholder": {
                x: 7,
                y: 5
            },
            "\\int^\\placeholder_\\placeholder\\placeholder": {
                x: 0,
                y: 6
            },
            "\\iint\\placeholder": {
                x: 1,
                y: 6
            },
            "\\iint^\\placeholder_\\placeholder\\placeholder": {
                x: 2,
                y: 6
            },
            "\\iiint\\placeholder": {
                x: 3,
                y: 6
            },
            "\\iiint^\\placeholder_\\placeholder\\placeholder": {
                x: 4,
                y: 6
            },
            "\\log\\placeholder": {
                x: 5,
                y: 6
            },
            "\\ln\\placeholder": {
                x: 6,
                y: 6
            },
            "\\land": {
                x: 7,
                y: 6
            },
            "\\lor": {
                x: 0,
                y: 7
            },
            "\\neg": {
                x: 1,
                y: 7
            },
            "\\forall": {
                x: 2,
                y: 7
            },
            "\\exists": {
                x: 3,
                y: 7
            },
            "\\infty": {
                x: 4,
                y: 7
            },
            "\\cup": {
                x: 5,
                y: 7
            },
            "\\cap": {
                x: 6,
                y: 7
            },
            "\\in": {
                x: 7,
                y: 7
            },
            "\\notin": {
                x: 0,
                y: 8
            },
            "\\subset": {
                x: 1,
                y: 8
            },
            "\\subseteq": {
                x: 2,
                y: 8
            },
            "\\supset": {
                x: 3,
                y: 8
            },
            "\\supseteq": {
                x: 4,
                y: 8
            },
            "\\varnothing": {
                x: 5,
                y: 8
            },
            "\\sin\\placeholder": {
                x: 0,
                y: 9
            },
            "\\cos\\placeholder": {
                x: 1,
                y: 9
            },
            "\\tan\\placeholder": {
                x: 2,
                y: 9
            },
            "\\sec\\placeholder": {
                x: 3,
                y: 9
            },
            "\\csc\\placeholder": {
                x: 4,
                y: 9
            },
            "\\cot\\placeholder": {
                x: 5,
                y: 9
            },
            "\\arcsin\\placeholder": {
                x: 6,
                y: 9
            },
            "\\arccos\\placeholder": {
                x: 7,
                y: 9
            },
            "\\arctan\\placeholder": {
                x: 0,
                y: 10
            },
            "\\triangle": {
                x: 1,
                y: 10
            },
            "\\sim": {
                x: 2,
                y: 10
            },
            "\\cong": {
                x: 3,
                y: 10
            },
            "\\angle": {
                x: 4,
                y: 10
            },
            "\\bot": {
                x: 5,
                y: 10
            },
            "\\alpha": {
                x: 6,
                y: 10
            },
            "\\beta": {
                x: 7,
                y: 10
            },
            "\\gamma": {
                x: 0,
                y: 11
            },
            "\\theta": {
                x: 1,
                y: 11
            },
            "\\Omega": {
                x: 0,
                y: 12
            },
            "\\because": {
                x: 1,
                y: 12
            },
            "\\therefore": {
                x: 2,
                y: 12
            },
            "\\Longrightarrow": {
                x: 3,
                y: 12
            },
            "\\Leftrightarrow": {
                x: 4,
                y: 12
            },
            "\\uparrow": {
                x: 5,
                y: 12
            },
            "\\downarrow": {
                x: 6,
                y: 12
            },
            "\\lambda": {
                x: 7,
                y: 12
            },
            "\\kappa": {
                x: 0,
                y: 13
            },
            "\\mu": {
                x: 1,
                y: 13
            },
            "\\rho": {
                x: 2,
                y: 13
            }
        }, _defineProperty(_ref, "\\sigma", {
            x: 3,
            y: 13
        }), _defineProperty(_ref, "\\tau", {
            x: 4,
            y: 13
        }), _defineProperty(_ref, "\\upsilon", {
            x: 5,
            y: 13
        }), _defineProperty(_ref, "\\varphi", {
            x: 6,
            y: 13
        }), _defineProperty(_ref, "\\Psi", {
            x: 7,
            y: 13
        }), _defineProperty(_ref, "\\omega", {
            x: 0,
            y: 14
        }), _defineProperty(_ref, "\\varepsilon", {
            x: 1,
            y: 14
        }), _defineProperty(_ref, "\\zeta", {
            x: 2,
            y: 14
        }), _defineProperty(_ref, "\\eta", {
            x: 3,
            y: 14
        }), _defineProperty(_ref, "\\nu", {
            x: 4,
            y: 14
        }), _defineProperty(_ref, "\\xi", {
            x: 5,
            y: 14
        }), _defineProperty(_ref, "\\chi", {
            x: 6,
            y: 14
        }), _ref;
    }
};

//.tmp_build/src/ui/ui-impl/list.js
/**
 * Created by hn on 14-3-31.
 */
_p[58] = {
    value: function(require) {
        var kity = _p.r(22), PREFIX = "kf-editor-ui-", // UiUitls
        $$ = _p.r(60), List = kity.createClass("List", {
            constructor: function constructor(doc, options) {
                this.options = options;
                this.doc = doc;
                this.onselectHandler = null;
                this.currentSelect = -1;
                this.element = this.createBox();
                this.itemGroups = this.createItems();
                this.mergeElement();
            },
            // 预定义的方法留空
            onselectHandler: function onselectHandler(index, oldIndex) {},
            setSelectHandler: function setSelectHandler(selectHandler) {
                this.onselectHandler = selectHandler;
            },
            createBox: function createBox() {
                var boxNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "list"
                }), // 创建背景
                bgNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "list-bg"
                });
                if ("width" in this.options) {
                    boxNode.style.width = this.options.width + "px";
                }
                boxNode.appendChild(bgNode);
                return boxNode;
            },
            select: function select(index) {
                var oldSelect = this.currentSelect;
                if (oldSelect === -1) {
                    oldSelect = index;
                }
                this.unselect(oldSelect);
                this.currentSelect = index;
                $$.getClassList(this.itemGroups.items[index]).add(PREFIX + "list-item-select");
                this.onselectHandler(index, oldSelect);
            },
            unselect: function unselect(index) {
                $$.getClassList(this.itemGroups.items[index]).remove(PREFIX + "list-item-select");
            },
            setOffset: function setOffset(x, y) {
                this.element.style.left = x + "px";
                this.element.style.top = y + "px";
            },
            initEvent: function initEvent() {
                var className = "." + PREFIX + "list-item", _self = this;
                $$.delegate(this.itemGroups.container, className, "mousedown", function(e) {
                    e.preventDefault();
                    if (e.which !== 1) {
                        return;
                    }
                    _self.select(this.getAttribute("data-index"));
                });
                $$.on(this.element, "mousedown", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
            },
            getPositionInfo: function getPositionInfo() {
                return $$.getRectBox(this.element);
            },
            createItems: function createItems() {
                var doc = this.doc, groupNode = null, itemNode = null, iconNode = null, items = [], itemContainer = null;
                groupNode = $$.ele(this.doc, "div", {
                    className: PREFIX + "list-item"
                });
                itemContainer = groupNode.cloneNode(false);
                itemContainer.className = PREFIX + "list-item-container";
                kity.Utils.each(this.options.items, function(itemText, i) {
                    itemNode = groupNode.cloneNode(false);
                    iconNode = groupNode.cloneNode(false);
                    iconNode.className = PREFIX + "list-item-icon";
                    itemNode.appendChild(iconNode);
                    itemNode.appendChild($$.ele(doc, "text", itemText));
                    itemNode.setAttribute("data-index", i);
                    items.push(itemNode);
                    itemContainer.appendChild(itemNode);
                });
                return {
                    container: itemContainer,
                    items: items
                };
            },
            mergeElement: function mergeElement() {
                this.element.appendChild(this.itemGroups.container);
            },
            mountTo: function mountTo(container) {
                container.appendChild(this.element);
            }
        });
        return List;
    }
};

//.tmp_build/src/ui/ui-impl/scrollbar/scrollbar.js
/*!
 * 滚动条组件
 */
_p[59] = {
    value: function(require) {
        var kity = _p.r(22), SCROLLBAR_DEF = _p.r(34).scrollbar, SCROLLBAR_CONF = _p.r(31).scrollbar, Utils = _p.r(4), CLASS_PREFIX = "kf-editor-ui-";
        return kity.createClass("Scrollbar", {
            constructor: function constructor(uiComponent, kfEditor) {
                this.uiComponent = uiComponent;
                this.kfEditor = kfEditor;
                this.widgets = null;
                this.container = this.uiComponent.scrollbarContainer;
                this.canvasContainer = this.uiComponent.canvasContainer;
                // 显示状态
                this.state = false;
                // 滚动条当前各个状态下的值
                this.values = {
                    // 滚动条此时实际的偏移值, 计算的时候假定滑块的宽度为0
                    offset: 0,
                    // 滑块此时偏移位置所占轨道的比例, 计算的时候假定滑块的宽度为0
                    left: 0,
                    // 滚动条控制的容器的可见宽度
                    viewWidth: 0,
                    // 滚动条对应的内容实际宽度
                    contentWidth: 0,
                    // 轨道长度
                    trackWidth: 0,
                    // 滑块宽度
                    thumbWidth: 0,
                    // 可滚动的宽度
                    scrollWidth: 0,
                    // 画板的宽度
                    canvasWidth: 0,
                    // 滚动条父容器的宽度
                    viewBoxWidth: 0
                };
                // 滑块的物理偏移， 不同于values.offset
                this.thumbLocationX = 0;
                // 左溢出长度
                this.leftOverflow = 0;
                // 右溢出长度
                this.rightOverflow = 0;
                // 记录本次和上一次改变内容之间宽度是否变大
                this.isExpand = true;
                this.initWidget();
                this.mountWidget();
                this.initSize();
                this.hide();
                this.initServices();
                this.initEvent();
                this.updateHandler = function() {};
            },
            initWidget: function initWidget() {
                var doc = this.container.ownerDocument;
                this.widgets = {
                    leftButton: createElement(doc, "div", "left-button"),
                    rightButton: createElement(doc, "div", "right-button"),
                    track: createElement(doc, "div", "track"),
                    thumb: createElement(doc, "div", "thumb"),
                    thumbBody: createElement(doc, "div", "thumb-body")
                };
            },
            initSize: function initSize() {
                var leftBtnWidth = getRect(this.widgets.leftButton).width, rightBtnWidth = getRect(this.widgets.rightButton).width;
                this.values.canvasWidth = getRect(this.canvasContainer).width;
                this.values.viewWidth = this.values.canvasWidth;
                this.values.viewBoxWidth = getRect(this.container).width;
                this.values.trackWidth = this.values.viewBoxWidth - leftBtnWidth - rightBtnWidth;
                this.widgets.track.style.width = this.values.trackWidth + "px";
            },
            initServices: function initServices() {
                this.kfEditor.registerService("ui.show.scrollbar", this, {
                    showScrollbar: this.show
                });
                this.kfEditor.registerService("ui.hide.scrollbar", this, {
                    hideScrollbar: this.hide
                });
                this.kfEditor.registerService("ui.update.scrollbar", this, {
                    updateScrollbar: this.update
                });
                this.kfEditor.registerService("ui.set.scrollbar.update.handler", this, {
                    setUpdateHandler: this.setUpdateHandler
                });
                this.kfEditor.registerService("ui.relocation.scrollbar", this, {
                    relocation: this.relocation
                });
            },
            initEvent: function initEvent() {
                preventDefault(this);
                trackClick(this);
                thumbHandler(this);
                btnClick(this);
            },
            mountWidget: function mountWidget() {
                var widgets = this.widgets, container = this.container;
                for (var wgtName in widgets) {
                    if (widgets.hasOwnProperty(wgtName)) {
                        container.appendChild(widgets[wgtName]);
                    }
                }
                widgets.thumb.appendChild(widgets.thumbBody);
                widgets.track.appendChild(widgets.thumb);
            },
            show: function show() {
                this.state = true;
                this.container.style.display = "block";
            },
            hide: function hide() {
                this.state = false;
                this.container.style.display = "none";
            },
            update: function update(contentWidth) {
                var trackWidth = this.values.trackWidth, canvasWidth = this.values.canvasWidth, thumbWidth = 0;
                this.isExpand = contentWidth > this.values.contentWidth;
                this.values.contentWidth = contentWidth;
                this.values.scrollWidth = contentWidth - this.values.viewWidth;
                if (this.values.viewWidth >= contentWidth) {
                    this.hide();
                    return;
                }
                thumbWidth = Math.max(Math.ceil(trackWidth * trackWidth / contentWidth), SCROLLBAR_DEF.thumbMinSize);
                this.values.thumbWidth = thumbWidth;
                this.widgets.thumb.style.width = thumbWidth + "px";
                this.widgets.thumbBody.style.width = thumbWidth - 10 + "px";
            },
            setUpdateHandler: function setUpdateHandler(updateHandler) {
                this.updateHandler = updateHandler;
            },
            updateOffset: function updateOffset(offset) {
                var values = this.values;
                values.offset = offset;
                values.left = offset / values.trackWidth;
                this.leftOverflow = values.left * (values.contentWidth - values.viewWidth);
                this.rightOverflow = values.contentWidth - values.viewWidth - this.leftOverflow;
                this.updateHandler(values.left, values.offset, values);
            },
            relocation: function relocation() {
                var cursorLocation = this.kfEditor.requestService("control.get.cursor.location"), padding = SCROLLBAR_CONF.padding, contentWidth = this.values.contentWidth, viewWidth = this.values.viewWidth, // 视图左溢出长度
                viewLeftOverflow = this.values.left * (contentWidth - viewWidth), diff = 0;
                if (cursorLocation.x < viewLeftOverflow) {
                    if (cursorLocation.x < 0) {
                        cursorLocation.x = 0;
                    }
                    setThumbOffsetByViewOffset(this, cursorLocation.x);
                } else if (cursorLocation.x + padding > viewLeftOverflow + viewWidth) {
                    cursorLocation.x += padding;
                    if (cursorLocation.x > contentWidth) {
                        cursorLocation.x = contentWidth;
                    }
                    diff = cursorLocation.x - viewWidth;
                    setThumbOffsetByViewOffset(this, diff);
                } else {
                    if (this.isExpand) {
                        // 根据上一次左溢出值设置滑块位置
                        setThumbByLeftOverflow(this, this.leftOverflow);
                    } else {
                        // 减少左溢出
                        setThumbByLeftOverflow(this, contentWidth - viewWidth - this.rightOverflow);
                    }
                }
            }
        });
        function createElement(doc, eleName, className) {
            var node = doc.createElement(eleName), str = '<div class="$1"></div><div class="$2"></div>';
            node.className = CLASS_PREFIX + className;
            if (className === "thumb") {
                className = CLASS_PREFIX + className;
                node.innerHTML = str.replace("$1", className + "-left").replace("$2", className + "-right");
            }
            return node;
        }
        function getRect(node) {
            return node.getBoundingClientRect();
        }
        // 阻止浏览器在scrollbar上的默认行为
        function preventDefault(container) {
            Utils.addEvent(container, "mousedown", function(e) {
                e.preventDefault();
            });
        }
        function preventDefault(comp) {
            Utils.addEvent(comp.container, "mousedown", function(e) {
                e.preventDefault();
            });
        }
        // 轨道点击
        function trackClick(comp) {
            Utils.addEvent(comp.widgets.track, "mousedown", function(e) {
                trackClickHandler(this, comp, e);
            });
        }
        // 两端按钮点击
        function btnClick(comp) {
            // left
            Utils.addEvent(comp.widgets.leftButton, "mousedown", function() {
                setThumbOffsetByStep(comp, -SCROLLBAR_CONF.step);
            });
            Utils.addEvent(comp.widgets.rightButton, "mousedown", function() {
                setThumbOffsetByStep(comp, SCROLLBAR_CONF.step);
            });
        }
        // 滑块处理
        function thumbHandler(comp) {
            var isMoving = false, startPoint = 0, startOffset = 0, trackWidth = comp.values.trackWidth;
            Utils.addEvent(comp.widgets.thumb, "mousedown", function(e) {
                e.preventDefault();
                e.stopPropagation();
                isMoving = true;
                startPoint = e.clientX;
                startOffset = comp.thumbLocationX;
            });
            Utils.addEvent(comp.container.ownerDocument, "mouseup", function() {
                isMoving = false;
                startPoint = 0;
                startOffset = 0;
            });
            Utils.addEvent(comp.container.ownerDocument, "mousemove", function(e) {
                if (!isMoving) {
                    return;
                }
                var distance = e.clientX - startPoint, offset = startOffset + distance, thumbWidth = comp.values.thumbWidth;
                if (offset < 0) {
                    offset = 0;
                } else if (offset + thumbWidth > trackWidth) {
                    offset = trackWidth - thumbWidth;
                }
                setThumbLocation(comp, offset);
            });
        }
        // 轨道点击处理器
        function trackClickHandler(track, comp, evt) {
            var trackRect = getRect(track), values = comp.values, // 单位偏移值， 一个viewWidth所对应到轨道上后的offset值
            unitOffset = values.viewWidth / (values.contentWidth - values.viewWidth) * values.trackWidth, // 点击位置在轨道中的偏移
            clickOffset = evt.clientX - trackRect.left;
            // right click
            if (clickOffset > values.offset) {
                // 剩余距离已经不足以支撑滚动， 则直接偏移置最大
                if (values.offset + unitOffset > values.trackWidth) {
                    setThumbOffset(comp, values.trackWidth);
                } else {
                    setThumbOffset(comp, values.offset + unitOffset);
                }
            } else {
                // 剩余距离已经不足以支撑滚动， 则直接把偏移置零
                if (values.offset - unitOffset < 0) {
                    setThumbOffset(comp, 0);
                } else {
                    setThumbOffset(comp, values.offset - unitOffset);
                }
            }
        }
        function setThumbLocation(comp, locationX) {
            // 滑块偏移值
            var values = comp.values, trackPieceWidth = values.trackWidth - values.thumbWidth, offset = Math.floor(locationX / trackPieceWidth * values.trackWidth);
            comp.updateOffset(offset);
            // 更新滑块物理偏移: 定位
            comp.thumbLocationX = locationX;
            comp.widgets.thumb.style.left = locationX + "px";
        }
        // 根据指定的内容视图上移动的步长来改变滚动条的offset值
        function setThumbOffsetByStep(comp, step) {
            var leftOverflow = comp.leftOverflow + step;
            // 修正越界
            if (leftOverflow < 0) {
                leftOverflow = 0;
            } else if (leftOverflow > comp.values.scrollWidth) {
                leftOverflow = comp.values.scrollWidth;
            }
            setThumbByLeftOverflow(comp, leftOverflow);
        }
        // 设置偏移值, 会同时更新滑块在显示上的定位
        function setThumbOffset(comp, offset) {
            var values = comp.values, offsetProportion = offset / values.trackWidth, trackPieceWidth = values.trackWidth - values.thumbWidth, thumbLocationX = 0;
            thumbLocationX = Math.floor(offsetProportion * trackPieceWidth);
            if (offset < 0) {
                offset = 0;
                thumbLocationX = 0;
            }
            comp.updateOffset(offset);
            // 更新滑块定位
            comp.widgets.thumb.style.left = thumbLocationX + "px";
            comp.thumbLocationX = thumbLocationX;
        }
        /**
   * 根据内容视图上的偏移值设置滑块位置
   */
        function setThumbOffsetByViewOffset(comp, viewOffset) {
            var values = comp.values, offsetProportion = 0, offset = 0;
            // 轨道偏移比例
            offsetProportion = viewOffset / (values.contentWidth - values.viewWidth);
            // 轨道偏移值
            offset = Math.floor(offsetProportion * values.trackWidth);
            setThumbOffset(comp, offset);
        }
        /**
   * 根据左溢出值设置滑块定位
   */
        function setThumbByLeftOverflow(comp, leftViewOverflow) {
            var values = comp.values, overflowProportion = leftViewOverflow / (values.contentWidth - values.viewWidth);
            setThumbOffset(comp, overflowProportion * values.trackWidth);
        }
    }
};

//.tmp_build/src/ui/ui-impl/ui-utils.js
/**
 * Created by hn on 14-4-1.
 */
_p[60] = {
    value: function(require) {
        var $ = _p.r(16), kity = _p.r(22), TOPIC_POOL = {};
        var Utils = {
            ele: function ele(doc, name, options) {
                var node = null;
                if (name === "text") {
                    return doc.createTextNode(options);
                }
                node = doc.createElement(name);
                options.className && (node.className = options.className);
                if (options.content) {
                    node.innerHTML = options.content;
                }
                return node;
            },
            getRectBox: function getRectBox(node) {
                return node.getBoundingClientRect();
            },
            on: function on(target, type, fn) {
                $(target).on(type, fn);
                return this;
            },
            delegate: function delegate(target, selector, type, fn) {
                $(target).delegate(selector, type, fn);
                return this;
            },
            publish: function publish(topic, args) {
                var callbackList = TOPIC_POOL[topic];
                if (!callbackList) {
                    return;
                }
                args = [].slice.call(arguments, 1);
                kity.Utils.each(callbackList, function(callback) {
                    callback.apply(null, args);
                });
            },
            subscribe: function subscribe(topic, callback) {
                if (!TOPIC_POOL[topic]) {
                    TOPIC_POOL[topic] = [];
                }
                TOPIC_POOL[topic].push(callback);
            },
            getClassList: function getClassList(node) {
                return node.classList || new ClassList(node);
            }
        };
        //注意： 仅保证兼容IE9以上
        function ClassList(node) {
            this.node = node;
            this.classes = node.className.replace(/^\s+|\s+$/g, "").split(/\s+/);
        }
        ClassList.prototype = {
            constructor: ClassList,
            contains: function contains(className) {
                return this.classes.indexOf(className) !== -1;
            },
            add: function add(className) {
                if (this.classes.indexOf(className) == -1) {
                    this.classes.push(className);
                }
                this._update();
                return this;
            },
            remove: function remove(className) {
                var index = this.classes.indexOf(className);
                if (index !== -1) {
                    this.classes.splice(index, 1);
                    this._update();
                }
                return this;
            },
            toggle: function toggle(className) {
                var method = this.contains(className) ? "remove" : "add";
                return this[method](className);
            },
            _update: function _update() {
                this.node.className = this.classes.join(" ");
            }
        };
        return Utils;
    }
};

//.tmp_build/src/ui/ui-impl/ui.js
/**
 * Created by hn on 14-3-31.
 */
_p[61] = {
    value: function(require) {
        return {
            DrapdownBox: _p.r(48),
            Delimiter: _p.r(47),
            Area: _p.r(41),
            Keyboard: _p.r(51)
        };
    }
};

//.tmp_build/src/ui/ui.js
/**
 * Created by hn on 14-3-17.
 */
_p[62] = {
    value: function(require) {
        var kity = _p.r(22), // UiUitls
        $$ = _p.r(60), $ = _p.r(16), Utils = _p.r(4), VIEW_STATE = _p.r(34).VIEW_STATE, Scrollbar = _p.r(59), // Toolbar = _p.r(40),
        // 控制组件
        ScrollZoom = _p.r(33), // ELEMENT_LIST = _p.r(39),
        Keyboard = _p.r(36), Header = _p.r(35), UIComponent = kity.createClass("UIComponent", {
            constructor: function constructor(kfEditor, options) {
                var currentDocument = null;
                this.options = options;
                this.container = kfEditor.getContainer();
                this.switchThemeByDeviceType();
                currentDocument = this.container.ownerDocument;
                // ui组件实例集合
                this.components = {};
                this.canvasRect = null;
                this.viewState = VIEW_STATE.NO_OVERFLOW;
                this.kfEditor = kfEditor;
                this.header = createHeader(currentDocument);
                this.editArea = createEditArea(currentDocument);
                this.okButton = createOkButton(currentDocument);
                this.canvasContainer = createCanvasContainer(currentDocument);
                this.canvasWrapper = createCanvasWrapper(currentDocument);
                this.scrollbarContainer = createScrollbarContainer(currentDocument);
                this.keyboardContainer = createKeyboardContainer(currentDocument);
                this.editArea.appendChild(this.header);
                this.editArea.appendChild(this.canvasWrapper);
                this.editArea.appendChild(this.okButton);
                this.editArea.appendChild(this.scrollbarContainer);
                this.canvasWrapper.appendChild(this.canvasContainer);
                this.container.appendChild(this.editArea);
                this.container.appendChild(this.keyboardContainer);
                this.updateSize();
                this.initComponents();
                this.initServices();
                this.initEvent();
                this.initScrollEvent();
            },
            updateSize: function updateSize() {
                var scale = this.options.scale;
                var canvasContainerNode = $(this.canvasContainer);
                var editAreaNode = $(this.editArea);
                var canvasWrapperNode = $(this.canvasWrapper);
                var containerNode = $(this.container);
                this.scaleWidth(canvasContainerNode).scaleHeight(canvasContainerNode);
                this.scaleWidth(editAreaNode).scalePadding(editAreaNode);
                this.scaleWidth(canvasWrapperNode).scaleHeight(canvasWrapperNode).scalePadding(canvasWrapperNode);
                this.scaleWidth(containerNode).scaleHeight(containerNode);
                this.keyboardContainer.style.transform = "scale(".concat(scale, ")");
                this.keyboardContainer.style.transformOrigin = "left top";
                var okButton = $(this.okButton);
                okButton.css("font-size", Math.floor(okButton.css("font-size").split("px")[0] * scale));
                okButton.css("right", Math.floor(okButton.css("right").split("px")[0] * scale));
            },
            scaleWidth: function scaleWidth(node) {
                var scale = this.options.scale;
                var width = node.outerWidth();
                node.outerWidth(Math.floor(width * scale));
                return this;
            },
            scaleHeight: function scaleHeight(node) {
                var scale = this.options.scale;
                var height = node.outerHeight();
                node.outerHeight(Math.floor(height * scale));
                return this;
            },
            scalePadding: function scalePadding(node) {
                var scale = this.options.scale;
                var paddingLeft = node.css("padding-left").split("px")[0];
                var paddingRight = node.css("padding-right").split("px")[0];
                var paddingTop = node.css("padding-top").split("px")[0];
                var paddingBottom = node.css("padding-bottom").split("px")[0];
                node.css("padding-left", Math.floor(paddingLeft * scale));
                node.css("padding-right", Math.floor(paddingRight * scale));
                node.css("padding-top", Math.floor(paddingTop * scale));
                node.css("padding-bottom", Math.floor(paddingBottom * scale));
                return this;
            },
            scaleTop: function scaleTop(node) {
                var scale = this.options.scale;
                var top = node.css("top").split("px")[0];
                node.css("top", Math.floor(top * scale));
                return this;
            },
            isAndroid: function isAndroid() {
                return this.options.device === "android";
            },
            switchThemeByDeviceType: function switchThemeByDeviceType() {
                if (this.isAndroid()) {
                    this.container.className += " android";
                } else {
                    this.container.className += " pc";
                }
            },
            // 组件实例化
            initComponents: function initComponents() {
                // TODO 禁用缩放, 留待后面再重新开启
                if (false) {
                    //                if ( this.options.zoom ) {
                    this.components.scrollZoom = new ScrollZoom(this, this.kfEditor, this.canvasContainer, {
                        max: this.options.maxzoom,
                        min: this.options.minzoom
                    });
                }
                this.components.header = new Header(this, this.kfEditor);
                this.components.scrollbar = new Scrollbar(this, this.kfEditor);
                // 软件盘
                this.components.keyboard = new Keyboard(this, this.kfEditor);
            },
            // 初始化服务
            initServices: function initServices() {
                this.kfEditor.registerService("ui.get.canvas.container", this, {
                    getCanvasContainer: this.getCanvasContainer
                });
                this.kfEditor.registerService("ui.update.canvas.view", this, {
                    updateCanvasView: this.updateCanvasView
                });
                this.kfEditor.registerService("ui.canvas.container.event", this, {
                    on: this.addEvent,
                    off: this.removeEvent,
                    trigger: this.trigger,
                    fire: this.trigger
                });
            },
            initEvent: function initEvent() {
                var _this = this;
                $$.delegate(this.container.ownerDocument, ".kf-editor-ok", "click", function() {
                    _this.kfEditor.execCommand("get.image.data", function(data) {
                        var formula = _this.kfEditor.execCommand("get.source");
                        _this.kfEditor.eclassWebService.send({
                            type: "common.setFormula",
                            data: {
                                body: {
                                    formulaSrc: data.img,
                                    formula: formula
                                }
                            }
                        });
                    });
                });
            },
            initScrollEvent: function initScrollEvent() {
                var _self = this;
                this.kfEditor.requestService("ui.set.scrollbar.update.handler", function(proportion, offset, values) {
                    offset = Math.floor(proportion * (values.contentWidth - values.viewWidth));
                    _self.kfEditor.requestService("render.set.canvas.offset", offset);
                });
            },
            getCanvasContainer: function getCanvasContainer() {
                return this.canvasContainer;
            },
            addEvent: function addEvent(type, handler) {
                Utils.addEvent(this.canvasContainer, type, handler);
            },
            removeEvent: function removeEvent() {},
            trigger: function trigger(type) {
                Utils.trigger(this.canvasContainer, type);
            },
            // 更新画布视窗， 决定是否出现滚动条
            updateCanvasView: function updateCanvasView() {
                var canvas = this.kfEditor.requestService("render.get.canvas"), contentContainer = canvas.getContentContainer(), contentRect = null;
                if (this.canvasRect === null) {
                    // 兼容firfox， 获取容器大小，而不是获取画布大小
                    this.canvasRect = this.canvasContainer.getBoundingClientRect();
                }
                contentRect = contentContainer.getRenderBox("paper");
                if (contentRect.width > this.canvasRect.width) {
                    if (this.viewState === VIEW_STATE.NO_OVERFLOW) {
                        this.toggleViewState();
                        this.kfEditor.requestService("ui.show.scrollbar");
                        this.kfEditor.requestService("render.disable.relocation");
                    }
                    this.kfEditor.requestService("render.relocation");
                    // 更新滚动条， 参数是：滚动条所控制的内容长度
                    this.kfEditor.requestService("ui.update.scrollbar", contentRect.width);
                    this.kfEditor.requestService("ui.relocation.scrollbar");
                } else {
                    if (this.viewState === VIEW_STATE.OVERFLOW) {
                        this.toggleViewState();
                        this.kfEditor.requestService("ui.hide.scrollbar");
                        this.kfEditor.requestService("render.enable.relocation");
                    }
                    this.kfEditor.requestService("render.relocation");
                }
            },
            toggleViewState: function toggleViewState() {
                this.viewState = this.viewState === VIEW_STATE.NO_OVERFLOW ? VIEW_STATE.OVERFLOW : VIEW_STATE.NO_OVERFLOW;
            },
            getDeviceType: function getDeviceType() {
                return this.options.device;
            }
        });
        // function createToolbarWrap ( doc ) {
        //     return $$.ele( doc, "div", {
        //         className: "kf-editor-toolbar"
        //     } );
        // }
        // function createToolbarContainer ( doc ) {
        //     return $$.ele( doc, "div", {
        //         className: "kf-editor-inner-toolbar"
        //     } );
        // }
        function createHeader(doc) {
            var container = doc.createElement("div");
            container.className = "kf-editor-header";
            return container;
        }
        function createOkButton(doc) {
            var container = doc.createElement("div");
            container.className = "kf-editor-ok";
            container.innerText = "确定";
            return container;
        }
        function createEditArea(doc) {
            var container = doc.createElement("div");
            container.className = "kf-editor-edit-area";
            return container;
        }
        function createCanvasContainer(doc) {
            var container = doc.createElement("div");
            container.className = "kf-editor-canvas-container";
            return container;
        }
        function createCanvasWrapper(doc) {
            var container = doc.createElement("div");
            container.className = "kf-editor-canvas-wrapper";
            return container;
        }
        function createScrollbarContainer(doc) {
            var container = doc.createElement("div");
            container.className = "kf-editor-edit-scrollbar";
            return container;
        }
        function createKeyboardContainer(doc) {
            var container = doc.createElement("div");
            container.className = "kf-editor-edit-keyboard";
            return container;
        }
        return UIComponent;
    }
};

//dev-lib/start.js
/*!
 * 启动模块
 */
_p[63] = {
    value: function(require) {
        var KFEditor = _p.r(14), Factory = _p.r(15);
        // 注册组件
        KFEditor.registerComponents("ui", _p.r(62));
        KFEditor.registerComponents("parser", _p.r(23));
        KFEditor.registerComponents("render", _p.r(27));
        KFEditor.registerComponents("position", _p.r(25));
        KFEditor.registerComponents("syntax", _p.r(30));
        KFEditor.registerComponents("control", _p.r(6));
        KFEditor.registerComponents("print", _p.r(26));
        kf.EditorFactory = Factory;
    }
};

var moduleMapping = {
    "kf.start": 63
};

function use(name) {
    _p.r([ moduleMapping[name] ]);
}
/**
 * 启动代码
 */

( function ( global ) {

    // build环境中才含有use
    try {
        use( 'kf.start' );
    } catch ( e ) {
    }

} )( this );
})();