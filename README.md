# 在线竞拍平台

这一个基于 Angular4.0 、Nodejs 和 Express 的小型电子产品售卖平台，使用了 Http 通讯，路由，服务，依赖注入，pipe管道，响应式表单等技术。

![图片预览](http://ot4esom84.bkt.clouddn.com/17-9-2/72946124.jpg)
![图片预览](http://ot4esom84.bkt.clouddn.com/17-9-2/4740444.jpg)


## 技术栈

【前端】

- ES6：ECMAScript 新一代语法，这也是以后的趋势
- Bootstrap：界面框架
- Angular: 前端开发框架
- Angular 路由器： 包含多种服务(RouterModule)、多种指令(RouterOutlet、RouterLink、RouterLinkActive)、 和一套配置(Routes)等。
- http通讯：通过http通讯获取服务端数据
- pipe 管道：负责处理原始值到显示值的转化
- 响应式表单：使用特定指令，将模板上的html元素与底层的数据模型连接在一起

【后端】

- Nodejs: 使用Nodejs创建服务器

- Express: 使用Express创建restful的http服务

【自动化构建】

- Angular CLI: 全新命令行界面工具

## 实现细节

**首页**

左侧为搜索表单，主要使用了 `FormBuilder`, `FormControl`,` FormGroup`，使用filter实现搜索效果。

右侧为一个轮播图组件，利用bootstrap框架实现。下面产品列表的数据来自后端模拟的数据，通过http通讯来获取，并将其展示在页面。

**产品详情页**

通过产品 id 来获取参数，将产品信息以及评论列表展示在页面，可实现关注、发表评论、评分功能。


## 收获

1. 对 Angular 的组件、指令、依赖注入、http通讯、数据绑定等有了基本了解
2. 了解了 Angular 组件之间的交互、传值
3. 熟悉了在 vue 项目中使用第三方插件（如jQuery,bootstrap）
4. 熟悉了组件化、模块化的开发思维
6. 再次熟悉项目开发流程：项目分析设计 -> 项目环境搭建 -> 依赖安装 -> 页面架构设计 -> 组件开发 -> 测试联调 -> 发布上线

## 文件说明及使用

server：nodejs服务端代码
``` 
# install dependencies
$ npm install

# serve with hot reload at localhost:8000
node build/auction_server.js
```
auction:Angular 客户端代码（依赖nodejs服务端启动，才可显示页面）
``` 
# install dependencies
$ npm install

# serve with hot reload at localhost:4200
npm run start
```

combine: 客户端与服务端整合后的代码，可独立启动
``` 
# install dependencies
$ npm install

# serve with hot reload at localhost:8000
node build/auction_server.js
```
