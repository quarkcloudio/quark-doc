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
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/service"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/install"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/middleware"
	"github.com/quarkcms/quark-go/v2/pkg/builder"
	"github.com/glebarez/sqlite""
	"gorm.io/gorm"
)

func main() {

	// 配置资源
	config := &builder.Config{

		// JWT加密密串
		AppKey:    "123456",

		// 加载服务
		Providers: service.Providers,

		// 数据库配置
		DBConfig: &builder.DBConfig{
			Dialector: sqlite.Open("./data.db"),
			Opts:      &gorm.Config{},
		},
	}

	// 实例化对象
	b := builder.New(config)

	// WEB根目录
	b.Static("/", "./web/app")

	// 自动构建数据库、拉取静态文件
	install.Handle()

	// 后台中间件
	b.Use(middleware.Handle)

	// 响应Get请求
	b.GET("/", func(ctx *builder.Context) error {
		return ctx.String(200, "Hello World!")
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
DBConfig: &builder.DBConfig{
	Dialector: sqlite.Open("./data.db"),
	Opts:      &gorm.Config{},
},
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
	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/app/server"
	"github.com/quarkcms/quark-go/v2/pkg/adapter/hertzadapter"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/install"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/middleware"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/service"
	"github.com/quarkcms/quark-go/v2/pkg/builder"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	h := server.Default(server.WithHostPorts(":3000"))

	// 注册路由
	register(h)

	// 静态文件
	h.StaticFile("/admin/", "./web/app/admin/index.html")

	// WEB根目录
	fs := &app.FS{Root: "./web/app", IndexNames: []string{"index.html"}}
	h.StaticFS("/", fs)

	// 数据库配置信息
	dsn := "root:fK7xPGJi1gJfIief@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"

	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: service.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}

	// 创建对象
	b := builder.New(config)

	// 初始化安装
	install.Handle()

	// 中间件
	b.Use(middleware.Handle)

	// 适配hertz
	hertzadapter.Adapter(b, h)

	// 启动服务
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
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/quarkcms/quark-go/v2/pkg/adapter/ginadapter"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/install"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/middleware"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/service"
	"github.com/quarkcms/quark-go/v2/pkg/builder"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	r := gin.Default()

	// WEB根目录
	r.Use(static.Serve("/", static.LocalFile("./web/app", false)))

	// 数据库配置信息
	dsn := "root:fK7xPGJi1gJfIief@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"

	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: service.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}

	// 创建对象
	b := builder.New(config)

	// 初始化安装
	install.Handle()

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
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/quarkcms/quark-go/v2/pkg/adapter/fiberadapter"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/install"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/middleware"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/service"
	"github.com/quarkcms/quark-go/v2/pkg/builder"
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

	// WEB根目录
	app.Static("/", "./web/app", fiber.Static{
		Compress:      true,
		ByteRange:     true,
		Browse:        false,
		Index:         "index.html",
		CacheDuration: 1 * time.Second,
		MaxAge:        3600,
	})

	// 数据库配置信息
	dsn := "root:fK7xPGJi1gJfIief@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"

	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: service.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}

	// 创建对象
	b := builder.New(config)

	// 初始化安装
	install.Handle()

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
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/quarkcms/quark-go/v2/examples/zeroadmin/internal/config"
	"github.com/quarkcms/quark-go/v2/examples/zeroadmin/internal/handler"
	"github.com/quarkcms/quark-go/v2/examples/zeroadmin/internal/svc"
	"github.com/quarkcms/quark-go/v2/pkg/adapter/zeroadapter"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/install"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/middleware"
	"github.com/quarkcms/quark-go/v2/pkg/app/admin/service"
	"github.com/quarkcms/quark-go/v2/pkg/builder"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/rest"
)

var configFile = flag.String("f", "etc/zeroadmin-api.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)

	server := rest.MustNewServer(c.RestConf)
	defer server.Stop()

	// WEB根目录
	staticFile("/", "./web/app", server)

	ctx := svc.NewServiceContext(c)
	handler.RegisterHandlers(server, ctx)

	// 数据库配置信息
	dsn := "root:fK7xPGJi1gJfIief@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"

	// 配置资源
	config := &builder.Config{
		AppKey:    "123456",
		Providers: service.Providers,
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},
	}

	// 创建对象
	b := builder.New(config)

	// 初始化安装
	install.Handle()

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