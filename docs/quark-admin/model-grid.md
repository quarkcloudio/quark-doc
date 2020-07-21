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

// 第一列显示id字段，并将这一列设置为可排序列
$grid->column('id', 'ID')->sortable();

// 第二列显示title字段
$grid->column('title', '标题');

// 第三列显示director字段
$grid->column('director');

// 第四列显示为describe字段
$grid->column('describe');

// 第五列显示为rate字段
$grid->column('rate');

// 第六列显示released字段
$grid->column('released', '上映?');

// 下面为三个时间字段的列显示
$grid->column('release_at');
$grid->column('created_at');
$grid->column('updated_at');

// search($callback)方法用来设置表格的搜索框
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
// 直接通过字段名`username`添加列
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
$grid->column('link','二维码')->qrcode(); // qrcode($content=null,$width=150,$height=150)
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
// 默认为每页20条
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