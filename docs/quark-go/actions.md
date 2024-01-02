# 行为

## 概述

在页面展示中我们会有各种对数据的操作，例如：提交表单、删除、修改数据、跳转链接等，我们统称这些操作为行为；quarkgo 内置了较为全面的行为组件，来方便开发者进行各种类型的数据操作。

## 快速开始
1. 首先找到`/www/internal/admin/service/action`目录，进入该目录中
2. 创建 create_link.go 文件
3. 在 create_link.go 文件中添加如下代码：

``` go
package action

import (
	"strings"

	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/types"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
)

type CreateLinkAction struct {
	actions.Link
}

// 创建-跳转类型
func CreateLink() *CreateLinkAction {
	return &CreateLinkAction{}
}

// 初始化
func (p *CreateLinkAction) Init(ctx *builder.Context) interface{} {
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
func (p *CreateLinkAction) GetHref(ctx *builder.Context) string {
	return "#/layout/index?api=" + strings.Replace(ctx.Path(), "/index", "/create", -1)
}

```

4. 将 create_link.go 注册到对应的资源中，我们以 [post.go](https://github.com/quarkcms/quark-smart/blob/main/internal/admin/service/resources/post.go) 为例，代码如下：
``` go
// 引入包，这里省略其他代码 ...
import (
	"github.com/quarkcms/quark-smart/internal/admin/service/action"
)

// 行为
func (p *Post) Actions(ctx *builder.Context) []interface{} {
	return []interface{}{
		action.CreateLink(),
	}
}

// 省略其他代码 ...
```

5. 重启服务后，就可以在文章列表的操作栏中看到`创建文章`的跳转按钮了。

## 行为按钮样式

``` go

// 初始化
func (p *CreateLinkAction) Init(ctx *builder.Context) interface{} {
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
func (p *CreateLinkAction) Init(ctx *builder.Context) interface{} {

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
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/component/message"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
	"gorm.io/gorm"
)

type DeleteAction struct {
	actions.Action
}

// 删除
func Delete() *DeleteAction {
	return &DeleteAction{}
}

// 初始化
func (p *DeleteAction) Init(ctx *builder.Context) interface{} {

	// 文字
	p.Name = "删除"

	// 设置按钮类型,primary | ghost | dashed | link | text | default
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	//  执行成功后刷新的组件
	p.Reload = "table"

	// 当行为在表格行展示时，支持js表达式
	p.WithConfirm("确定要删除吗？", "删除后数据将无法恢复，请谨慎操作！", "modal")

	// 在表格行内展示
	p.SetOnlyOnIndexTableRow(true)

	// 行为接口接收的参数，当行为在表格行展示的时候，可以配置当前行的任意字段
	p.SetApiParams([]string{
		"id",
	})

	return p
}

// 执行行为句柄
func (p *DeleteAction) Handle(ctx *builder.Context, query *gorm.DB) error {
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

	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
)

type EditLinkAction struct {
	actions.Link
}

// 编辑-跳转类型
func EditLink() *EditLinkAction {
	return &EditLinkAction{}
}

// 初始化
func (p *EditLinkAction) Init(ctx *builder.Context) interface{} {

	// 文字
	p.Name = "编辑"

	// 设置按钮类型,primary | ghost | dashed | link | text | default
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	// 设置展示位置
	p.SetOnlyOnIndexTableRow(true)

	return p
}

// 跳转链接
func (p *EditLinkAction) GetHref(ctx *builder.Context) string {
	return "#/layout/index?api=" + strings.Replace(ctx.Path(), "/index", "/edit&id=${id}", -1)
}

```

### 弹窗

``` go
package action

import (
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/component/action"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/component/form"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/types"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
)

type CreateModalAction struct {
	actions.Modal
}

// 创建-弹窗类型
func CreateModal() *CreateModalAction {
	return &CreateModalAction{}
}

// 初始化
func (p *CreateModalAction) Init(ctx *builder.Context) interface{} {
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
func (p *CreateModalAction) GetBody(ctx *builder.Context) interface{} {
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
func (p *CreateModalAction) GetActions(ctx *builder.Context) []interface{} {

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
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/component/action"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/component/form"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/types"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
)

type EditDrawerAction struct {
	actions.Drawer
}

// 编辑-抽屉类型
func EditDrawer() *EditDrawerAction {
	return &EditDrawerAction{}
}

// 初始化
func (p *EditDrawerAction) Init(ctx *builder.Context) interface{} {

	// 文字
	p.Name = "编辑"

	// 类型
	p.Type = "link"

	// 设置按钮大小,large | middle | small | default
	p.Size = "small"

	// 关闭时销毁 Drawer 里的子元素
	p.DestroyOnClose = true

	// 执行成功后刷新的组件
	p.Reload = "table"

	// 设置展示位置
	p.SetOnlyOnIndexTableRow(true)

	return p
}

// 内容
func (p *EditDrawerAction) GetBody(ctx *builder.Context) interface{} {
	template := ctx.Template.(types.Resourcer)

	// 更新表单的接口
	api := template.UpdateApi(ctx)

	// 编辑页面获取表单数据接口
	initApi := template.EditValueApi(ctx)

	// 包裹在组件内的编辑页字段
	fields := template.UpdateFieldsWithinComponents(ctx)

	// 返回数据
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
func (p *EditDrawerAction) GetActions(ctx *builder.Context) []interface{} {

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
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
)

type FormSubmitAction struct {
	actions.Action
}

// 表单提交
func FormSubmit() *FormSubmitAction {
	return &FormSubmitAction{}
}

// 初始化
func (p *FormSubmitAction) Init(ctx *builder.Context) interface{} {

	// 文字
	p.Name = "提交"

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
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
)

type FormResetAction struct {
	actions.Action
}

// 表单重置
func FormReset() *FormResetAction {
	return &FormResetAction{}
}

// 初始化
func (p *FormResetAction) Init(ctx *builder.Context) interface{} {

	// 文字
	p.Name = "重置"

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
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
)

type FormBackAction struct {
	actions.Action
}

// 返回上一页
func FormBack() *FormBackAction {
	return &FormBackAction{}
}

// 初始化
func (p *FormBackAction) Init(ctx *builder.Context) interface{} {

	// 文字
	p.Name = "返回上一页"

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
package action

import (
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/actions"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
)

type MoreAction struct {
	actions.Dropdown
}

// 更多
func More() *MoreAction {
	return &MoreAction{}
}

// 初始化
func (p *MoreAction) Init(ctx *builder.Context) interface{} {

	// 文字
	p.Name = "更多"

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