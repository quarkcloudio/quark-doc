# 行为

## 概述

在页面展示中我们会有各种对数据的操作，例如：提交表单、删除、修改数据、跳转链接等，我们统称这些操作为行为；quarkgo 内置了较为全面的行为组件，来方便开发者进行各种类型的数据操作。

## 快速开始
1. 首先找到`/www/internal/app/admin/action`目录，进入该目录中
2. 创建 create_link.go 文件
3. 在 create_link.go 文件中添加如下代码：

``` go
package action

import (
	"strings"

	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/types"
)

type CreateLinkAction struct {
	actions.Link
}

// 创建-跳转类型
func CreateLink() *CreateLinkAction {
	return &CreateLinkAction{}
}

// 初始化
func (p *CreateLinkAction) Init(ctx *quark.Context) interface{} {
	template := ctx.Template.(types.Resourcer)

	// 文字
	p.Name = "创建" + template.GetTitle()

	// 类型
	p.Type = "primary"

	// 图标
	p.Icon = "plus-circle"

	// 设置展示位置
	p.SetOnlyOnIndex(true)

	return p
}

// 跳转链接
func (p *CreateLinkAction) GetHref(ctx *quark.Context) string {
	return "#/layout/index?api=" + strings.Replace(ctx.Path(), "/index", "/create", -1)
}

```

