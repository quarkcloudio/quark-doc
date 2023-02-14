# 资源

## 快速开始

资源（Resource）是 QuarkGO 中重要的组成部分，几乎所有的功能都是围绕着资源实现的；QuarkGo 的思想是约定大于配置，我们在资源里已经内置好各种功能的实现，开发者只需关注关键点的功能实现即可开发出完整的功能模块。

下面我们以内容管理为例，实现一个关于文章的 CURD 功能：
1. 首先我们以```github.com/quarkcms/quark-smart```命名模块，执行```go mod init github.com/quarkcms/quark-smart```命令，然后参照 [快速开始](./installation.html#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B) 章节，创建好 [main.go](https://github.com/quarkcms/quark-smart/blob/main/main.go) 文件；
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
3. 打开 models 目录，创建 [post.go](https://github.com/quarkcms/quark-smart/blob/main/internal/models/post.go) 模型文件；
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
5. 打开 resources 目录，创建 [post.go](https://github.com/quarkcms/quark-smart/blob/main/internal/admin/resources/post.go) 资源文件；
6. 在 post.go 资源文件中添加如下代码：

``` go
package resources

import (
	"github.com/quarkcms/quark-go/pkg/app/handler/admin/actions"
	"github.com/quarkcms/quark-go/pkg/app/handler/admin/searches"
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource"
	"github.com/quarkcms/quark-smart/internal/models"
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
7. 将资源注册到 [providers.go](https://github.com/quarkcms/quark-smart/blob/main/internal/admin/providers.go) 文件里，代码如下：

```go
package admin

import (
	"github.com/quarkcms/quark-smart/internal/admin/resources"
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
	adminproviders "github.com/quarkcms/quark-smart/internal/admin"
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

9. 重启服务后，我们打开 ```http://127.0.0.1:3000/admin/#/index?api=/api/admin/post/index``` 路径，你就可以看到文章的页面了；至此一个简单的 CURD 就完成了，完整的项目代码请打开 [Demo](https://github.com/quarkcms/quark-smart) 链接查看


## 模型

通过资源的`Model`属性，来绑定CURD操作的数据表：

``` go
// 初始化
func (p *Post) Init() interface{} {
	// 初始化模板
	p.TemplateInit()

	// 模型
	p.Model = &models.Post{}

	return p
}
```

## 页面标题

可以通过资源的`Title`属性设置页面标题：

``` go
// 初始化
func (p *Post) Init() interface{} {
	// 初始化模板
	p.TemplateInit()

	// 标题
	p.Title = "文章"

	return p
}
```

## 列表分页

通过资源的`PerPage`属性设置每页数量或者关闭分页，当值未设置时，即关闭了列表分页功能：

```go
// 初始化
func (p *Post) Init() interface{} {

	// 初始化模板
	p.TemplateInit()

	// 分页
	p.PerPage = 10

	return p
}
```

## 字段

### 概述

每个 QuarkGo 资源均包含一个`Fields`方法，用来组合页面的展示内容；Fields 提供了各种开箱即用的字段，包括文本输入、布尔、日期、文件上传等多种形式的控件。

要向资源添加字段，我们只需将它加入到资源的`Fields`方法内。此方法会接受几个参数，通常我们需传递一个数据库表对应的列名，以及列名展示的文字：
``` go

// 字段
func (p *Post) Fields(ctx *builder.Context) []interface{} {
	field := &builder.AdminField{}

	return []interface{}{
		field.ID("id", "ID"),
		field.Text("title", "标题"),
		field.Editor("content", "内容"),
	}
}

```

### 字段展示

你经常会在某些场景下只想显示某个字段。例如，你通常有一个在查询列表中无需显示的`Password`字段。同样地，你也想在「创建 / 更新表单」里只显示`created_at`字段。QuarkGo 可以轻松的控制字段的显示或隐藏。

下面的方法可以很好的控制字段在上下文里展示或隐藏：

- `HideFromIndex`     在列表页隐藏
- `HideFromDetail`    在详情页隐藏
- `HideWhenCreating`  在创建表单页隐藏
- `HideWhenUpdating`  在更新表单页隐藏
- `HideWhenExporting` 导出数据时隐藏
- `HideWhenImporting` 导入数据时隐藏
- `OnIndexShowing`    在列表页展示
- `OnDetailShowing`   在详情页展示
- `ShowOnCreating`    在创建表单页展示
- `ShowOnUpdating`    在更新表单页展示
- `ShowOnExporting`   导出数据时展示
- `ShowOnImporting`   导入数据时展示
- `OnlyOnIndex`       只在列表页展示
- `OnlyOnDetail`      只在详情页展示
- `OnlyOnForms`       只在表单页展示
- `OnlyOnExport`      只在导出数据时展示
- `OnlyOnImport`      只在导入数据时展示
- `ExceptOnForms`     除了表单页均展示

你可以在字段定义时链式调用这些方法，以指示 QuarkGo 在哪里可以显示 / 隐藏字段：

```go
field := &builder.AdminField{}
field.Editor("content", "内容").OnlyOnForms()
```

### 可编辑字段

当向资源添加一个字段时，你可以使用`SetEditable`方法指定列表上的字段为可编辑状态：

```go
field.Text("title", "标题").SetEditable(true)
```

### 设置默认值

可以通过`SetDefault`方法，给表单里的字段设置默认值：

```go
field.Text("title", "标题").SetDefault("hello world")
```

### 设置保存值

`SetValue`方法与`SetDefault`方法效果相似，不同的是当你点击重置表单的时候，会重置成`SetDefault`方法设置的值：
::: tip
注意：如果你同时使用`SetDefault()`方法和`SetValue()`方法给字段赋值，`SetValue()`方法设置的值会冲掉`SetDefault()`设置的值
:::
```go
field.Text("title", "标题").SetValue("hello world")
```

### 提示信息

可以通过`SetHelp`，`SetExtra`方法，给表单里的字段设置提示信息：

```go
field.Text("title", "标题").SetHelp("help tip")

// 或者
field.Text("title", "标题").SetExtra("help tip")
```

### 设置占位符

可以通过`SetPlaceholder`方法，设置表单里字段的占位符：

```go
field.Text("title", "标题").SetPlaceholder("请输入标题")
```

### 设置必填

通过`SetRequired`方法，设置表单字段为必填项：

```go
field.Text("title", "标题").SetRequired()
```

### 禁用字段

可以通过`SetDisabled`方法，禁用表单里的字段：

```go
field.Text("title", "标题").SetDisabled(true)
```

## 字段组件

QuarkGo 提供了丰富的字段组件，下面我们将详细介绍各种控件的使用方法。

### Hidden

`Hidden` 字段可以用于不需要展示，但是却需要提交的表单项，例如 `id`等：

```go
field.Hidden("id", "ID")
```

### ID

`ID` 专门用于id字段的展示：

```go
field.ID("id", "ID")
```

### Text

`Text` 字段提供了一个 `type` 属性为 `text` 的 `input` 字段：

```go
field.Text("title", "标题")

// 添加占位符
field.Text("title", "标题").SetPlaceholder("请输入标题")

// 带标签的 input，设置后置标签。例如：'http://'
field.Text("title", "标题").SetAddonAfter("http://")

// 带标签的 input，设置前置标签。例如：'.com'
field.Text("title", "标题").SetAddonBefore(".com")

// 最大长度
field.Text("title", "标题").SetMaxLength(20)

// 字段大小。注：标准表单内的输入框大小限制为 large。可选 large default small
field.Text("title", "标题").SetSize("default")

// 可以点击清除图标删除内容
field.Text("title", "标题").SetAllowClear(true)

// Field 的长度，我们归纳了常用的 Field 长度以及适合的场景，支持了一些枚举 "xs" , "s" , "m" , "l" , "x"
field.Text("title", "标题").SetWidth("xs")
```

### Textarea

`Textarea` 文本域字段：

```go
// 添加占位符
field.TextArea("content", "内容").SetPlaceholder("请输入内容")

// 行数
field.TextArea("content", "内容").SetMaxRows(10)

// 宽度
field.TextArea("content", "内容").SetWidth("xs")
```

### Radio

`Radio` 字段：

``` go
field.Radio("sex", "性别").
SetOptions(map[interface{}]interface{}{
    1: "男",
    2: "女",
}).SetDefault(1)
```

### Checkbox

`Checkbox` 字段：

``` go
field.Checkbox("role_ids", "角色").
SetOptions(map[interface{}]interface{}{
    1: "编辑",
    2: "运营",
	3: "业务",
}).SetDefault([1,2])
```

### Select

`Select` 字段：

``` go

// 单选模式
field.Select("category_id", "分类").
SetOptions(map[interface{}]interface{}{
    1: "新闻",
    2: "音乐",
	3: "体育",
}).SetDefault(1)

// 多选模式
field.Select("category_id", "分类").
SetMode("multiple").
SetOptions(map[interface{}]interface{}{
    1: "新闻",
    2: "音乐",
	3: "体育",
}).SetDefault([1,2])

// tags模式
field.Select("category_id", "分类").
SetMode("tags").
SetOptions(map[interface{}]interface{}{
    1: "新闻",
    2: "音乐",
	3: "体育",
}).SetDefault([1,2])
```

#### Select 组件联动

``` go

// 下拉框联动
Field::selects([
    // 下拉框联动
	field.Select("province", "省").
	SetOptions(map[interface{}]interface{}{
		1: "北京",
		2: "天津",
		3: "河北省",
	}).SetLoad("city","/api/admin/area/cities"),

    // 市
    Field::select("city", "市"),
]);
```

#### ```/api/admin/area/cities```接口返回数据格式

``` go
return []map[string]interface{}{
		{
			"label":"石家庄",
			"value":10,
		},
		{
			"label":"唐山",
			"value":11,
		},
	}
```

### Date

`Date` 字段提供一个 `SetPicker` 方法，来设置选择器类型：

``` go
field.Date("date", "日期")

// 周选择器，picker方法的参数为 date | week | month | quarter | year
field.Date("week", "周").SetPicker("week")
```

### DateRange
`DateRange` 字段提供一个 `SetPicker` 方法，来设置选择器类型：
``` go
field.DateRange("date", "日期")->value([]string{"2023-02-10","2023-02-12"})

// 周选择器，picker方法的参数为 date | week | month | quarter | year
field.DateRange("week", "周")->SetPicker("week")
```

### Datetime
``` go
field.Datetime("datetime", "日期时间")
```

### DatetimeRange
``` go
field.DatetimeRange("datetimeRange", "日期时间范围")
```

### Time
``` go
field.Time("time", "时间")
```