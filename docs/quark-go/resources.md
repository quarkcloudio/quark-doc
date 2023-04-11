# 资源

## 概述

资源（Resource）是 QuarkGO 中重要的组成部分，几乎所有的功能都是围绕着资源实现的；QuarkGo 的思想是约定大于配置，我们在资源里已经内置好各种功能的实现，开发者只需关注关键点的功能实现即可开发出完整的功能模块。

## 快速开始

下面我们以内容管理为例，实现一个关于文章的 CURD 功能：
1. 首先我们以```github.com/quarkcms/quark-smart```命名模块，执行```go mod init github.com/quarkcms/quark-smart```命令，然后参照 [快速开始](./installation.html#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B) 章节，创建好 [main.go](https://github.com/quarkcms/quark-smart/blob/main/main.go) 文件；
2. 根据约定创建如下目录（也可自由命名）：
~~~
www                         WEB部署目录
├─internal                  业务目录
│  ├─admin				    后台业务目录
│  │  ├─action				行为目录
│  │  ├─dashboard			仪表盘资源目录
│  │  ├─metric      		仪表盘指标目录
│  │  ├─resource         	资源目录
│  │  ├─searche             搜索目录
│  │  └─provider.go         服务注册文件
│  └─model                  Gorm模型文件目录
│
├─website                   静态文件目录（对外访问）
└─main.go                   主文件
~~~
3. 打开 model 目录，创建 [post.go](https://github.com/quarkcms/quark-smart/blob/main/internal/model/post.go) 模型文件；
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
5. 打开 resource 目录，创建 [article.go](https://github.com/quarkcms/quark-smart/blob/main/internal/admin/resource/article.go) 资源文件；
6. 在 article.go 资源文件中添加如下代码：

``` go
package resource

import (
	"time"

	"github.com/quarkcms/quark-go/pkg/app/handler/admin/actions"
	"github.com/quarkcms/quark-go/pkg/app/handler/admin/searches"
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource"
	"github.com/quarkcms/quark-go/pkg/component/admin/form/rule"
	"github.com/quarkcms/quark-smart/internal/admin/search"
	"github.com/quarkcms/quark-smart/internal/model"
	"gorm.io/gorm"
)

type Article struct {
	adminresource.Template
}

// 初始化
func (p *Article) Init() interface{} {

	// 初始化模板
	p.TemplateInit()

	// 标题
	p.Title = "文章"

	// 模型
	p.Model = &model.Post{}

	// 分页
	p.PerPage = 10

	return p
}

func (p *Article) Fields(ctx *builder.Context) []interface{} {
	field := &adminresource.Field{}

	return []interface{}{
		field.ID("id", "ID"),

		field.Text("title", "标题").
			SetRules([]*rule.Rule{
				rule.Required(true, "标题必须填写"),
			}),

		field.Editor("content", "内容").OnlyOnForms(),

		field.Datetime("created_at", "发布时间"),

		field.Switch("status", "状态").
			SetTrueValue("正常").
			SetFalseValue("禁用").
			OnlyOnForms(),
	}
}

// 搜索
func (p *Article) Searches(ctx *builder.Context) []interface{} {

	return []interface{}{
		(&searches.Input{}).Init("title", "标题"),
		(&searches.Status{}).Init(),
		(&searches.DateTimeRange{}).Init("created_at", "创建时间"),
	}
}

// 行为
func (p *Article) Actions(ctx *builder.Context) []interface{} {

	return []interface{}{
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

// 创建页面显示前回调
func (p *Article) BeforeCreating(ctx *builder.Context) map[string]interface{} {

	// 表单初始化数据
	data := map[string]interface{}{
		"created_at": time.Now().Format("2006-01-02 15:04:05"),
		"status":     true,
	}

	return data
}
```
7. 将资源注册到 [provider.go](https://github.com/quarkcms/quark-smart/blob/main/internal/admin/provider.go) 文件里，代码如下：

```go
package admin

import (
	"github.com/quarkcms/quark-smart/internal/admin/resource"
)

// 注册服务
var Providers = []interface{}{
	&resource.Article{},
}

```
8. 修改 main.go 主文件，引入 provider.go包，代码如下：
```go
package main

import (
	"github.com/quarkcms/quark-go/pkg/app/handler/admin"
	"github.com/quarkcms/quark-go/pkg/app/install"
	"github.com/quarkcms/quark-go/pkg/app/middleware"
	"github.com/quarkcms/quark-go/pkg/builder"
	adminprovider "github.com/quarkcms/quark-smart/internal/admin"
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
		Providers: append(admin.Providers, adminprovider.Providers...),
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
	install.Handle()

	// 后台中间件
	b.Use(middleware.Handle)

	// 启动服务
	b.Run(":3000")
}

```

9. 重启服务后，我们打开 ```http://127.0.0.1:3000/admin/#/index?api=/api/admin/article/index``` 路径，你就可以看到文章的页面了；至此一个简单的 CURD 就完成了，完整的项目代码请打开 [Demo](https://github.com/quarkcms/quark-smart) 链接查看


## 模型

通过资源的`Model`属性，来绑定CURD操作的数据表：

``` go
// 初始化
func (p *Article) Init() interface{} {
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
func (p *Article) Init() interface{} {
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
func (p *Article) Init() interface{} {

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
func (p *Article) Fields(ctx *builder.Context) []interface{} {
	field := &adminresource.Field{}

	return []interface{}{
		field.ID("id", "ID"),
		field.Text("title", "标题"),
		field.Editor("content", "内容"),
	}
}

```

### 展示位置

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
field := &adminresource.Field{}
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
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/fields/radio")

field.Radio("sex", "性别").
	SetOptions([]*radio.Option{
		{Value: 1, Label: "男"},
		{Value: 2, Label: "女"},
	}).SetDefault(1)
```

### Checkbox

`Checkbox` 字段：

``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/fields/checkbox")

field.Checkbox("role_ids", "角色").
	SetOptions([]*checkbox.Option{
		{Value: 1, Label: "编辑"},
		{Value: 2, Label: "运营"},
		{Value: 3, Label: "业务"},
	}).SetDefault([1,2])
```

### Select

`Select` 字段：

``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/fields/selectfield")

// 单选模式
field.Select("category_id", "分类").
SetOptions([]*selectfield.Option{
		{Value: 1, Label: "新闻"},
		{Value: 2, Label: "音乐"},
		{Value: 3, Label: "体育"},
	}).SetDefault(1)

// 多选模式
field.Select("category_id", "分类").
SetMode("multiple").
SetOptions([]*selectfield.Option{
		{Value: 1, Label: "新闻"},
		{Value: 2, Label: "音乐"},
		{Value: 3, Label: "体育"},
	}).SetDefault([1,2])

// tags模式
field.Select("category_id", "分类").
SetMode("tags").
SetOptions([]*selectfield.Option{
		{Value: 1, Label: "新闻"},
		{Value: 2, Label: "音乐"},
		{Value: 3, Label: "体育"},
	}).SetDefault([1,2])
```

#### Select 组件联动

``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/fields/selectfield")

// 下拉框联动
Field::selects([
    // 下拉框联动
	field.Select("province", "省").
	SetOptions([]*selectfield.Option{
		{Value: 1, Label: "北京"},
		{Value: 2, Label: "天津"},
		{Value: 3, Label: "河北省"},
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

### TimeRange
``` go
field.Time("time", "时间")->SetFormat("HH:mm")
```

### Week
``` go
field.Week("week", "周")
```

### Month
``` go
field.Month("month", "月")
```

### Quarter
``` go
field.Quarter("quarter", "季度")
```

### Year
``` go
field.Year("year", "年")
```

### Number
``` go
field.Number("num", "数量")

// 设置最大值
field.Number("num", "数量").SetMax(100)

// 设置最小值
field.Number("num", "数量").SetMin(10)

// 步进值
field.Number("num", "数量").SetStep(1)
```

### Editor
``` go
field.Editor("content", "内容").SetHeight(500).SetWidth(600)
```

### Switch
SetTrueValue 和 SetFalseValue 对应开关的两个值 `true` 和 `false`:
``` go
field.Switch("status", "状态").
	SetTrueValue("正常").
	SetFalseValue("禁用").
	SetEditable(true).
	SetDefault(true)
```

### Display
只显示文字，不做任何操作：
``` go
field.Display("这是一条展示信息")
```

### Icon
``` go
field.Icon("icon", "图标")
```

### Cascader
``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/fields/cascader")

options := []*cascader.Option{
	{
		Value :"zhejiang",
		Label:"Zhejiang",
		Children : []*cascader.Option{
			{
				Value:"hangzhou",
				Label:"Hangzhou",
			},
		},
	},
}

field.Cascader("address", "地址").SetOptions(options)

// 通过isLeaf属性设定是否有下一级
options1 := []*cascader.Option{
	{
		Value :"zhejiang",
		Label:"Zhejiang",
		IsLeaf:false,
	},
	{
		Value :"hebei",
		Label:"hebei",
		IsLeaf:false,
	},
}

// 通过ajax获取数据
field.Cascader("address", "地址").SetOptions(options1).SetApi("/api/admin/area/suggest")
```

#### 接口代码返回数据
``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/fields/cascader")

return []*cascader.Option{
	{
		Value :"zhejiang",
		Label:"Zhejiang",
		IsLeaf:false,
	},
	{
		Value :"hebei",
		Label:"hebei",
		IsLeaf:false,
	},
}
```

### Search
``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/fields/search")

// 单选模式
field.Search("category_id", "分类").
SetOptions([]*search.Option{
	{Value: 1, Label: "新闻"},
	{Value: 2, Label: "音乐"},
	{Value: 3, Label: "体育"},
}).SetDefault(1)

// 多选模式
field.Search("category_id", "分类").
SetMode("multiple").
SetOptions([]*search.Option{
	{Value: 1, Label: "新闻"},
	{Value: 2, Label: "音乐"},
	{Value: 3, Label: "体育"},
}).SetDefault([1,2])


// 通过ajax获取数据
field.Search("category_id", "分类").SetApi("/api/category/suggest")
```

#### 接口返回数据
``` go
return []*search.Option{
	{Value: 1, Label: "新闻"},
	{Value: 2, Label: "音乐"},
	{Value: 3, Label: "体育"},
}
```

### Tree
``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/fields/tree")

data := []*tree.Option{
	{
		Value :"zhejiang",
		Title:"Zhejiang",
	},
	{
		Value :"hebei",
		Title:"hebei",
	},
	Children : []*tree.Option{
		{
			Value:"hangzhou",
			Title:"Hangzhou",
		},
	},
}

field.Tree("tree", "树形组件").SetData(data)
```

### Map
``` go
longitude := "116.397724"
latitude := "39.903755"

field.Map("map", "地图组件").SetPosition(longitude, latitude).SetStyle(map[string]interface{}{"width": "100%", "height": 400})
```

### Geofence

``` go

field.Geofence("geofence", "地理围栏组件")
```

### Image

``` go

field.Image("image", "图片上传组件")

// 多图上传，默认数据库保存json格式数据，model可选 'multiple' | 'single' 或者缩写 'm' | 's'
field.Image("image", "图片上传组件").SetMode("multiple")

// 上传button文字
field.Image("image", "图片上传组件").SetButton("上传图片")

// 上传数量限制，默认3个文件
field.Image("image", "图片上传组件").SetLimitNum(4)

// 上传文件大小限制，默认2M
field.Image("image", "图片上传组件").SetLimitSize(20)

// 上传文件类型限制，类型支持后缀方式，例如[]string{"jpeg","png"}这样的数组也是可以的
field.Image("image", "图片上传组件").SetLimitType([]string{"image/jpeg","image/png"})

// 上传尺寸限制，第一个参数是显的宽度，第二个参数是限定的高度
field.Image("image", "图片上传组件").SetLimitWH(200，200)
```

### File
``` go
field.File("file", "文件上传组件")

// 上传button文字
field.File("file", "文件上传组件").SetButton("上传附件")

// 上传数量限制，默认3个文件
field.File("file", "文件上传组件").SetLimitNum(4)

// 上传文件大小限制，默认2M
field.File("file", "文件上传组件").SetLimitSize(20)

// 上传文件类型限制，类型支持后缀方式，例如[]string{"jpeg","png"}这样的数组也是可以的
field.File("file", "文件上传组件").SetLimitType([]string{"image/jpeg","image/png"})
```

### List

嵌套表单字段

``` go
field.
	List("list", "嵌套表单组件").
	SetButton("添加数据","bottom").
	SetItem(func () interface{} {
		return field.Text("title", "标题")
	})

// 实例
field.
	List("list", "嵌套表单组件").
	SetButton("添加数据","bottom").
	SetItem(func () interface{} {

		return field.Group([]interface{}{
			field.Text("title", "标题"),
			field.Number("num","奖品数量"),
			Field.Number("probability","中奖概率"),
		})
	})
```

## 表单联动
表单联动是指，在选择表单项的指定的选项时，联动显示其他的表单项。

### 文本组件联动
``` go
field.Text("name", "姓名").SetWhen("yangguo", func () interface{} {
	return field.Text("title", "职位")
})
```

### 单选组件联动
``` go
field.Radio("nationality", "国籍").
SetOptions([]*radio.Option{
		{Value: 1, Label: "本国"},
		{Value: 2, Label: "外国"},
	}).
SetWhen(1, func () interface{} {
	return []interface{}{
        field.Text("name", "姓名"),
        field.Text("idcard", "身份证"),
    }
}).
SetWhen(2, func () interface{} {
	return []interface{}{
        field.Text("name", "姓名"),
        field.Text("passport", "护照"),
    }
})
```

上例中，方法`SetWhen(1, callback)`等效于`SetWhen("=", 1, callback)`, 如果用操作符`=`，则可以省略这个参数，同时也支持这些操作符 `=`、`>`、`>=`、`<`、`<=`、`!=`、`in`、`notIn` 使用方法如下：

``` go
field.Radio("check", "选择").
SetWhen(">", 1, func () interface{} {

}).
SetWhen(">=", 2, func () interface{} {

}).
SetWhen("in", []int[5, 6], func () interface{} {

}).
SetWhen("notIn", []int[7, 8], func () interface{} {

})
```

## 表单验证

### 通用规则
Form 组件提供了类似PHP中Laravel框架的验证规则来验证表单提交的数据：
``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/rule")

field.Text("title", "标题").
SetRules([]*rule.Rule{
	rule.Required(true, "用户名必须填写"),
	rule.Min(6, "用户名不能少于6个字符"),
	rule.Max(20, "用户名不能超过20个字符"),
})
```

### 创建页规则
创建页面规则，只在创建表单提交时生效
``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/rule")

field.Text("username", "用户名").
creationRules([]*rule.Rule{
	rule.Unique("admins", "username", "用户名已存在"),
})
```

### 编辑页规则
更新页面规则，只在更新表单提交时生效
``` go

field.Text("username", "用户名").
updateRules([]*rule.Rule{
	rule.Unique("admins", "username", "{id}", "用户名已存在"),
})
```

### 数据库unique检查
一个比较常见的场景是提交表单是检查数据是否已经存在，可以使用下面的方式：
``` go
import ("github.com/quarkcms/quark-go/pkg/component/admin/form/rule")

field.Text("username", "用户名").
creationRules([]*rule.Rule{
	rule.Unique("admins", "username", "用户名已存在"),
}).
updateRules([]*rule.Rule{
	rule.Unique("admins", "username", "{id}", "用户名已存在"),
})
```

## 回调函数

quarkgo 提供了丰富的回调函数，用来重写数据已经自定义反馈等操作

- `BeforeIndexShowing`    	列表页展示前回调
- `BeforeExporting`     	数据导出前回调
- `BeforeImporting`    		数据导入前回调
- `BeforeDetailShowing`    	详情页展示前回调
- `BeforeCreating`  		创建页显示前回调
- `BeforeEditing`  			编辑页显示前回调
- `BeforeSaving` 			表单数据保存前回调
- `AfterSaved` 				表单数据保存后回调

### 列表展示前回调

可以通过此方法重写列表数据；下面的示例是将列表转换成tree型数据返回给前端组件

``` go
import (
	"github.com/quarkcms/quark-go/pkg/lister"
)

func (p *Menu) BeforeIndexShowing(ctx *builder.Context, list []map[string]interface{}) []interface{} {
	// 转换成树形表格
	tree, _ := lister.ListToTree(list, "id", "pid", "children", 0)

	return tree
}
```

### 数据导出前回调

可以通过此方法重写导出数据

``` go
func (p *Menu) BeforeExporting(ctx *builder.Context, list []map[string]interface{}) []interface{} {
	result := []interface{}{}
	for _, v := range list {
		result = append(result, v)
	}

	return result
}
```

### 数据导入前回调

可以通过此方法重写导入数据

``` go
func (p *Menu) BeforeImporting(ctx *builder.Context, list [][]interface{}) [][]interface{} {
	return list
}
```

### 详情页显示前回调

可以通过此方法重写详情页数据

``` go
func (p *Menu) BeforeDetailShowing(ctx *builder.Context, data map[string]interface{}) map[string]interface{} {
	return data
}
```

### 创建页显示前回调

可以通过此方法初始化表单数据

``` go
func (p *Menu) BeforeCreating(ctx *builder.Context) map[string]interface{} {
	return map[string]interface{}{}
}
```

### 编辑页显示前回调

可以通过此方法可以重写编辑页数据

``` go
func (p *Menu) BeforeEditing(request *builder.Context, data map[string]interface{}) map[string]interface{} {
	return data
}
```

### 表单数据保存前回调

可以通过此方法可以自定义表单数据

``` go
func (p *Menu) BeforeSaving(ctx *builder.Context, submitData map[string]interface{}) (map[string]interface{}, error) {
	return submitData, nil
}
```

### 表单数据保存后回调

可以通过此方法可以自定义表单提交成功后的其他操作

``` go
func (p *Menu) AfterSaved(ctx *builder.Context, id int, data map[string]interface{}, result *gorm.DB) interface{} {
	if result.Error != nil {
		return ctx.JSON(200, msg.Error(result.Error.Error(), ""))
	}

	return ctx.JSON(
		200,
		msg.Success("操作成功！", strings.Replace("/index?api="+IndexRoute, ":resource", ctx.Param("resource"), -1), ""),
	)
}
```