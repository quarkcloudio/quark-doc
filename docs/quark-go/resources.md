# 资源

## 基础

资源（Resource）是 QuarkGO 中重要的组成部分，几乎所有的功能都是围绕着资源实现的；QuarkGo 的思想是约定大于配置，我们在资源里已经内置好各种功能的实现，开发者只需关注关键点的功能实现即可开发出完整的功能模块。

下面我们以内容管理为例，实现一个关于文章的 CURD 功能：
1. 首先我们以```github.com/quarkcms/quark-simple```命名模块，执行```go mod init github.com/quarkcms/quark-simple```命令，然后参照 [快速开始](./installation.html#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B) 章节，创建好 [main.go](https://github.com/quarkcms/quark-simple/blob/main/main.go) 文件；
2. 根据约定创建如下目录（也可自由命名）：
~~~
www                         WEB部署目录
├─internal                  业务目录
│  ├─admin				    后台业务目录
│  │  ├─actions				行为目录
│  │  ├─dashboards			仪表盘资源目录
│  │  ├─metrics       		仪表盘指标目录
│  │  ├─resources         	资源目录
│  │  ├─searches            搜索目录
│  │  └─providers.go        服务注册文件
│  │
│  └─models                 Gorm模型文件目录
│
├─website                   静态文件目录（对外访问）
└─main.go                   主文件
~~~
3. 打开 models 目录，创建 [post.go](https://github.com/quarkcms/quark-simple/blob/main/internal/models/post.go) 模型文件
4. 在 post.go 模型文件中添加如下代码：

``` go
package models

import (
	"time"

	"gorm.io/gorm"
)

// 字段
type Post struct {
	Id        int            `json:"id" gorm:"autoIncrement"`
	Title     string         `json:"title" gorm:"size:200;not null"`
	Content   string         `json:"content" gorm:"size:5000"`
	Status    int            `json:"status" gorm:"size:1;not null;default:1"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}
```
5. 打开 resources 目录，创建 [post.go](https://github.com/quarkcms/quark-simple/blob/main/internal/admin/resources/post.go) 资源文件
6. 在 post.go 资源文件中添加如下代码：

``` go
package resources

import (
	"github.com/quarkcms/quark-go/pkg/app/handler/admin/actions"
	"github.com/quarkcms/quark-go/pkg/app/handler/admin/searches"
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource"
	"github.com/quarkcms/quark-simple/internal/models"
)

type Post struct {
	adminresource.Template
}

// 初始化
func (p *Post) Init() interface{} {

	// 初始化模板
	p.TemplateInit()

	// 标题
	p.Title = "文章"

	// 模型
	p.Model = &models.Post{}

	// 分页
	p.PerPage = 10

	p.WithExport = true

	return p
}

// 字段
func (p *Post) Fields(ctx *builder.Context) []interface{} {

	field := &builder.AdminField{}

	return []interface{}{
		field.ID("id", "ID"),

		field.Text("title", "标题").
			SetRules(
				[]string{
					"required",
				},
				map[string]string{
					"required": "标题必须填写",
				},
			),

		field.Editor("content", "内容").OnlyOnForms(),

		field.Switch("status", "状态").
			SetTrueValue("正常").
			SetFalseValue("禁用").
			SetEditable(true).
			SetDefault(true),
	}
}

// 搜索
func (p *Post) Searches(ctx *builder.Context) []interface{} {

	return []interface{}{
		(&searches.Input{}).Init("title", "标题"),
		(&searches.Status{}).Init(),
		(&searches.DateTimeRange{}).Init("created_at", "创建时间"),
	}
}

// 行为
func (p *Post) Actions(ctx *builder.Context) []interface{} {

	return []interface{}{
		(&actions.Import{}).Init(),
		(&actions.CreateLink{}).Init(p.Title),
		(&actions.Delete{}).Init("批量删除"),
		(&actions.Disable{}).Init("批量禁用"),
		(&actions.Enable{}).Init("批量启用"),
		(&actions.EditLink{}).Init("编辑"),
		(&actions.Delete{}).Init("删除"),
		(&actions.FormSubmit{}).Init(),
		(&actions.FormReset{}).Init(),
		(&actions.FormBack{}).Init(),
		(&actions.FormExtraBack{}).Init(),
	}
}
```
7. 将资源注册到 [providers.go](https://github.com/quarkcms/quark-simple/blob/main/internal/admin/providers.go) 文件里，代码如下：

```go
package admin

import (
	"github.com/quarkcms/quark-simple/internal/admin/resources"
)

// 注册服务
var Providers = []interface{}{
	&resources.Post{},
}

```
8. 修改 main.go 主文件，引入 providers.go包，代码如下：
```go
package main

import (
	"github.com/quarkcms/quark-go/pkg/app/handler/admin"
	"github.com/quarkcms/quark-go/pkg/app/install"
	"github.com/quarkcms/quark-go/pkg/app/middleware"
	"github.com/quarkcms/quark-go/pkg/builder"
	adminproviders "github.com/quarkcms/quark-simple/internal/admin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// 数据库配置信息
	dsn := "root:Bc5HQFJc4bLjZCcC@tcp(127.0.0.1:3306)/quarkgo?charset=utf8&parseTime=True&loc=Local"

	// 配置资源
	config := &builder.Config{
		AppKey: "123456",
		DBConfig: &builder.DBConfig{
			Dialector: mysql.Open(dsn),
			Opts:      &gorm.Config{},
		},

        // ******* 将引入的服务注册到系统里 code start *******
		Providers: append(admin.Providers, adminproviders.Providers...),
        // ******* 将引入的服务注册到系统里 code end *******
		AdminLayout: &builder.AdminLayout{
			Title: "QuarkSimple",
		},
	}

	// 实例化对象
	b := builder.New(config)

	// 静态文件目录
	b.Static("/", "./website")

	// 构建quarkgo基础数据库、拉取静态文件
	b.Use(install.Handle)

	// 构建本项目数据库
	b.Use(database.Handle)

	// 后台中间件
	b.Use(middleware.Handle)

	// 启动服务
	b.Run(":3000")
}

```

9. 重启服务后，我们打开 ```http://127.0.0.1:3000/admin/#/index?api=/api/admin/post/index``` 路径，你就可以看到文章的页面了；至此一个简单的 CURD 就完成了，完整的项目代码请打开 [Demo](https://github.com/quarkcms/quark-simple) 链接查看