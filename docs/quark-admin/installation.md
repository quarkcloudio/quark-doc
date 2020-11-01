# 入门指南

## 安装

需要安装PHP7.2+ 和 Laravel6.0，首先确保安装好了laravel，并且数据库连接设置正确。

``` bash
# 第一步，安装依赖
composer require quarkcms/quark-admin

# 第二步，然后运行下面的命令来发布资源：
php artisan quarkadmin:publish

# 第三步，然后运行下面的命令完成安装：
php artisan quarkadmin:install
```

::: warning
运行命令的时候，如果遇到了下面的错误:

SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was too long; max key length is 1000 bytes ...
:::

您可以找到 config 目录下的 database.php 文件，进行更改：
``` php
// 将 strict 改为 false
'strict' => false,
// 将 engine 改为 'InnoDB'
'engine' => 'InnoDB',
```
完成安装后，执行如下命令，快速启动服务：
``` bash
php -S 127.0.0.1:8080 -t ./public
```
后台地址： http://127.0.0.1:8080/admin/index

默认用户名：administrator 密码：123456

## 目录结构
安装完成之后，后台的控制器目录为app/Http/Controllers/Admin，之后大部分的后台开发编码工作都是在这个目录下进行.

``` code
project  									应用部署目录
├─app           							应用目录
│  ├─Http               					Http目录
│  │  ├─Controllers     					Controllers目录
│  │  │  ├─Admin          					应用入口文件
│  │  │  │	├─DashboardController.php       仪表盘控制器
│  │  │  │	├─UpgradeController.php         程序自定义升级控制器
│  │  │  └─...            					更多类库目录
│  │  └─...            						更多类库目录
│  └─...        							更多类库目录
├─public                					WEB 部署目录（对外访问目录）
│  ├─admin              					后台静态资源存放目录(css,js,image)
│  └─...          							更多目录
├─config                					WEB 部署目录（对外访问目录）
│  ├─admin.php              				后台配置，非特殊必要请勿更改
│  └─...          							更多配置文件
├─routes                					WEB 部署目录（对外访问目录）
│  ├─admin.php              				后台路由配置
│  └─...          							更多路由文件
```