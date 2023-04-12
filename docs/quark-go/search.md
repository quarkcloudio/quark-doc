# 搜索

## 概述

在列表展示中我们会遇到各种情况的搜索需求，quarkgo 内置了多种搜索组件，来满足您定制查询条件。

## 快速开始
1. 首先找到```/www/internal/admin/searches```目录，进入该目录中
2. 创建 input.go 文件
3. 在 input.go 文件中添加如下代码：
``` go
package search

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/searches"
	"gorm.io/gorm"
)

type Input struct {
	searches.Search
}

// 初始化
func (p *Input) Init(column string, name string) *Input {
	p.ParentInit()
	p.Column = column
	p.Name = name

	return p
}

// 执行查询
func (p *Input) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" LIKE ?", "%"+value.(string)+"%")
}
```
4. 将 input.go 注册到对应的资源中，我们以 [post.go](https://github.com/quarkcms/quark-smart/blob/main/internal/admin/resources/post.go) 为例，代码如下：
``` go
// 引入包，这里省略其他代码 ...
import (
	"github.com/quarkcms/quark-smart/internal/admin/searches"
)

// 搜索
func (p *Post) Searches(ctx *builder.Context) []interface{} {
	return []interface{}{
		(&searches.Input{}).Init("title", "标题"),
	}
}
// 省略其他代码 ...
```
5. 重启服务后，就可以在文章列表的搜索栏中看到```标题```的搜索框了。

## 搜索组件

所有的搜索组件均包含```Init```、```Apply```两个方法，我们只需在这两个方法里，填充自己的逻辑即可。
quarkgo 内置了如下搜索组件：

- `Input` 			输入框组件
- `Select` 			下拉框组件
- `Date`     		日期组件
- `DateRange`    	日期范围组件
- `Datetime`  		日期时间组件
- `DatetimeRange`  	日期时间范围组件

### Input

``` go
package search

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/searches"
	"gorm.io/gorm"
)

type Input struct {
	searches.Search
}

// 初始化
func (p *Input) Init(column string, name string) *Input {
	p.ParentInit()
	p.Column = column
	p.Name = name

	return p
}

// 执行查询
func (p *Input) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" LIKE ?", "%"+value.(string)+"%")
}
```

### Select

``` go
package search

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/searches"
	"github.com/quarkcms/quark-go/pkg/component/admin/form/fields/selectfield"
	"gorm.io/gorm"
)

type Status struct {
	searches.Select
}

// 初始化
func (p *Status) Init() *Status {
	p.ParentInit()
	p.Name = "状态"

	return p
}

// 执行查询
func (p *Status) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {

	var status int

	if value.(string) == "on" {
		status = 1
	} else {
		status = 0
	}

	return query.Where("status = ?", status)
}

// 属性
func (p *Status) Options(ctx *builder.Context) interface{} {
	return []*selectfield.Option{
		p.Option(0, "禁用"),
		p.Option(1, "正常"),
	}
}
```

### Date

``` go
package search

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/searches"
	"gorm.io/gorm"
)

type Date struct {
	searches.Date
}

// 初始化
func (p *Date) Init(column string, name string) *Date {
	p.ParentInit()
	p.Column = column
	p.Name = name

	return p
}

// 执行查询
func (p *Date) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" = ?", value)
}
```

### DateRange

``` go
package search

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/searches"
	"gorm.io/gorm"
)

type DateRange struct {
	searches.DateRange
}

// 初始化
func (p *DateRange) Init(column string, name string) *DateRange {
	p.ParentInit()
	p.Column = column
	p.Name = name

	return p
}

// 执行查询
func (p *DateRange) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	values, ok := value.([]interface{})
	if !ok {
		return query
	}

	return query.Where(p.Column+" BETWEEN ? AND ?", values[0], values[1])
}

```

### Datetime

``` go
package search

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/searches"
	"gorm.io/gorm"
)

type Datetime struct {
	searches.Datetime
}

// 初始化
func (p *Datetime) Init(column string, name string) *Datetime {
	p.ParentInit()
	p.Column = column
	p.Name = name

	return p
}

// 执行查询
func (p *Datetime) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" = ?", value)
}
```

### DateTimeRange

``` go
package search

import (
	"github.com/quarkcms/quark-go/pkg/builder"
	"github.com/quarkcms/quark-go/pkg/builder/template/adminresource/searches"
	"gorm.io/gorm"
)

type DateTimeRange struct {
	searches.DatetimeRange
}

// 初始化
func (p *DateTimeRange) Init(column string, name string) *DateTimeRange {
	p.ParentInit()
	p.Column = column
	p.Name = name

	return p
}

// 执行查询
func (p *DateTimeRange) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	values, ok := value.([]interface{})
	if !ok {
		return query
	}

	return query.Where(p.Column+" BETWEEN ? AND ?", values[0], values[1])
}

```