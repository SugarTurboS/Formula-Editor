# 接口文档

公式编辑器借助 web-service 库，通过事件的触发和监听实现数据交互，有 webview 和 documentEvent 两种通信方式。下面的示例均以 documentEvent 作为通信通道，公式编辑器启用 documentEvent 需要在 url 中增加 protocol，详细请参照[readme](https://github.com/SugarTurboS/Formula-Editor/blob/dev-2.0.23/readme.md)

## 信令格式

格式如下

```js
{
  type: string; // 信令的类型
  headers: {
    reqId: string; // 信令的请求id，每次都随机
  }
  data: {
    body: object, // body中存储具体数据
  },
}
```

以导出公式-common.setFormula 为例，控制台输入如下调试语句：

```js
document.addEventListener('documentMessage', (e) => {
  console.log(e);
});
```

可以看到调试数据如下所示：

```js
CustomEvent:
{
  ...
  detail: {
    type: 'common.setFormula',
    headers: {
      reqId: '......'
    },
    data: {
      body: {
        formula: '<>',
        formulaSrc: 'data:image/png;base64,......'
      }
    }
  }
}
```

## 事件列表

1、关闭弹窗

- 说明：点击关闭弹窗按钮时触发，使用方可监听该事件，实现页面跳转、弹窗关闭。
- 发布者：公式编辑器
- 订阅者：使用方
- 事件名：common.closeModal
- 使用示例:

```js
document.addEventListener('documentMessage', (e) => {
  const { type } = e?.detail;
  const msg = e?.detail?.data?.body;
  if (type !== 'common.closeModal') return;
  console.log('关闭');
});
```

2、鼠标点击左侧 tab 切换事件

- 说明：点击左侧“常用”、“单位”按钮切换字符类型时触发
- 发布者：公式编辑器
- 订阅者：使用方
- 事件名：common.setType
- 属性列表：
  |属性名|类型|默认值|备注|
  |-|-|-|-|
  |type|'common'\|'algebra'\|'geometry'\|'letter'\|'other'|无|当前字符类型|
- 使用示例:

```js
document.addEventListener('documentMessage', (e) => {
  const { type } = e?.detail;
  const msg = e?.detail?.data?.body;
  if (type !== 'common.setType') return;
  console.log('msg', msg.type); // msg algebra
});
```

3、鼠标点击 latex 字符事件

- 说明：点击键盘按钮时触发，常用于业务方埋点
- 发布者：公式编辑器
- 订阅者：使用方
- 事件名：common.selectKey
- 属性列表：
  |属性名|类型|默认值|备注|
  |-|-|-|-|
  |key|string|无|键盘字符的 latex 值|
- 使用示例:

```js
document.addEventListener('documentMessage', (e) => {
  const { type } = e?.detail;
  const msg = e?.detail?.data?.body;
  if (type !== 'common.selectKey') return;
  console.log('msg', msg.key); // msg \delta
});
```

4、导出公式事件

- 说明：鼠标点击完成按钮，导出编辑器中的公式的 latex 值和 base64 格式的图片
- 发布者：公式编辑器
- 订阅者：使用方
- 事件名：common.setFormula
- 属性列表：
  |属性名|类型|默认值|备注|
  |-|-|-|-|
  |formula|string|无|总 latex 值|
  |formulaSrc|string|无|base64 格式的 url|
- 使用示例:

```js
document.addEventListener('documentMessage', (e) => {
  const { type } = e?.detail;
  const msg = e?.detail?.data?.body;
  if (type !== 'common.setFormula') return;
  console.log('msg', msg.formula, msg.formulaSrc); // msg 123 data:image/png;......
});
```

5、初始化事件

- 说明：通知使用方，公式编辑器已初始化完成，完成后才可以进行通信。
- 发布者：公式编辑器
- 订阅者：使用方
- 事件名：common.ready
- 使用示例:

```js
document.addEventListener('documentMessage', (e) => {
  const { type } = e?.detail;
  const msg = e?.detail?.data?.body;
  if (type !== 'common.ready') return;
  console.log('已准备');
});
```

6、设置公式初始值

- 说明：通知公式编辑器初始 latex 值，一般用于二次编辑 latex 公式
- 发布者：使用者
- 订阅者：公式编辑器
- 事件名：common.readFormula
- 属性列表：
  |属性名|类型|默认值|备注|
  |-|-|-|-|
  |formula|string|无|总 latex 值|
- 使用示例:

```js
const event = new CustomEvent('documentMessage', {
  detail: {
    type: 'common.readFormula',
    headers: {
      reqId: 1,
    },
    data: {
      body: {
        formula: 'abc',
      },
    },
  },
});
document.dispatchEvent(event);
```

7、清空公式编辑器

- 说明：通知公式编辑器清空内容
- 发布者：使用者
- 订阅者：公式编辑器
- 事件名：common.clearFormula
- 使用示例:

```js
const event = new CustomEvent('documentMessage', {
  detail: {
    type: 'common.clearFormula',
    headers: {
      reqId: 2,
    },
    data: {
      body: {},
    },
  },
});
document.dispatchEvent(event);
```
