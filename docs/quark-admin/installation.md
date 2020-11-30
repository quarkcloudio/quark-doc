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
php artisan serve
```
后台地址： http://127.0.0.1:8000/admin/index

默认用户名：administrator 密码：123456

## 更新
``` bash
# 第一步，更新依赖
composer update quarkcms/quark-admin

# 第二步，执行更新命令：
php artisan quarkadmin:update
```

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

## 配置信息
安装完成之后，您可以找到`config`目录下的`admin.php`文件进行相关配置
``` php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin App Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application. This value is used when the
    | framework needs to display the name of the application within the UI
    | or in other locations. Of course, you're free to change the value.
    |
    */
    'name' => 'QuarkAdmin',

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin logo
    |--------------------------------------------------------------------------
    |
    | The logo of all admin pages. You can also set it as an image by using a
    | `img` tag, eg '<img src="http://logo-url" alt="Admin logo">'.
    |
    */
    'logo' => false,

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin description
    |--------------------------------------------------------------------------
    |
    | The description of login page.
    |
    */
    'description' => '信息丰富的世界里，唯一稀缺的就是人类的注意力',

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin captcha:todo
    |--------------------------------------------------------------------------
    |
    | 登录验证码类型，tencent_captcha：腾讯云验证码，local：本地图形验证码
    |
    */
    'captcha_driver' => 'local',

    /*
    |--------------------------------------------------------------------------
    | tencent captcha config:todo
    |--------------------------------------------------------------------------
    |
    | 腾讯云验证码配置
    |
    */
    'tencent_captcha' => [
        'appid' => env('appid'),
        'app_secret_key' => env('app_secret_key')
    ],

    /*
    |--------------------------------------------------------------------------
    | login type
    |--------------------------------------------------------------------------
    |
    | 登录方式['username']，暂时只支持username
    |
    */
    'login_type' => ['username'],

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin iconfontUrl
    |--------------------------------------------------------------------------
    |
    | 使用 IconFont 的图标配置
    |
    */
    'iconfont_url' => '//at.alicdn.com/t/font_1615691_3pgkh5uyob.js',

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin layout
    |--------------------------------------------------------------------------
    |
    | The layout of QuarkAdmin
    |
    */
    'layout' => [

        // layout 的左上角 的 title
        'title' => config('admin.name'),

        // layout 的左上角 的 logo
        'logo' => config('admin.logo'),

        // layout 的头部行为
        'header_actions' => [
            [
                'component' => 'icon',
                'icon' => 'icon-question-circle',
                'tooltip' => '使用文档',
                'href' => 'http://www.quarkcms.com/',
                'target' => '_blank'
            ],
            // [
            //     'component' => 'a',
            //     'title' => '使用文档',
            //     'href' => 'http://www.ixiaoquan.com',
            //     'target' => '_blank'
            // ]
        ],

        // layout 的菜单模式,side：右侧导航，top：顶部导航，mix：混合模式
        'layout' => 'side',

        // layout 的菜单模式为mix时，是否自动分割菜单
        'split_menus' => false,

        // layout 的菜单模式为mix时，顶部主题 'dark' | 'light'
        'header_theme' => 'dark',

        // layout 的内容模式,Fluid：定宽 1200px，Fixed：自适应
        'content_width' => 'Fluid',

        // 导航的主题，'light' | 'dark'
        'nav_theme' => 'dark',

        // 主题色
        'primary_color' => '#1890ff',

        // 是否固定 header 到顶部
        'fixed_header' => true,

        // 是否固定导航
        'fix_siderbar' => true,

        // 使用 IconFont 的图标配置
        'iconfont_url' => config('admin.iconfont_url'),

        // 当前 layout 的语言设置，'zh-CN' | 'zh-TW' | 'en-US'
        'locale' => config('locale','zh-CN'),

        // 侧边菜单宽度
        'sider_width' => 208
    ],

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin copyright
    |--------------------------------------------------------------------------
    |
    | 网站版权
    |
    */
    'copyright' => '2020 QuarkCMS',

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin friend links
    |--------------------------------------------------------------------------
    |
    | 友情链接
    |
    */
    'links' => [
        [
            'title' => 'Quark',
            'href' => 'http://www.quarkcms.com/'
        ],
        [
            'title' => '爱小圈',
            'href' => 'http://www.ixiaoquan.com'
        ],
        [
            'title' => 'Github',
            'href' => 'https://github.com/quarkcms'
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | QuarkAdmin auth setting
    |--------------------------------------------------------------------------
    |
    | Authentication settings for all admin pages. Include an authentication
    | guard and a user provider setting of authentication driver.
    |
    | You can specify a controller for `login` `logout` and other auth routes.
    |
    */
    'auth' => [

        'guards' => [
            'admin' => [
                'driver'   => 'session',
                'provider' => 'admins',
            ],
        ],

        'providers' => [
            'admins' => [
                'driver' => 'eloquent',
                'model'  => QuarkCMS\QuarkAdmin\Models\Admin::class,
            ],
        ],
    ],

];
```

## 路由
安装完成之后，您可以找到 `routes` 目录下的 `admin.php` 文件进行路由配置，如果你的控制器继承了 `QuarkCMS\QuarkAdmin\Http\Controllers\Controller` 控制器，那此控制器对应的路由需包含`index`、`show`、`create`、`store`、`edit`、`update`、`action`、`destroy`这几个方法

``` php
$router->get('admin/article/index', 'ArticleController@index')->name('api/admin/article/index');
$router->get('admin/article/show', 'ArticleController@show')->name('api/admin/article/show');
$router->get('admin/article/create', 'ArticleController@create')->name('api/admin/article/create');
$router->post('admin/article/store', 'ArticleController@store')->name('api/admin/article/store');
$router->get('admin/article/edit', 'ArticleController@edit')->name('api/admin/article/edit');
$router->post('admin/article/update', 'ArticleController@update')->name('api/admin/article/update');
$router->any('admin/article/action', 'ArticleController@action')->name('api/admin/article/action');
$router->post('admin/article/destroy', 'ArticleController@destroy')->name('api/admin/article/destroy');
```