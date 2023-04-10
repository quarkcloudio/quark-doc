# 入门

## 开发环境
1. 如果您之前未搭建 Golang 开发环境，请先安装 Golang 环境。
2. 推荐使用最新版本的 Golang，或保证现有 Golang 版本 >= 1.18。小于 1.18 版本，可以自行尝试使用但不保障兼容性和稳定性。
3. 确保打开 go mod 支持 (Golang >= 1.18时，默认开启)。

## 快速开始
1. 在当前目录下创建 demo 文件夹，进入该目录中执行如下命令，初始化项目：
``` bash
go mod init demo/hello
```
2. 创建 main.go 文件
3. 在 main.go 文件中添加如下代码：

``` go
package main

import (
	"github.com/quarkcms/quark-go/pkg/app/handler/admin"
	"github.com/quarkcms/quark-go/pkg/app/install"
	"github.com/quarkcms/quark-go/pkg/app/middleware"
	"github.com/quarkcms/quark-go/pkg/builder"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// 数据库配置信息
	dsn := "root:Bc5HQFJc4bLjZCcC@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"

	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: admin.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}

	// 实例化对象
	b := builder.New(config)

	// 静态文件
	b.Static("/", "./website")

	// 自动构建数据库、拉取静态文件
	b.Use(install.Handle)

	// 后台中间件
	b.Use(middleware.Handle)

	// 响应Get请求
	b.GET("/", func(ctx *builder.Context) error {
		ctx.Write([]byte("hello world!"))

		return nil
	})

	// 启动服务
	b.Run(":3000")
}
```

## 拉取依赖
``` bash
# 第一步，创建vendor目录
go mod vendor
# 第二步，安装依赖:
go mod tidy
```

## 配置信息
在 main.go 代码中配置数据库相关信息：
``` go
dsn := "root:Bc5HQFJc4bLjZCcC@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"
```

替换 AppKey（请务必更改，且不可泄露）：
``` go
config := &builder.Config{
    AppKey:"Your App Key",
}
```
::: warning
注意：因为AppKey用于JWT加密，请务必更改！
:::

## 启动服务
``` bash
go run main.go
```

后台地址： http://127.0.0.1:3000/admin/

默认用户名：administrator 密码：123456

## 框架中使用

### Hertz框架
1. 首先确保 Hertz 框架安装成功
2. 在 main.go 文件中正确引入quark-go相关包
3. 在 main.go 文件中添加如下代码：

``` go
package main

import (
	"github.com/quarkcms/quark-go/pkg/adapter/hertzadapter"
	"github.com/quarkcms/quark-go/pkg/app/handler/admin"
	"github.com/quarkcms/quark-go/pkg/app/install"
	"github.com/quarkcms/quark-go/pkg/app/middleware"
	"github.com/quarkcms/quark-go/pkg/builder"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	h := server.Default()
	register(h)

	// 静态文件
	h.StaticFile("/admin/", "./website/admin/index.html")
	// 静态文件目录
	fs := &app.FS{Root: "./website", IndexNames: []string{"index.html"}}
	h.StaticFS("/", fs)
	// 数据库配置信息
	dsn := "root:yourpassword@tcp(127.0.0.1:3306)/yourdbname?charset=utf8&parseTime=True&loc=Local"
	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: admin.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}
	// 创建对象
	b := builder.New(config)
	// 初始化安装
	b.Use(install.Handle)
	// 中间件
	b.Use(middleware.Handle)
	// 适配hertz
	hertzadapter.Adapter(b, h)

	h.Spin()
}
```

### Gin框架
1. 首先确保 Gin 框架安装成功
2. 在 main.go 文件中正确引入quark-go相关包
3. 在 main.go 文件中添加如下代码：

