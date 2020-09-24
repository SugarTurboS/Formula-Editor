<h1 align="center">Welcome to formula-editor 👋</h1>

> 基于百度 kityformula-editor 开发的公式编辑器，有 android 和 web 两种模式

## 安装依赖

```sh
npm install
npm install -g anywhere // 随启随用的静态服务器
```

## 使用

```sh
grunt build
anywhere -p {port} // 这里anywhere是为了开静态服务器，预览index.html
```

以 web 为例，url 中传入?device=pc&protocol=documentEvent，然后运行项目。点击键盘中的字符，即可生成对应 latex 公式，点击”确定“按钮导出公式，控制台可以通过以下代码拿到最终的 latex 值和相应的 base64 图片。

```js
document.addEventListener('documentMessage', (e) => {
  const { type } = e?.detail;
  const msg = e?.detail?.data?.body;
  if (type !== 'common.setFormula') return;
  console.log('msg', msg.formula, msg.formulaSrc); // msg 123 data:image/png;......
});
```

其他信令请参照下方的信令详情

## 信令

公式编辑器支持 webview, iframe, documentEvent3 种通信方式，详细信令参照：
[信令详情](./src/editor/command.md)

## 特性

设备类型：device - pc/android

```sh
{ip地址}:{port}?device=android
```

协议类型：protocol - iframe/webview/documentEvent

```sh
{ip地址}:{port}?protocol=webview
```

设备宽度：width

```sh
{ip地址}:{port}?width=1920
```

## 样式

#### 安卓：

```sh
{ip地址}:{port}?device=android&protocol=webview&width=1920
```

![android](./images/android.png)

#### web：

```sh
{ip地址}:{port}?device=pc&protocol=documentEvent&width=1920
```

![web](./images/web.png)

老铁，走过路过给个 ⭐️

点个 ⭐️，不迷路
