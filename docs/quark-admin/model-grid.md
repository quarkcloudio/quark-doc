# 模型表格

## 基于数据模型的表格

Quark::grid()用于生成基于数据模型的表格，下面以movies表为例：
``` sql
movies
    id          - integer
    title       - string
    director    - integer
    describe    - string
    rate        - tinyint
    released    - enum(0, 1)
    release_at  - timestamp
    created_at  - timestamp
    updated_at  - timestamp
```

对应的数据模型为App\Models\Movie，用下面的代码生成表movies的数据表格：
``` php
use App\Models\Movie;
use Quark;

$grid = Quark::grid(new Movie)->title('电影列表');

//第一列显示id字段，并将这一列设置为可排序列
$grid->column('id', 'ID')->sortable();

//第二列显示title字段
$grid->column('title', '标题');

//第三列显示director字段
$grid->column('director');

//第四列显示为describe字段
$grid->column('describe');

//第五列显示为rate字段
$grid->column('rate');

//第六列显示released字段
$grid->column('released', '上映?');

//下面为三个时间字段的列显示
$grid->column('release_at');
$grid->column('created_at');
$grid->column('updated_at');

//search($callback)方法用来设置表格的搜索框
$grid->search(function($search) {

    $search->where('title', '搜索内容',function ($query) {
        $query->where('title', 'like', "%{input}%");
    })->placeholder('电影名称');

    $search->between('release_at', '上映时间')
    ->datetime()
    ->advanced();
})->expand(false);
```

# 基础方法
模型表格有以下的一些基础方法

## 表格添加列
``` php
//直接通过字段名`username`添加列
$grid->column('username', '用户名');
```

## 列的显示
**内容映射**
``` php
$grid->column('sex','性别')->using(['1'=>'男','2'=>'女']);
```

**二维码**

通过下面的调用，会在这一列的每一行文字前面出现一个二维码icon，点击它可以展开一个小弹框，里面会显示这一列值的二维码编码图形
``` php
$grid->column('link','二维码')->qrcode(); //qrcode($content=null,$width=150,$height=150)
```

**显示图片**

默认picture字段保存的是pictures表里面的id。
``` php
$grid->column('picture','图片')->image();

//设置服务器和宽高
$grid->column('picture')->image('http://xxx.com', 100, 100);
```

## 添加数据查询条件
默认情况下，表格的数据没有任何查询条件，可以使用model()方法来给当前表格数据添加查询条件：
``` php
$grid->model()->where('id', '>', 100);

$grid->model()->whereIn('id', [1, 2, 3]);

$grid->model()->whereBetween('votes', [1, 100]);

$grid->model()->whereColumn('updated_at', '>', 'created_at');

$grid->model()->orderBy('id', 'desc');

$grid->model()->take(100);
```
$grid->model()后面可以直接调用Eloquent的查询方法来给表格数据添加查询条件，更多查询方法参考Laravel文档.

## 设置每页显示行数
``` php
//默认为每页20条
$grid->paginate(15);
```

## 关联模型
一对一，users表和profiles表通过profiles.user_id字段生成一对一关联
``` sql
uers
    id      - integer 
    name    - string
    email   - string

profiles
    id      - integer 
    user_id - integer 
    age     - string
    gender  - string
```

对应的数据模分别为:
``` php
class User extends Model
{
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
}

class Profile extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

通过下面的代码可以关联在一个grid里面:
``` php
$grid = new Grid(new User);

$grid->column('id', 'ID')->sortable();

$grid->column('name');
$grid->column('email');

$grid->column('profile.age');
$grid->column('profile.gender');
```

## 数据查询过滤
model-grid提供了一系列的方法实现表格数据的查询过滤：

``` php
$grid->search(function($search) {

    $search->where('title', '搜索内容',function ($query) {
        $query->where('title', 'like', "%{input}%");
    })->placeholder('搜索内容');

    $search->equal('status', '所选状态')
    ->select([''=>'全部',1=>'正常',2=>'已禁用'])
    ->placeholder('选择状态')
    ->width(110)
    ->advanced();

    $search->between('created_at', '发布时间')
    ->datetime()
    ->advanced();
});
```

通过点击筛选按钮展开显示，默认是不展开的，用下面的方式可以让它默认展开：
``` php
// 在`$grid`实例上操作
$grid->expand(true);
```

可以把你最常用的查询定义为一个查询范围，它将会出现在筛选按钮的下拉菜单中，下面是几个例子：
``` php
$search->scope('male', '男性')->where('gender', 'm');

// 多条件查询
$search->scope('new', '最近修改')
    ->whereDate('created_at', date('Y-m-d'))
    ->orWhere('updated_at', date('Y-m-d'));

// 关联关系查询
$search->scope('address')->whereHas('profile', function ($query) {
    $query->whereNotNull('address');
});

$search->scope('trashed', '被软删除的数据')->onlyTrashed();
```
::: tip
scope方法可以链式调用任何eloquent查询条件
:::

**查询类型**

目前支持的过滤类型有下面这些:

**equal**
**sql: ... WHERE column = "$input"：**
``` php
$search->equal('column', $label);
```

**not equal**
**sql: ... WHERE column != "$input"：**
``` php
$search->notEqual('column', $label);
```

**like**
**sql: ... WHERE column LIKE "%$input%"：**
``` php
$search->like('column', $label);
```

**大于**
**sql: ... WHERE column > "$input"：**
``` php
$search->gt('column', $label);
```

**小于**
**sql: ... WHERE column < "$input"：**
``` php
$search->lt('column', $label);
```

**between**
**sql: ... WHERE column BETWEEN "$start" AND "$end"：**
``` php
$search->between('column', $label);

