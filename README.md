<h1 align="center">Welcome to formula-editor 👋</h1>

> 基于百度 kityformula-editor 开发的公式编辑器，有 android 和 web 两种模式

## 安装

```sh
npm install
```

## 编译

```sh
grunt build
anywhere -p 9999 // 这里anywhere是为了开静态服务器，预览index.html
```

## 特性

设备类型：device - pc/android

```sh
{ip地址}:9999?device=android
```

协议类型：protocol - iframe/webview/documentEvent

```sh
{ip地址}:9999?protocol=webview
```

设备宽度：width

```sh
{ip地址}:9999?width=1920
```

## 样式

#### 安卓：

```sh
{ip地址}:9999?device=android&protocol=webview&width=1920
```

![android](https://github.com/SugarTurboS/Formula-Editor/blob/dev-2.0.19/images/android.png)

#### web：

```sh
{ip地址}:9999?device=pc&protocol=documentEvent&width=1920
```

![web](https://github.com/SugarTurboS/Formula-Editor/blob/dev-2.0.19/images/web.png)

老铁，走过路过给个 ⭐️

点个 ⭐️，不迷路

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
