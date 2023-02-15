# 行为

## 概述

在页面展示中我们会有各种对数据的操作，例如：提交表单、删除、修改数据、跳转链接等，我们统称这些操作为行为；quarkgo 内置了较为全面的行为组件，来方便开发者进行各种类型的数据操作。

## 快速开始
1. 首先找到```/www/internal/admin/actions```目录，进入该目录中
2. 创建 create_link.go 文件
3. 在 create_link.go 文件中添加如下代码：
``` go
package actions

import (
	"strings"

	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/actions"
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

5. 重启服务后，就可以在文章列表的操作栏中看到```创建文章```的跳转按钮了。

### 行为展示位置

完善中...

### 行为组件

完善中...