// 设置datetime类型
$search->between('column', $label)->datetime();
```

**in**
**sql: ... WHERE column in (...$inputs)：**
``` php
$search->in('column', $label)->multipleSelect(['key' => 'value']);
```

**notIn**
**sql: ... WHERE column not in (...$inputs)：**
``` php
$search->notIn('column', $label)->multipleSelect(['key' => 'value']);
```

**datetime**
**sql: ... WHERE DATE(column) = "$input"：**
``` php
$search->datetime('column', $label);
```

**where**
可以用where来构建比较复杂的查询过滤

**sql: ... WHERE title LIKE "%$input" OR content LIKE "%$input"：**
``` php
$search->where(function ($query) {

    $query->where('title', 'like', "%{input}%")
        ->orWhere('content', 'like', "%{input}%");

}, 'Text');
```

**sql: ... WHERE rate>= 6 AND created_at= {$input}:**
``` php
$search->where(function ($query) {

    $query->whereRaw("`rate` >= 6 AND `created_at` = %{input}%");

}, 'Text');
```

关系查询，查询对应关系profile的字段：
``` php
$search->where(function ($query) {

    $query->whereHas('profile', function ($query) {
        $query->where('address', 'like', "%{input}%")->orWhere('email', 'like', "%{input}%");
    });

}, '地址或手机号');
```

**表单类型**
text
表单类型默认是text input，可以设置placeholder：

$filter->equal('column')->placeholder('请输入。。。');
也可以通过下面的一些方法来限制用户输入格式：

select
$filter->equal('column')->select(['key' => 'value'...]);

// 或者从api获取数据，api的格式参考model-form的select组件
$filter->equal('column')->select('api/users');
multipleSelect
一般用来配合in和notIn两个需要查询数组的查询类型使用，也可以在where类型的查询中使用：

$filter->in('column')->multipleSelect(['key' => 'value'...]);

// 或者从api获取数据，api的格式参考model-form的multipleSelect组件
$filter->in('column')->multipleSelect('api/users');
radio
比较常见的场景是选择分类

$filter->equal('released')->radio([
    ''   => 'All',
    0    => 'Unreleased',
    1    => 'Released',
]);
checkbox
比较常见的场景是配合whereIn来做范围筛选

$filter->in('gender')->checkbox([
    'm'    => 'Male',
    'f'    => 'Female',
]);
datetime
通过日期时间组件来查询，$options的参数和值参考bootstrap-datetimepicker

$filter->equal('column')->datetime($options);

// `date()` 相当于 `datetime(['format' => 'YYYY-MM-DD'])`
$filter->equal('column')->date();

// `time()` 相当于 `datetime(['format' => 'HH:mm:ss'])`
$filter->equal('column')->time();

// `day()` 相当于 `datetime(['format' => 'DD'])`
$filter->equal('column')->day();

// `month()` 相当于 `datetime(['format' => 'MM'])`
$filter->equal('column')->month();

// `year()` 相当于 `datetime(['format' => 'YYYY'])`
$filter->equal('column')->year();
复杂查询过滤器
您可以使用$this->input()来触发复杂的自定义查询：

$filter->where(function ($query) {
    switch ($this->input) {
        case 'yes':
            // custom complex query if the 'yes' option is selected
            $query->has('somerelationship');
            break;
        case 'no':
            $query->doesntHave('somerelationship');
            break;
    }
}, 'Label of the field', 'name_for_url_shortcut')->radio([
    '' => 'All',
    'yes' => 'Only with relationship',
    'no' => 'Only without relationship',
]);
多列布局
since v1.6.0

如果过滤器太多，会把页面拉的很长，将会很影响页面的观感，这个版本将支持过滤器的多列布局, 比如6个过滤器分两列显示

$filter->column(1/2, function ($filter) {
    $filter->like('title');
    $filter->between('rate');
});

$filter->column(1/2, function ($filter) {
    $filter->equal('created_at')->datetime();
    $filter->between('updated_at')->datetime();
    $filter->equal('released')->radio([
        1 => 'YES',
        0 => 'NO',
    ]);
});
默认会有一个主键字段的过滤器放在第一列，所有左右各三个过滤器一共6个过滤器

column方法的第一个参数设置列宽度，可以设置为比例1/2或0.5，或者bootstrap的栅格列宽度比如6，如果三列的话可以设置为1/3或者4

有时候对同一个字段要设置多中筛选方式，可以通过下面的方式实现

$filter->group('rate', function ($group) {
    $group->gt('大于');
    $group->lt('小于');
    $group->nlt('不小于');
    $group->ngt('不大于');
    $group->equal('等于');
});
有下面的几个方法可以调用

// 等于
$group->equal();

// 不等于
$group->notEqual();

// 大于
$group->gt();

// 小于
$group->lt();

// 大于等于
$group->nlt();

// 小于等于
$group->ngt();

// 匹配
$group->match();

// 复杂条件
$group->where();

// like查询
$group->like();

// like查询
$group->contains();

// ilike查询
$group->ilike();

// 以输入的内容开头
$group->startWith();

// 以输入的内容结尾
$group->endWith();