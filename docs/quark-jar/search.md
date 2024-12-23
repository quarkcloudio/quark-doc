# 搜索

## 概述

在列表展示中我们会遇到各种情况的搜索需求，quarkgo 内置了多种搜索组件，来满足您定制查询条件。

## 快速开始
1. 首先找到```/www/internal/admin/service/search```目录，进入该目录中
2. 创建 input.go 文件
3. 在 input.go 文件中添加如下代码：
``` go
package search

import (
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/searches"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
	"gorm.io/gorm"
)

type InputField struct {
	searches.Search
}

// 输入框
func Input(column string, name string) *InputField {
	field := &InputField{}

	field.Column = column
	field.Name = name

	return field
}

// 执行查询
func (p *InputField) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" LIKE ?", "%"+value.(string)+"%")
}
```
4. 将 input.go 注册到对应的资源中，我们以 [post.go](https://github.com/quarkcloudio/quark-smart/blob/v2/internal/admin/service/resources/post.go) 为例，代码如下：
``` go
// 引入包，这里省略其他代码 ...
import (
	"github.com/quarkcms/quark-smart/internal/admin/service/search"
)

// 搜索
func (p *Post) Searches(ctx *builder.Context) []interface{} {
	return []interface{}{
		searches.Input("title", "标题"),
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
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/searches"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
	"gorm.io/gorm"
)

type InputField struct {
	searches.Search
}

// 输入框
func Input(column string, name string) *InputField {
	field := &InputField{}

	field.Column = column
	field.Name = name

	return field
}

// 执行查询
func (p *InputField) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" LIKE ?", "%"+value.(string)+"%")
}
```

### Select

``` go
package search

import (
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/component/form/fields/selectfield"
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/searches"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
	"gorm.io/gorm"
)

type SelectField struct {
	searches.Select
}

// 下拉框
func Select(column string, name string, options []*selectfield.Option) *SelectField {
	field := &SelectField{}

	field.Column = column
	field.Name = name
	field.SelectOptions = options

	return field
}

// 执行查询
func (p *SelectField) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" = ?", value)
}

// 属性
func (p *SelectField) Options(ctx *builder.Context) interface{} {
	return p.SelectOptions
}
```

### Date

``` go
package search

import (
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/searches"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
	"gorm.io/gorm"
)

type DateField struct {
	searches.DateRange
}

// 日期范围
func Date(column string, name string) *DateField {
	field := &DateField{}

	field.Column = column
	field.Name = name

	return field
}

// 执行查询
func (p *DateField) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" = ?", value)
}
```

### DateRange

``` go
package search

import (
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/searches"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
	"gorm.io/gorm"
)

type DateRangeField struct {
	searches.DateRange
}

// 日期
func DateRange(column string, name string) *DateRangeField {
	field := &DateRangeField{}

	field.Column = column
	field.Name = name

	return field
}

// 执行查询
func (p *DateRangeField) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
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
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/searches"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
	"gorm.io/gorm"
)

type DatetimeField struct {
	searches.DatetimeRange
}

// 日期时间
func Datetime(column string, name string) *DatetimeField {
	field := &DatetimeField{}

	field.Column = column
	field.Name = name

	return field
}

// 执行查询
func (p *DatetimeField) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	return query.Where(p.Column+" = ?", value)
}
```

### DateTimeRange

``` go
package search

import (
	"github.com/quarkcloudio/quark-go/v2/pkg/app/admin/template/resource/searches"
	"github.com/quarkcloudio/quark-go/v2/pkg/builder"
	"gorm.io/gorm"
)

type DateTimeRangeField struct {
	searches.DatetimeRange
}

// 日期时间范围
func DatetimeRange(column string, name string) *DateTimeRangeField {
	field := &DateTimeRangeField{}

	field.Column = column
	field.Name = name

	return field
}

// 执行查询
func (p *DateTimeRangeField) Apply(ctx *builder.Context, query *gorm.DB, value interface{}) *gorm.DB {
	values, ok := value.([]interface{})
	if !ok {
		return query
	}

	return query.Where(p.Column+" BETWEEN ? AND ?", values[0], values[1])
}
```