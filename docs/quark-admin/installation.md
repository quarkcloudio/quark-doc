# 入门指南

## 安装QuarkAdmin

需要安装PHP7+ 和 Laravel5.5，首先确保安装好了laravel，并且数据库连接设置正确。

``` bash
# 安装依赖
composer require quarkcms/quark-admin

# 然后运行下面的命令完成安装：
php artisan quarkadmin:install
```

::: warning
运行这个命令的时候，如果遇到了下面的错误:

SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was too long; max key length is 1000 bytes (SQL: alter tableusersadd uniqueusers_email_unique(email))

参考这个issue来解决 https://github.com/z-song/laravel-admin/issues/1541
:::

启动服务后，在浏览器打开 http://localhost/admin/ ,使用用户名：administrator 和密码：123456 登录.

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
│  │  │  │	└─ExampleController.php         示例控制器
│  │  │  └─...            					更多类库目录
│  │  └─...            						更多类库目录
│  └─...        							更多类库目录
├─public                					WEB 部署目录（对外访问目录）
│  ├─admin              					后台静态资源存放目录(css,js,image)
│  └─...          							更多目录
├─config                					WEB 部署目录（对外访问目录）
│  ├─quark.php              				后台配置，非特殊必要请勿更改
│  └─...          							更多配置文件
├─routes                					WEB 部署目录（对外访问目录）
│  ├─admin.php              				后台路由配置
│  └─...          							更多路由文件
```