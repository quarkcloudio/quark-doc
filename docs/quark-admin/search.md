# 搜索

## 定义搜索项

QuarkAdmin 的搜索组件可以让你定制你的列表的查询条件. 例如, 你也许想定义一个搜索表单项, 用来快速找到 你应用中的"管理员"用户，搜索类库默认放在 `app/Admin/Searches` 文件夹下，搜索表单项目前有`Input`、`Date`、`DateRange`、`Datetime`、`DateTimeRange`、`Select`这几种控件。

每个在 QuarkAdmin 中生成的文件都包含了 `apply`，该方法负责按你希望的状态修改查询条件。

#### 文本框（Input）控件

```php
<?php

namespace App\Admin\Searches;

use Illuminate\Http\Request;
use QuarkCMS\QuarkAdmin\Searches\Search;

class Input extends Search
{
    /**
     * 字段
     *
     * @var string
     */
    public $column = 'username';

    /**
     * 名称
     *
     * @var string
     */
    public $name = '用户名';

    /**
     * 执行查询
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  mixed  $value
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function apply(Request $request, $query, $value)
    {
        return $query->where($this->column, $value);
    }
}
```

#### 下拉框（Select）控件

下拉框包含了2个方法 : `apply` 和 `options`.   `apply` 方法负责按你希望的状态修改查询条件, 而 `options` 方法用来定义过滤器中你要定义的过滤选项

```php
<?php

namespace App\Admin\Searches;

use Illuminate\Http\Request;
use QuarkCMS\QuarkAdmin\Searches\Select;

class Status extends Select
{
    /**
     * 显示名称
     *
     * @var string
     */
    public $name = '状态';

    /**
     * 执行查询
     *
     * @param  Request  $request
     * @param  Builder  $query
     * @param  mixed  $value
     * @return Builder
     */
    public function apply(Request $request, $query, $value)
    {
        return $query->where('status', ($value === 'on'));
    }

    /**
     * 属性
     *
     * @param  Request  $request
     * @return array
     */
    public function options(Request $request)
    {
        return [
            'on' => '正常',
            'off' => '禁用'
        ];
    }
}
```

 `options` 方法返回一个键值对数组. 数组的键是展示给使用者选择的文本 . 数组的值则会在选择后作为 `$value` 参数传入 `apply` 方法. 

如示例所见, 你可以利用这个方式传入其他你希望的值到  `apply` 方法中以完成按条件过滤列表数据.  `apply` 方法应该始终返回一个查询实例

#### 日期（Date）控件

```php
<?php

namespace App\Admin\Searches;

use Illuminate\Http\Request;
use QuarkCMS\QuarkAdmin\Searches\Date;

class CreateDate extends Date
{
    /**
     * 字段
     *
     * @var string
     */
    public $column = 'created_at';

    /**
     * 名称
     *
     * @var string
     */
    public $name = '创建日期';

    /**
     * 执行查询
     *
     * @param  Request  $request
     * @param  Builder  $query
     * @param  mixed  $value
     * @return Builder
     */
    public function apply(Request $request, $query, $value)
    {
        return $query->where($this->column, $value);
    }
}
```

#### 日期范围（DateRange）控件

```php
<?php

namespace App\Admin\Searches;

use Illuminate\Http\Request;
use QuarkCMS\QuarkAdmin\Searches\DateRange;

class CreateDate extends DateRange
{
    /**
     * 字段
     *
     * @var string
     */
    public $column = 'created_at';

    /**
     * 名称
     *
     * @var string
     */
    public $name = '创建日期';

    /**
     * 执行查询
     *
     * @param  Request  $request
     * @param  Builder  $query
     * @param  mixed  $value
     * @return Builder
     */
    public function apply(Request $request, $query, $value)
    {
        return $query->whereBetween($this->column, $value);
    }
}
```

#### 时间（DateTime）控件

```php
<?php

namespace App\Admin\Searches;

use Illuminate\Http\Request;
use QuarkCMS\QuarkAdmin\Searches\DateTime;

class CreateDate extends DateTime
{
    /**
     * 字段
     *
     * @var string
     */
    public $column = 'created_at';

    /**
     * 名称
     *
     * @var string
     */
    public $name = '创建日期';

    /**
     * 执行查询
     *
     * @param  Request  $request
     * @param  Builder  $query
     * @param  mixed  $value
     * @return Builder
     */
    public function apply(Request $request, $query, $value)
    {
        return $query->where($this->column, $value);
    }
}
```

#### 时间范围（DateTimeRange）控件

```php
<?php

namespace App\Admin\Searches;

use Illuminate\Http\Request;
use QuarkCMS\QuarkAdmin\Searches\DateTimeRange;

class CreateDate extends DateTimeRange
{
    /**
     * 字段
     *
     * @var string
     */
    public $column = 'created_at';

    /**
     * 名称
     *
     * @var string
     */
    public $name = '创建日期';

    /**
     * 执行查询
     *
     * @param  Request  $request
     * @param  Builder  $query
     * @param  mixed  $value
     * @return Builder
     */
    public function apply(Request $request, $query, $value)
    {
        return $query->whereBetween($this->column, $value);
    }
}
```

## 注册搜索项

一旦你定义了搜索表单项, 你便可以将它注册到一个资源中. 每一个资源都通过容器中 `searches` 方法注册搜索表单项, 你只需要将搜索表单项实例放入 `searches` 方法的返回数组中即可:

```php
/**
 * 搜索表单
 *
 * @param  Request  $request
 * @return object
 */
public function searches(Request $request)
{
    return [
        new \App\Admin\Searches\Status
    ];
}
```