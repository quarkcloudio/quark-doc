# 基础
## 安装
### QuarkCMS 环境要求如下：

> * PHP >= 7.2.5
> * PDO PHP Extension
> * MBstring PHP Extension

### Composer 安装
 ``` bash
 composer install
 ```

### 配置数据库
重命名.env.example 改为 .env ，配置数据库
~~~
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
~~~

### 命令行安装系统

第一步：
 ``` bash
php artisan quark:install
 ```
:::warning
注意: 您需要将php加入到环境变量，如果在执行迁移时发生「class not found」错误，试着先执行 composer dump-autoload 命令后再进行一次。
:::
第二步：
 ``` bash
php -S 127.0.0.1:8080 -t ./public
 ```

第三步：http://127.0.0.1:8080/admin

> 后台用户名：administrator
> 后台密码：123456

请及时登录网站后台修改密码

## 开发规范
### 函数和类、属性命名
类的命名采用驼峰法（首字母大写），例如UserController；
方法的命名使用驼峰法（首字母小写），例如 getUserName；
属性的命名使用驼峰法（首字母小写），例如 tableName、instance；
特例：以双下划线__打头的函数或方法作为魔术方法，例如 __call 和 __autoload；

### 数据表和字段
数据表和字段采用小写加下划线方式命名，并注意字段名不要以下划线开头，例如 user 表和 user_name字段，不建议使用驼峰和中文作为数据表及字段命名。
请理解并尽量遵循以上命名规范，可以减少在开发过程中出现不必要的错误。

## 目录结构
~~~
www  WEB部署目录（或者子目录）
├─app         应用目录
│  ├─Console				目录里包含了所有的 Artisan 命令
│  ├─Exceptions				目录包含应用的异常处理器，同时还是处理应用抛出的任何异常的好地方。
│  ├─Http        			目录包含了控制器、中间件和表单请求。几乎所有的进入应用的请求的处理逻辑都被放在这里。
│  │  ├─Controllers  		控制器目录
│  │  ├─Middleware     		中间件目录 
│  │  └─Kernel.php          更多类库目录
│  │
│  ├─Models         		模型目录
│  ├─Providers              公共函数文件
│  ├─Services               公共函数文件
│  │   └─ Helper.php 
│  │
│  └─User.php               应用行为扩展定义文件
│
├─bootstrap                  应用配置目录
├─config                     路由定义目录
│  ├─api.php               路由定义
│  ├─app.php
│  ├─auth.php
│  ├─broadcasting.php
│  ├─cache.php
│  ├─database.php
│  ├─filesystems.php
│  ├─mail.php
│  ├─permission.php
│  ├─queue.php
│  ├─services.php
│  ├─session.php
│  └─view.php
│
├─database
│  ├─factories
│  ├─migrations
│  ├─seeds
│  └─.gitignore
│ 
├─public                WEB目录（对外访问目录）
│  ├─admin
│  ├─home
│  ├─mobile
│  ├─static
│  ├─tpl
│  ├─.htaccess 
│  ├─favicon.ico          
│  ├─index.php  
│  ├─robots.txt
│  └─web.config
│
├─resources
│  ├─assets
│  │  ├─js
│  │  └─sass
│  │
│  ├─lang
│  │  └─en
│  │
│  ├─views
│  │  ├─admin
│  │  ├─auth
│  │  ├─common
│  │  ├─home
│  │  ├─layouts
│  │  └─mobile
│  │
├─routes  
│  ├─api.php
│  ├─channels.php
│  ├─console.php
│  └─web.php
│
├─storage
│  ├─app
│  │  ├─public
│  │  └─.gitignore
│  │
│  ├─frameword
│  │  ├─cache
│  │  ├─sessions
│  │  ├─testing
│  │  ├─views
│  │  └─.gitinore
│  │
│  └─logs
│  │  └─.gitinore
│  │ 
├─tests
│  ├─Feature
│  │  └─ExampleTest.php
│  │ 
│  ├─Unit
│  │  └─ExampleTest.php
│  │ 
│  ├─ CreatesApplication.php
│  └─ TestCase.php
│  │
├─vendor                第三方类库目录               
│  ├─composer
│  │  ├─autoload_classmap.php
│  │  ├─autoload_namespaces.php
│  │  ├─autoload_psr4.php
│  │  ├─autoload_real.php
│  │  ├─autoload_static.php
│  │  ├─ClassLoader.php
│  │  └─LICENSE
│  └─autoload.php
│
├─.env
├─.env.example
├─.git-credentials
├─.gitattributes
├─.gitignore
├─artisan
├─composer.json         composer 定义文件
├─composer.lock         授权说明文件
├─package.json
├─phpunit.xml
├─README.md             README 文件
├─server.php                
├─webpack.mix.js
~~~