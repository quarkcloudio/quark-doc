# 模型表格

## 基于数据模型的表格

Quark::table()用于生成基于数据模型的表格，下面以movies表为例：
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

$table = Quark::table(new Movie)->title('电影列表');

//第一列显示id字段，并将这一列设置为可排序列
$table->column('id', 'ID')->sortable();

//第二列显示title字段
$table->column('title', '标题');

//第三列显示director字段
$table->column('director');

//第四列显示为describe字段
$table->column('describe');

//第五列显示为rate字段
$table->column('rate');

//第六列显示released字段
$table->column('released', '上映?');

//下面为三个时间字段的列显示
$table->column('release_at');
$table->column('created_at');
$table->column('updated_at');

//search($callback)方法用来设置表格的搜索框
$table->search(function($search) {

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
$table->column('username', '用户名');
```

## 列的显示
**内容映射**
``` php
$table->column('sex','性别')->using(['1'=>'男','2'=>'女']);
```

**二维码**

通过下面的调用，会在这一列的每一行文字前面出现一个二维码icon，点击它可以展开一个小弹框，里面会显示这一列值的二维码编码图形
``` php
$table->column('link','二维码')->qrcode(); //qrcode($content=null,$width=150,$height=150)
```

**显示图片**

默认picture字段保存的是pictures表里面的id。
``` php
$table->column('picture','图片')->image();

//设置服务器和宽高
$table->column('picture')->image('http://xxx.com', 100, 100);
```

## 添加数据查询条件
默认情况下，表格的数据没有任何查询条件，可以使用model()方法来给当前表格数据添加查询条件：
``` php
$table->model()->where('id', '>', 100);

$table->model()->whereIn('id', [1, 2, 3]);

$table->model()->whereBetween('votes', [1, 100]);

$table->model()->whereColumn('updated_at', '>', 'created_at');

$table->model()->orderBy('id', 'desc');

$table->model()->take(100);
```
$table->model()后面可以直接调用Eloquent的查询方法来给表格数据添加查询条件，更多查询方法参考Laravel文档.

## 设置每页显示行数
``` php
//默认为每页20条
$table->paginate(15);
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

通过下面的代码可以关联在一个table里面:
``` php
$table = new table(new User);

$table->column('id', 'ID')->sortable();

$table->column('name');
$table->column('email');

$table->column('profile.age');
$table->column('profile.gender');
```

## 数据查询过滤
model-table提供了一系列的方法实现表格数据的查询过滤：

``` php
$table->search(function($search) {

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
// 在`$table`实例上操作
$table->expand(true);
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

**text**

**表单类型默认是text input，可以设置placeholder：**
``` php
$search->equal('column')->placeholder('请输入。。。');
```

**也可以通过下面的一些方法来限制用户输入格式：**

**select**

``` php
$search->equal('column')->select(['key' => 'value'...]);
```

**multipleSelect**

**一般用来配合in和notIn两个需要查询数组的查询类型使用，也可以在where类型的查询中使用：**
``` php
$search->in('column')->multipleSelect(['key' => 'value'...]);
```

**datetime**

**通过日期时间组件来查询**
``` php
$search->equal('column')->datetime();
```

有时候对同一个字段要设置多中筛选方式，可以通过下面的方式实现
``` php
$search->group('rate', function ($group) {
    $group->gt('大于');
    $group->lt('小于');
    $group->nlt('不小于');
    $group->ngt('不大于');
    $group->equal('等于');
});
```

有下面的几个方法可以调用
``` php
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
```

默认搜索表单不是在高级搜索框里面的，用下面的方式可以把它放到高级搜索里面：
``` php
// 在`$search`实例上操作
$search->advanced();
```
## 列过滤器

这个功能在表头给相应的列设置一个过滤器，可以更方便的根据这一列进行数据表格过滤操作：
``` php
$table->column('status', '状态')->filter([
    0 => '未知',
    1 => '已下单',
    2 => '已付款',
    3 => '已取消',
]);
```

## 行内编辑
数据表格有一系列方法，来帮助你列表里面直接对数据进行编辑。

::: tip
注意：每一个列编辑的设定，需要在form里面有一个相应的field
:::

editable

用editable方法，可以让你在表格中点击数据，在弹出的对话框里面编辑保存数据，使用方法如下

text输入
``` php
$table->column('title', '标题')->editable();
```

select选择

第二个参数是select选择的选项
``` php
$table->column('title', '标题')->editable('select', [
    1 => 'option1',
    2 => 'option2',
    3 => 'option3'
]);
```

switch开关

注意：在table中对某字段设置了switch，同时需要在form里面对该字段设置同样的switch

快速将列变成开关组件，使用方法如下：
``` php
$table->column('status','状态')->editable('switch',[
    'on'  => ['value' => 1, 'text' => '正常'],
    'off' => ['value' => 0, 'text' => '禁用']
])->width(100);
```

## 数据操作

数据表格默认有2个头部操作，新增和刷新，可以通过下面的方式开启它们：
``` php
$table->actions(function($action) {

    $action->button('create', '新增');
    
    $action->button('refresh', '刷新');
});
```

数据表格默认有3个行操作编辑、查看和删除，可以通过下面的方式开启它们：

menu样式行操作
``` php
$table->column('actions','操作')->width(100)->rowActions(function($rowAction) {

    // 编辑
    $rowAction->menu('edit', '编辑');

    // 查看
    $rowAction->menu('show', '显示');

    // 删除
    $rowAction->menu('delete', '删除')->model(function($model) {

        // 模型操作
        $model->delete();
    })->withConfirm('确认要删除吗？','删除后数据将无法恢复，请谨慎操作！'); // 确认框
});
```

button样式行操作
``` php
$table->column('actions','操作')->width(360)->rowActions(function($rowAction) {

    $rowAction->button('edit', '编辑')
    ->type('primary')
    ->size('small');

    $rowAction->button('show', '显示')
    ->type('default')
    ->size('small');

    $rowAction->button('delete', '删除')
    ->type('default',true)
    ->size('small')
    ->model(function($model) {
        $model->delete();
    })->withConfirm('确认要删除吗？','删除后数据将无法恢复，请谨慎操作！');

},'button');
```

使用下面设置批量操作方法

select样式的批量操作
``` php
// select样式的批量操作
$table->batchActions(function($batch) {

    $batch->option('', '批量操作');

    $batch->option('resume', '启用')->model(function($model) {
        $model->update(['status'=>1]);
    });

    $batch->option('forbid', '禁用')->model(function($model) {
        $model->update(['status'=>0]);
    });

    $batch->option('delete', '删除')->model(function($model) {
        $model->delete();
    })->withConfirm('确认要删除吗？','删除后数据将无法恢复，请谨慎操作！');

})->style('select',['width'=>120]);
```

button样式的批量操作
``` php
// button样式的批量操作
$table->batchActions(function($batch) {

    $batch->button('resume', '启用')
    ->type('default')
    ->size('small')
    ->model(function($model) {
        $model->update(['status'=>1]);
    });

    $batch->button('forbid', '禁用')
    ->type('default')
    ->size('small')
    ->model(function($model) {
        $model->update(['status'=>0]);
    });

    $batch->button('delete', '删除')
    ->type('default',true)
    ->size('small')
    ->model(function($model) {
        $model->delete();
    })->withConfirm('确认要删除吗？','删除后数据将无法恢复，请谨慎操作！');
})->style('button');
```