4. 将 create_link.go 注册到对应的资源中，我们以 [article.go](https://github.com/quarkcloudio/quark-smart/blob/v2/internal/app/admin/resource/article.go) 为例，代码如下：
``` go
// 引入包，这里省略其他代码 ...
import (
	"github.com/quarkcms/quark-smart/internal/admin/service/action"
)

// 行为
func (p *Article) Actions(ctx *quark.Context) []interface{} {
	return []interface{}{
		actions.CreateLink(),
	}
}

// 省略其他代码 ...
```

5. 重启服务后，就可以在文章列表的操作栏中看到`创建文章`的跳转按钮了。

## 行为按钮样式

``` go

// 初始化
func (p *CreateLinkAction) Init(ctx *quark.Context) interface{} {
	template := ctx.Template.(types.Resourcer)

	// 文字
	p.Name = "创建" + template.GetTitle()

	// 类型
	p.Type = "primary"

	// 图标
	p.Icon = "plus-circle"

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
func (p *CreateLinkAction) Init(ctx *quark.Context) interface{} {

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
	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/component/message"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
	"gorm.io/gorm"
)

type BatchDeleteAction struct {
	actions.Action
}

// 批量删除，BatchDelete() | BatchDelete("批量删除")
func BatchDelete(options ...interface{}) *BatchDeleteAction {
	action := &BatchDeleteAction{}

	action.Name = "批量删除"
	if len(options) == 1 {
		action.Name = options[0].(string)
	}

	return action
}

// 初始化
func (p *BatchDeleteAction) Init(ctx *quark.Context) interface{} {

	// 设置按钮类型,primary | ghost | dashed | link | text | default
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	//  执行成功后刷新的组件
	p.Reload = "table"

	// 当行为在表格行展示时，支持js表达式
	p.WithConfirm("确定要删除吗？", "删除后数据将无法恢复，请谨慎操作！", "modal")

	// 在表格多选弹出层展示
	p.SetOnlyOnIndexTableAlert(true)

	return p
}

// 行为接口接收的参数，当行为在表格行展示的时候，可以配置当前行的任意字段
func (p *BatchDeleteAction) GetApiParams() []string {
	return []string{
		"id",
	}
}

// 执行行为句柄
func (p *BatchDeleteAction) Handle(ctx *quark.Context, query *gorm.DB) error {
	err := query.Delete("").Error
	if err != nil {
		return ctx.JSON(200, message.Error(err.Error()))
	}

	return ctx.JSON(200, message.Success("操作成功"))
}

```

### 页面跳转

``` go
package action

import (
	"strings"

	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
)

type EditLinkAction struct {
	actions.Link
}

// 编辑-跳转类型，EditLink() | EditLink("编辑")
func EditLink(options ...interface{}) *EditLinkAction {
	action := &EditLinkAction{}

	// 文字
	action.Name = "编辑"
	if len(options) == 1 {
		action.Name = options[0].(string)
	}

	return action
}

// 初始化
func (p *EditLinkAction) Init(ctx *quark.Context) interface{} {

	// 设置按钮类型,primary | ghost | dashed | link | text | default
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	// 设置展示位置
	p.SetOnlyOnIndexTableRow(true)

	return p
}

// 跳转链接
func (p *EditLinkAction) GetHref(ctx *quark.Context) string {
	return "#/layout/index?api=" + strings.Replace(ctx.Path(), "/index", "/edit&id=${id}", -1)
}

```

### 弹窗

``` go
package action

import (
	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/component/action"
	"github.com/quarkcloudio/quark-go/v3/template/admin/component/form"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/types"
)

type CreateModalAction struct {
	actions.Modal
}

// 创建-弹窗类型
func CreateModal() *CreateModalAction {
	return &CreateModalAction{}
}

// 初始化
func (p *CreateModalAction) Init(ctx *quark.Context) interface{} {
	template := ctx.Template.(types.Resourcer)

	// 文字
	p.Name = "创建" + template.GetTitle()

	// 类型
	p.Type = "primary"

	// 图标
	p.Icon = "plus-circle"

	// 关闭时销毁 Modal 里的子元素
	p.DestroyOnClose = true

	// 执行成功后刷新的组件
	p.Reload = "table"

	// 设置展示位置
	p.SetOnlyOnIndex(true)

	return p
}

// 内容
func (p *CreateModalAction) GetBody(ctx *quark.Context) interface{} {
	template := ctx.Template.(types.Resourcer)

	// 创建表单的接口
	api := template.CreationApi(ctx)

	// 包裹在组件内的创建页字段
	fields := template.CreationFieldsWithinComponents(ctx)

	// 创建页面显示前回调
	data := template.BeforeCreating(ctx)

	// 返回数据
	return (&form.Component{}).
		Init().
		SetStyle(map[string]interface{}{
			"paddingTop": "24px",
		}).
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
func (p *CreateModalAction) GetActions(ctx *quark.Context) []interface{} {

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
	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/component/action"
	"github.com/quarkcloudio/quark-go/v3/template/admin/component/form"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/types"
)

type CreateDrawerAction struct {
	actions.Drawer
}

// 创建-抽屉类型
func CreateDrawer() *CreateDrawerAction {
	return &CreateDrawerAction{}
}

// 初始化
func (p *CreateDrawerAction) Init(ctx *quark.Context) interface{} {
	template := ctx.Template.(types.Resourcer)

	// 文字
	p.Name = "创建" + template.GetTitle()

	// 类型
	p.Type = "primary"

	// 图标
	p.Icon = "plus-circle"

	// 执行成功后刷新的组件
	p.Reload = "table"

	// 关闭时销毁 Drawer 里的子元素
	p.DestroyOnClose = true

	// 设置展示位置
	p.SetOnlyOnIndex(true)

	return p
}

// 内容
func (p *CreateDrawerAction) GetBody(ctx *quark.Context) interface{} {
	template := ctx.Template.(types.Resourcer)

	// 包裹在组件内的编辑页字段
	api := template.CreationApi(ctx)

	// 包裹在组件内的创建页字段
	fields := template.CreationFieldsWithinComponents(ctx)

	// 创建页面显示前回调
	data := template.BeforeCreating(ctx)

	// 返回数据
	return (&form.Component{}).
		Init().
		SetKey("createDrawerForm", false).
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
func (p *CreateDrawerAction) GetActions(ctx *quark.Context) []interface{} {

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
			SetSubmitForm("createDrawerForm"),
	}
}
```

### 提交表单

``` go
package action

import (
	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
)

type FormSubmitAction struct {
	actions.Action
}

// 表单提交，FormSubmit() | FormSubmit("提交")
func FormSubmit(options ...interface{}) *FormSubmitAction {
	action := &FormSubmitAction{}

	// 文字
	action.Name = "提交"
	if len(options) == 1 {
		action.Name = options[0].(string)
	}

	return action
}

// 初始化
func (p *FormSubmitAction) Init(ctx *quark.Context) interface{} {

	// 类型
	p.Type = "primary"

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
	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
)

type FormResetAction struct {
	actions.Action
}

// 表单重置，FormReset() | FormReset("重置")
func FormReset(options ...interface{}) *FormResetAction {
	action := &FormResetAction{}

	// 文字
	action.Name = "重置"
	if len(options) == 1 {
		action.Name = options[0].(string)
	}

	return action
}

// 初始化
func (p *FormResetAction) Init(ctx *quark.Context) interface{} {

	// 类型
	p.Type = "default"

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
	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
)

type FormBackAction struct {
	actions.Action
}

// 返回上一页，FormBack() | FormBack("返回上一页")
func FormBack(options ...interface{}) *FormBackAction {
	action := &FormBackAction{}

	// 文字
	action.Name = "返回上一页"
	if len(options) == 1 {
		action.Name = options[0].(string)
	}

	return action
}

// 初始化
func (p *FormBackAction) Init(ctx *quark.Context) interface{} {

	// 类型
	p.Type = "default"

	// 行为类型
	p.ActionType = "back"

	// 在表单页展示
	p.SetShowOnForm()

	// 在详情页展示
	p.SetShowOnDetail()

	return p
}
```

### 下拉菜单

``` go
package actions

import (
	"github.com/quarkcloudio/quark-go/v3"
	"github.com/quarkcloudio/quark-go/v3/template/admin/resource/actions"
)

type MoreAction struct {
	actions.Dropdown
}

// 更多，More() | More("更多") | More("更多", []interface{}{})
func More(options ...interface{}) *MoreAction {
	moreAction := &MoreAction{}

	moreAction.Name = "更多"
	if len(options) == 1 {
		moreAction.Name = options[0].(string)
	}

	if len(options) == 2 {
		moreAction.Name = options[0].(string)
		moreAction.Actions = options[1].([]interface{})
	}

	return moreAction
}

// 初始化
func (p *MoreAction) Init(ctx *quark.Context) interface{} {

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

	// 设置展示位置
	p.SetOnlyOnIndexTableRow(true)

	return p
}

// 下拉菜单行为
func (p *MoreAction) SetActions(actions []interface{}) interface{} {
	p.Actions = actions

	return p
}
```