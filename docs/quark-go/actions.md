# 行为

## 概述

在页面展示中我们会有各种对数据的操作，例如：提交表单、删除、修改数据、跳转链接等，我们统称这些操作为行为；quarkgo 内置了较为全面的行为组件，来方便开发者进行各种类型的数据操作。

## 快速开始
1. 首先找到`/www/internal/admin/action`目录，进入该目录中
2. 创建 create_link.go 文件
3. 在 create_link.go 文件中添加如下代码：

``` go
package action

import (
	"strings"

	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
)

type CreateLink struct {
	actions.Link
}

// 初始化
func (p *CreateLink) Init(name string) *CreateLink {
	// 初始化父结构
	p.ParentInit()

	// 类型
	p.Type = "primary"

	// 图标
	p.Icon = "plus-circle"

	// 文字
	p.Name = "创建" + name

	// 设置展示位置
	p.SetOnlyOnIndex(true)

	return p
}

// 跳转链接
func (p *CreateLink) GetHref(ctx *builder.Context) string {
	return "#/index?api=" + strings.Replace(ctx.Path(), "/index", "/create", -1)
}
```

4. 将 create_link.go 注册到对应的资源中，我们以 [post.go](https://github.com/quarkcms/quark-smart/blob/main/internal/admin/resources/post.go) 为例，代码如下：
``` go
// 引入包，这里省略其他代码 ...
import (
	"github.com/quarkcms/quark-smart/internal/admin/actions"
)

// 行为
func (p *Post) Actions(ctx *builder.Context) []interface{} {
	return []interface{}{
		(&actions.CreateLink{}).Init(p.Title),
	}
}

// 省略其他代码 ...
```

5. 重启服务后，就可以在文章列表的操作栏中看到`创建文章`的跳转按钮了。

## 行为按钮样式

``` go

// 初始化
func (p *CreateLink) Init(name string) *CreateLink {

	// 初始化父结构
	p.ParentInit()

	// 设置按钮类型，primary | ghost | dashed | link | text | default
	p.Type = "primary"

    // 设置按钮大小,large | middle | small | default
    p.Size= "default"

	// 图标
	p.Icon = "plus-circle"

	// 文字
	p.Name = "创建" + name

	return p
}
```

## 展示位置

- `SetOnlyOnIndex`                  只在列表页展示
- `SetExceptOnIndex`                除了列表页外展示
- `SetOnlyOnForm`                   只在表单页展示
- `SetExceptOnForm`                 除了表单页外展示
- `SetOnlyOnFormExtra`              只在表单页右上角自定义区域展示
- `SetExceptOnFormExtra`            除了表单页右上角自定义区域外展示
- `SetOnlyOnDetail`                 只在详情页展示
- `SetExceptOnDetail`               除了详情页外展示
- `SetOnlyOnDetailExtra`            只在详情页右上角自定义区域展示
- `SetExceptOnDetailExtra`          除了详情页右上角自定义区域外展示
- `SetOnlyOnIndexTableRow`          在表格行内展示
- `SetExceptOnIndexTableRow`        除了表格行内外展示
- `SetOnlyOnIndexTableAlert`        在表格多选弹出层展示
- `SetExceptOnIndexTableAlert`      除了表格多选弹出层外展示
- `SetShowOnIndex`                  在列表页展示
- `SetShowOnForm`                   在表单页展示
- `SetShowOnFormExtra`              在表单页右上角自定义区域展示
- `SetShowOnDetail`                 在详情页展示
- `SetShowOnDetailExtra`            在详情页右上角自定义区域展示
- `SetShowOnIndexTableRow`          在表格行内展示
- `SetShowOnIndexTableAlert`        在多选弹出层展示

``` go
// 初始化
func (p *CreateLink) Init(name string) *CreateLink {
	// 初始化父结构
	p.ParentInit()

	// 设置展示位置
	p.SetOnlyOnIndex(true)

	return p
}
```

## 行为组件

这是 action 最核心的组成，来指定该 action 的作用类型，支持：ajax、link、url、drawer、dialog、confirm、cancel、prev、next、copy、close等操作

### 发送Ajax请求

``` go
package action

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
	"github.com/quarkcms/quark-go/pkg/msg"
	"gorm.io/gorm"
)

type Delete struct {
	actions.Action
}

// 初始化
func (p *Delete) Init(name string) *Delete {

	// 初始化父结构
	p.ParentInit()

	// 行为名称，当行为在表格行展示时，支持js表达式
	p.Name = name

	// 设置按钮类型,primary | ghost | dashed | link | text | default
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	//  执行成功后刷新的组件
	p.Reload = "table"

	// 当行为在表格行展示时，支持js表达式
	p.WithConfirm("确定要删除吗？", "删除后数据将无法恢复，请谨慎操作！", "modal")

	if name == "删除" {
		p.SetOnlyOnIndexTableRow(true)
	}

	if name == "批量删除" {
		p.SetOnlyOnIndexTableAlert(true)
	}

	return p
}

/**
 * 行为接口接收的参数，当行为在表格行展示的时候，可以配置当前行的任意字段
 *
 * @return array
 */
func (p *Delete) GetApiParams() []string {
	return []string{
		"id",
	}
}

// 执行行为句柄
func (p *Delete) Handle(ctx *builder.Context, model *gorm.DB) interface{} {
	err := model.Delete("").Error
	if err != nil {
		return ctx.JSON(200, msg.Error(err.Error(), ""))
	}

	return ctx.JSON(200, msg.Success("操作成功", "", ""))
}

```

### 页面跳转

``` go
package action

import (
	"strings"

	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
)

type EditLink struct {
	actions.Link
}

// 初始化
func (p *EditLink) Init(name string) *EditLink {
	// 初始化父结构
	p.ParentInit()

	// 设置按钮类型,primary | ghost | dashed | link | text | default
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	// 文字
	p.Name = name

	// 设置展示位置
	p.SetOnlyOnIndexTableRow(true)

	return p
}

// 跳转链接
func (p *EditLink) GetHref(ctx *builder.Context) string {
	return "#/index?api=" + strings.Replace(ctx.Path(), "/index", "/edit&id=${id}", -1)
}
```

### 弹窗

``` go
package action

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
	"github.com/quarkcms/quark-go/pkg/component/admin/action"
	"github.com/quarkcms/quark-go/pkg/component/admin/form"
)

type CreateModal struct {
	actions.Modal
}

// 初始化
func (p *CreateModal) Init(name string) *CreateModal {
	// 初始化父结构
	p.ParentInit()

	// 类型
	p.Type = "primary"

	// 图标
	p.Icon = "plus-circle"

	// 文字
	p.Name = "创建" + name

	// 关闭时销毁 Modal 里的子元素
	p.DestroyOnClose = true

	// 执行成功后刷新的组件
	p.Reload = "table"

	// 设置展示位置
	p.SetOnlyOnIndex(true)

	return p
}

// 内容
func (p *CreateModal) GetBody(ctx *builder.Context) interface{} {

	api := ctx.Template.(interface {
		CreationApi(*builder.Context) string
	}).CreationApi(ctx)

	fields := ctx.Template.(interface {
		CreationFieldsWithinComponents(*builder.Context) interface{}
	}).CreationFieldsWithinComponents(ctx)

	// 断言BeforeCreating方法，获取初始数据
	data := ctx.Template.(interface {
		BeforeCreating(*builder.Context) map[string]interface{}
	}).BeforeCreating(ctx)

	return (&form.Component{}).
		Init().
		SetKey("createModalForm", false).
		SetApi(api).
		SetBody(fields).
		SetInitialValues(data).
		SetLabelCol(map[string]interface{}{
			"span": 6,
		}).
		SetWrapperCol(map[string]interface{}{
			"span": 18,
		})
}

// 弹窗行为
func (p *CreateModal) GetActions(ctx *builder.Context) []interface{} {

	return []interface{}{
		(&action.Component{}).
			Init().
			SetLabel("取消").
			SetActionType("cancel"),

		(&action.Component{}).
			Init().
			SetLabel("提交").
			SetWithLoading(true).
			SetReload("table").
			SetActionType("submit").
			SetType("primary", false).
			SetSubmitForm("createModalForm"),
	}
}
```

### 抽屉

``` go
package action

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
	"github.com/quarkcms/quark-go/pkg/component/admin/action"
	"github.com/quarkcms/quark-go/pkg/component/admin/form"
)

type EditDrawer struct {
	actions.Drawer
}

// 初始化
func (p *EditDrawer) Init(name string) *EditDrawer {
	// 初始化父结构
	p.ParentInit()

	// 类型
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	// 文字
	p.Name = name

	// 关闭时销毁 Drawer 里的子元素
	p.DestroyOnClose = true

	// 执行成功后刷新的组件
	p.Reload = "table"

	// 设置展示位置
	p.SetOnlyOnIndexTableRow(true)

	return p
}

// 内容
func (p *EditDrawer) GetBody(ctx *builder.Context) interface{} {

	api := ctx.Template.(interface {
		UpdateApi(*builder.Context) string
	}).UpdateApi(ctx)

	initApi := ctx.Template.(interface {
		EditValueApi(*builder.Context) string
	}).EditValueApi(ctx)

	fields := ctx.Template.(interface {
		UpdateFieldsWithinComponents(*builder.Context) interface{}
	}).UpdateFieldsWithinComponents(ctx)

	return (&form.Component{}).
		Init().
		SetKey("editDrawerForm", false).
		SetApi(api).
		SetInitApi(initApi).
		SetBody(fields).
		SetLabelCol(map[string]interface{}{
			"span": 6,
		}).
		SetWrapperCol(map[string]interface{}{
			"span": 18,
		})
}

// 弹窗行为
func (p *EditDrawer) GetActions(ctx *builder.Context) []interface{} {

	return []interface{}{
		(&action.Component{}).
			Init().
			SetLabel("取消").
			SetActionType("cancel"),

		(&action.Component{}).
			Init().
			SetLabel("提交").
			SetWithLoading(true).
			SetReload("table").
			SetActionType("submit").
			SetType("primary", false).
			SetSubmitForm("editDrawerForm"),
	}
}
```

### 提交表单

``` go
package action

import (
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
)

type FormSubmit struct {
	actions.Action
}

// 初始化
func (p *FormSubmit) Init() *FormSubmit {
	// 初始化父结构
	p.ParentInit()

	// 类型
	p.Type = "primary"

	// 文字
	p.Name = "提交"

	// 行为类型
	p.ActionType = "submit"

	// 是否具有loading，当action 的作用类型为ajax,submit时有效
	p.WithLoading = true

	// 设置展示位置
	p.SetOnlyOnForm(true)

	return p
}
```

### 重置表单

``` go
package action

import (
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
)

type FormReset struct {
	actions.Action
}

// 初始化
func (p *FormReset) Init() *FormReset {
	// 初始化父结构
	p.ParentInit()

	// 类型
	p.Type = "default"

	// 文字
	p.Name = "重置"

	// 行为类型
	p.ActionType = "reset"

	// 设置展示位置
	p.SetShowOnForm()

	return p
}
```

### 返回上一页

``` go
package action

import (
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
)

type FormBack struct {
	actions.Action
}

// 初始化
func (p *FormBack) Init() *FormBack {
	// 初始化父结构
	p.ParentInit()

	// 类型
	p.Type = "default"

	// 文字
	p.Name = "返回上一页"

	// 行为类型
	p.ActionType = "back"

	// 设置展示位置
	p.SetShowOnForm().SetShowOnDetail()

	return p
}
```

### 下拉菜单

``` go
package action

import (
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/actions"
)

type MoreActions struct {
	actions.Dropdown
}

// 初始化
func (p *MoreActions) Init(name string) *MoreActions {

	// 初始化父结构
	p.ParentInit()

	// 下拉框箭头是否显示
	p.Arrow = true

	// 菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight
	p.Placement = "bottomLeft"

	// 触发下拉的行为, 移动端不支持 hover,Array<click|hover|contextMenu>
	p.Trigger = []string{"hover"}

	// 下拉根元素的样式
	p.OverlayStyle = map[string]interface{}{
		"zIndex": 999,
	}

	// 设置按钮类型,primary | ghost | dashed | link | text | default
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	// 文字
	p.Name = name

	// 设置展示位置
	p.SetOnlyOnIndexTableRow(true)

	return p
}
```