``` go
package main

import (
	"github.com/quarkcms/quark-go/pkg/adapter/ginadapter"
	"github.com/quarkcms/quark-go/pkg/app/handler/admin"
	"github.com/quarkcms/quark-go/pkg/app/install"
	"github.com/quarkcms/quark-go/pkg/app/middleware"
	"github.com/quarkcms/quark-go/pkg/builder"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	r := gin.Default()
    
	// 静态文件
	r.Use(static.Serve("/", static.LocalFile("./website", false)))
	// 数据库配置信息
	dsn := "root:Bc5HQFJc4bLjZCcC@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"
	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: admin.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}
	// 创建对象
	b := builder.New(config)
	// 初始化安装
	b.Use(install.Handle)
	// 中间件
	b.Use(middleware.Handle)
	// 适配gin
	ginadapter.Adapter(b, r)

	r.Run(":3000")
}
```

### Fiber框架
1. 首先确保 Fiber 框架安装成功
2. 在 main.go 文件中正确引入quark-go相关包
3. 在 main.go 文件中添加如下代码：

``` go
package main

import (
	"github.com/quarkcms/quark-go/pkg/adapter/fiberadapter"
	"github.com/quarkcms/quark-go/pkg/app/handler/admin"
	"github.com/quarkcms/quark-go/pkg/app/install"
	"github.com/quarkcms/quark-go/pkg/app/middleware"
	"github.com/quarkcms/quark-go/pkg/builder"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	app := fiber.New()

	// 将/admin重定向到/admin/
	app.Use("/admin", func(c *fiber.Ctx) error {
		originalUrl := c.OriginalURL()
		if !strings.HasSuffix(originalUrl, "/") && !strings.Contains("originalUrl", ".") {
			return c.Redirect(originalUrl + "/")
		}
		return c.Next()
	})
	// 静态资源
	app.Static("/", "./website", fiber.Static{
		Compress:      true,
		ByteRange:     true,
		Browse:        false,
		Index:         "index.html",
		CacheDuration: 1 * time.Second,
		MaxAge:        3600,
	})
	// 数据库配置信息
	dsn := "root:Bc5HQFJc4bLjZCcC@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"
	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: admin.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}
	// 创建对象
	b := builder.New(config)
	// 初始化安装
	b.Use(install.Handle)
	// 中间件
	b.Use(middleware.Handle)
	// 适配fiber
	fiberadapter.Adapter(b, app)

	app.Listen(":3000")
}
```

### Zero框架
1. 首先确保 Zero 框架安装成功
2. 在 main.go 文件中正确引入quark-go相关包
3. 在 main.go 文件中添加如下代码：

``` go
package main

import (
	"github.com/quarkcms/quark-go/pkg/adapter/zeroadapter"
	"github.com/quarkcms/quark-go/pkg/app/handler/admin"
	"github.com/quarkcms/quark-go/pkg/app/install"
	"github.com/quarkcms/quark-go/pkg/app/middleware"
	"github.com/quarkcms/quark-go/pkg/builder"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)

	server := rest.MustNewServer(c.RestConf)
	defer server.Stop()

	// 加载静态文件
	staticFile("/", "./website", server)
	ctx := svc.NewServiceContext(c)
	handler.RegisterHandlers(server, ctx)
	// 数据库配置信息
	dsn := "root:Bc5HQFJc4bLjZCcC@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"
	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: admin.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}
	// 创建对象
	b := builder.New(config)
	// 初始化安装
	b.Use(install.Handle)
	// 中间件
	b.Use(middleware.Handle)
	// 适配gozero
	zeroadapter.Adapter(b, server)

	fmt.Printf("Starting server at %s:%d...\n", c.Host, c.Port)
	server.Start()
}

// 加载静态文件
func staticFile(root string, dirPath string, server *rest.Server) {
	rd, _ := ioutil.ReadDir(dirPath)
	for _, f := range rd {
		fileName := f.Name()
		subPath := root + fileName + "/"
		subDirPath := dirPath + "/" + fileName
		if isDir(subDirPath) {
			staticFile(subPath, subDirPath, server)
		}
	}
	server.AddRoute(
		rest.Route{
			Method:  http.MethodGet,
			Path:    root + ":file",
			Handler: http.StripPrefix(root, http.FileServer(http.Dir(dirPath))).ServeHTTP,
		},
	)
}

// 判断所给路径是否为文件夹
func isDir(path string) bool {
	s, err := os.Stat(path)
	if err != nil {
		return false
	}
	return s.IsDir()
}
```