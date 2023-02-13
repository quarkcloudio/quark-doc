# 资源

## 基础

资源（Resource）是 QuarkGO 中重要的组成部分，几乎所有的功能都是围绕着资源实现的；QuarkGo 的思想是约定大于配置，我们在资源里已经内置好各种功能的实现，开发者只需关注关键点的功能实现即可开发出完整的功能模块。

下面我们以内容管理为例，实现一个关于文章的 CURD 功能：
1. 首先我们参照 [快速开始](./installation.html#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B) 章节，创建好 main.go 文件；
2. 根据约定创建如下目录（也可自由命名）：
~~~
www                         WEB部署目录
├─admin                     应用目录
│  ├─actions				行为目录
│  ├─dashboards				仪表盘资源目录
│  ├─metrics       			仪表盘指标目录
│  ├─resources         		资源目录
│  ├─searches               搜索目录
│  └─providers.go           服务注册文件
│
├─website                   静态文件目录（对外访问）
└─main.go                   主文件
~~~