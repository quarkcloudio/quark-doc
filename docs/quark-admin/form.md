# 表单组件

## 简介
通过 QuarkAdmin 的 Form 组件您可以创建一个漂亮、简洁、功能齐全的表单页。每个 Form 组件都可以对应一个「模型」用来与该表交互。你可以通过模型完成表单的提交操作。

#### 效果预览
![table](./images/form.png)

## 快速入门
在Table组件章节已经介绍过了，QuarkAdmin 的各组件初始化相对比较统一，我们下面看一下简单的用法：
``` php
<?php

namespace App\Http\Controllers\Admin;

use App\Models\Link;
use Quark;
use QuarkCMS\QuarkAdmin\Http\Controllers\Controller;

class LinkController extends Controller
{
    protected function form()
    {
        $form = Quark::form(new Link)->title($this->title);
        ...
        return $form;
    }
}
```
在所有Form组件使用的文档里，示例控制器都应继承`QuarkCMS\QuarkAdmin\Http\Controllers\Controller`类，`$form` 是指 `Quark::form()` 得到的实例，这里就不在每个页面单独写了。

#### 下面我们正式开启Form组件的使用旅程：
我们还是以 [Table](./table.html) 组件章节的[友情链接模型](./table.html#下面我们正式开启Table组件的使用旅程)为例，用下面的代码生成友情链接表links的表单页 [示例代码](https://github.com/quarkcms/quark-cms/blob/master/app/Http/Controllers/Admin/LinkController.php#L112)：

``` php
use App\Models\Link;
use Quark;

$form = Quark::form(new Link);
$title = $form->isCreating() ? '创建'.$this->title : '编辑'.$this->title;
$form->title($title);
$form->hidden('id');
$form->text('title','标题')
->rules(['required','max:200'],['required'=>'标题必须填写','max'=>'标题不能超过200个字符']);
$form->text('url','链接');
$form->image('cover_id','封面图')->button('上传图片');
$form->number('sort','排序')->value(0);
$form->switch('status','状态')->options([
    'on'  => '正常',
    'off' => '禁用'
])->default(true);

```
配置好相应的[路由]()、[菜单]()后，点开我们新添加的菜单就可以看到如下页面：

![form](./images/form-page.png)

## 基本使用

### 初始化表单
你可以通过Quark门面快速实例化一个Form对象，如有必要你可以传入一个Model实例，来给表格组件绑定一个模型（注意：绑定模型并不是必须的，这取决于你是否使用了Form组件提供的增、改等操作）
``` php
Quark::form(new Link);
```

### 表单标题
可以通过`title()`方法来设置表单的标题
``` php
$form->title('友情链接');
```

### 表单宽度
可以通过`width()`方法来设置表单宽度
``` php
$form->width(600);
```

### 是否显示 Label 后面的冒号
表示是否显示 `label` 后面的冒号 (只有在属性 `layout` 为 `horizontal` 时有效)
``` php
$form->colon();
```

### 表单默认值
你可以自行给表单赋值
``` php
$form->initialValues($data);
```

### Label标签的文本对齐方式
label 标签的文本对齐方式,`'left'` | `'right'`
``` php
$form->labelAlign('left');
```

### 当字段被删除时保留字段值
当字段被删除时保留字段值，默认`true`
``` php
$form->preserve();
```

### 自动滚动到第一个错误字段
提交失败自动滚动到第一个错误字段，默认`'false'`
``` php
$form->scrollToFirstError();
```

### 设置组件的尺寸
设置字段组件的尺寸,`'small'` | `'middle'` | `'large'`，默认`'default'`
``` php
$form->size('small');
```

### 表单布局
表单布局，`'horizontal'` | `'vertical'`，默认为`'horizontal'`竖排
``` php
$form->layout('vertical');
```

### Label 标签布局
Label 标签布局，同 `<Col>` 组件，设置 `span offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}`
``` php
$form->labelCol(['span' => 2]);
```

### wrapperCol
需要为输入控件设置布局样式时，使用该属性，用法同 `labelCol`
``` php
$form->wrapperCol(['span' => 14]);
```

### 自定义表单提交接口
你可以自定义表单提交的api接口，，在默认的情况下系统会根据当前控制器自动生成指定的接口
``` php
$form->api(backend_url('api/admin/menu/save'));
```

### 判断是否为创建页面
判断是否为创建页面，会返回`bool`类型的数据
``` php
$form->isCreating();
```

### 判断是否为编辑页面
判断是否为编辑页面，会返回`bool`类型的数据
``` php
$form->isEditing();
```

### 禁用重置按钮
``` php
$form->disabledResetButton();
```

### 重置按钮文字展示
``` php
$form->resetButtonText('重置');
```

### 禁用提交按钮
``` php
$form->disabledSubmitButton();
```

### 提交按钮文字展示
``` php
$form->submitButtonText('提交');
```

## 表单控件
在Form组件中内置了大量表单控件来帮助你快速的构建页面

### 基础方法

#### 设置默认值
``` php
$form->text('title','标题')->default('text...');
```

#### 设置保存值
::: tip
注意：如果你同时使用`default()`方法和`value()`方法给字段赋值，`value()`方法设置的值会冲掉`default()`设置的值
:::

``` php
$form->text('title','标题')->value('text...');
```

#### 设置提示信息
``` php
$form->text('title','标题')->help('help...');

// 或者
$form->text('title','标题')->extra('help...');
```

#### 设置占位符
``` php
$form->text('title')->placeholder('请输入。。。');
```

#### 设置必填
``` php
$form->text('title')->required();
```

#### 设置禁用
``` php
$form->text('title')->disabled();
```

#### 保存到数据库时忽略字段值
``` php
$form->text('title')->ignore();
```

### 隐藏域（hidden）控件
``` php
$form->hidden($column);
```

### 文本输入（text）控件
``` php
$form->text($column, [$label]);

// 添加占位符
$form->text($column, [$label])->placeholder('text');

// 带标签的 input，设置后置标签。例如：'http://'
$form->text($column, [$label])->addonAfter('http://');

// 带标签的 input，设置前置标签。例如：'.com'
$form->text($column, [$label])->addonAfter('.com');

// 最大长度
$form->text($column, [$label])->maxLength(20);

// 控件大小。注：标准表单内的输入框大小限制为 large。可选 large default small
$form->text($column, [$label])->size('default');

// 可以点击清除图标删除内容
$form->text($column, [$label])->allowClear();

// 输入框宽度
$form->text($column, [$label])->width(100);
```

### 文本域（textarea）控件
``` php
// 添加占位符
$form->textarea($column, [$label])->placeholder('text');

// 行数
$form->textarea($column[, $label])->rows(10);

// 宽度
$form->textarea($column, [$label])->width(100);
```

### 单选（radio）控件
``` php
$form->radio($column[, $label])->options(['m' => 'Female', 'f'=> 'Male'])->default('m');

$form->radio($column[, $label])->options(['m' => 'Female', 'f'=> 'Male'])->value('m');
```

### 多选（checkbox）控件
``` php
$form->checkbox($column[, $label])->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);
```

### 下拉框（select）控件
``` php

// 单选模式
$form->select($column[, $label])->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);

// 多选模式
$form->select($column[, $label])->mode('multiple')->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);

// tags模式
$form->select($column[, $label])->mode('tags')->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);
```

#### 下拉框（select）控件联动
``` php

// 下拉框联动
$form->select('province', '省')->options([1 => '北京', 2 => '天津', 3 => '河北省'])->load('city','admin/area/cities');

// 市
$form->select('city', '市');
```

#### 下拉框联动的接口代码示例
``` php
public function cities(Request $request)
{
    // 获取参数
    $pid = $request->input('search');

    // 获取数据
    $options = Area::where('pid',$pid)->select('id as value','area_name as label')->get()->toArray();

    return success('获取成功','',$options);
}
```

### 日期时间（date）控件
``` php

$form->date($column[, $label]);
```

### 日期范围（dateRange）控件
$startDate、$endDate为开始和结束日期:
``` php
$form->dateRange($column[, $label])->value([$startDate,$endDate]);
```

### 日期时间（datetime）控件
``` php

$form->datetime($column[, $label]);
```

### 时间日期范围（datetimeRange）控件
$startDateTime、$endDateTime为开始和结束时间日期:
``` php
$form->datetimeRange($column[, $label])->value([$startDateTime,$endDateTime]);
```

### 时间（time）控件
``` php
$form->time($column[, $label]);
```

### 时间范围（timeRange）控件
$startTime、$endTime为开始和结束时间:
``` php
$form->timeRange($column[, $label])->format('HH:mm')->value([$startTime,$endTime]);
```

### 数字输入（number）控件
``` php
$form->number($column[, $label]);

// 设置最大值
$form->number($column[, $label])->max(100);

// 设置最小值
$form->number($column[, $label])->min(10);

// 步进值
$form->number($column[, $label])->step(1);
```

### 富文本编辑器（editor）
``` php
$form->editor($column[, $label])->height(500)->width(600);
```

### 开关（switch）控件
on和off对用开关的两个值 `true` 和 `false`:
``` php
$form->switch('comment_status','允许评论')->options([
    'on'  => '是',
    'off' => '否'
])->default(true);
```

### 纯展示
只显示文字，不做任何操作：
``` php
$form->display($label);
```

### 图标选择（icon）控件
``` php
$form->icon($column[, $label]);
```

### 级联选择（cascader）控件
``` php
$options = [
  [
    'value' => 'zhejiang',
    'label' => 'Zhejiang',
    'children' => [
      [
        'value' => 'hangzhou',
        'label' => 'Hangzhou'
      ]
    ]
  ]
];

$form->cascader($column[, $label])->options($options);

// 通过ajax获取数据
$options = Area::where('level',1)->select('id as value','area_name as label')->get()->toArray();

// 通过isLeaf属性设定是否有下一级
foreach ($options as $key => $value) {
    $options[$key]['isLeaf'] = false;
}

$form->cascader($column[, $label])->options($options)->api('admin/area/suggest');
```

#### 级联选择的接口代码示例
``` php
public function suggest(Request $request)
{
    // 获取参数
    $pid = $request->input('search');

    // 当前层级
    $level = $request->input('level');

    // 获取数据
    $options = Area::where('pid',$pid)->select('id as value','area_name as label')->get()->toArray();
    
    // 设定层级超过2后，不在获取数据
    if($level < 2) {
        foreach ($options as $key => $value) {
            $options[$key]['isLeaf'] = false;
        }
    }

    return success('获取成功','',$options);
}
```

### 搜索（search）控件
``` php
$form->search($column[, $label])->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);

// 多个选择
$form->search($column[, $label])->mode('multiple')->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);

// 通过ajax获取数据
$form->search($column[, $label])->api('/api/user/suggest');
```

#### 搜索选择的接口代码示例
``` php
public function suggest(Request $request)
{
    // 获取参数
    $search = $request->input('search');

    // 获取类型：当type为'value'时，search传入的为下拉框的值;当type为'label'时，search传入的为下拉框的文本
    $type = $request->input('type','label');
    
    // 定义对象
    $query = User::query();

    if($type === 'label') {
        // 查询用户名
        if(!empty($search)) {
            $query->where('nickname','like','%'.$search.'%');
        }
    } elseif($type === 'value') {
        if(!empty($search)) {
            $query->where('id', $search);
        }
    }

    // 查询列表
    $users = $query
    ->limit(20)
    ->where('status', '>', 0)
    ->orderBy('id', 'desc')
    ->select('nickname as label','id as value')
    ->get()
    ->toArray();

    return success('获取成功！','',$users);
}
```

### 树型选择（tree）控件
``` php
$treeData = [
  [
    'title' => 'Node1',
    'value' => '0-0',
    'children' => [
      [
        'title' => 'Child Node1',
        'value' => '0-0-1',
      ],
      [
        'title' => 'Child Node2',
        'value' => '0-0-2',
      ],
    ],
  ],
  [
    'title' => 'Node2',
    'value' => '0-1',
  ]
];

$form->tree($column[, $label])->data($treeData);
```

### 地图坐标选择（map）控件
``` php
$form->map($column[, $label])->style(['width'=>'100%','height'=>400])->position($longitude,$latitude);
```

### 图片上传（image）控件
``` php
$form->image($column[, $label]);

// 多图上传，默认数据库保存json格式数据，model可选 'multiple' | 'single' 或者缩写 'm' | 's'
$form->image($column[, $label])->mode('multiple');

// 上传button文字
$form->image($column[, $label])->button('上传图片');

// 上传数量限制，默认3个文件
$form->image($column[, $label])->limitNum(4);

// 上传文件大小限制，默认2M
$form->image($column[, $label])->limitSize(20);

// 上传文件类型限制，类型支持后缀方式，例如['jpeg','png']这样的数组也是可以的
$form->image($column[, $label])->limitType(['image/jpeg','image/png']);

// 上传尺寸限制
$form->image($column[, $label])->limitWH(200，200);
```

### 文件上传（file）控件
``` php
$form->file($column[, $label]);

// 上传button文字
$form->file($column[, $label])->button('上传附件');

// 上传数量限制，默认3个文件
$form->file($column[, $label])->limitNum(4);

// 上传文件大小限制，默认2M
$form->file($column[, $label])->limitSize(20);

// 上传文件类型限制，类型支持后缀方式，例如['jpeg','png']这样的数组也是可以的
$form->file($column[, $label])->limitType(['image/jpeg','image/png']);
```

### 嵌套表单字段（list）控件
``` php
$form->list($column[, $label])->button('添加数据')->item(function ($form) {
	$form->text($column, [$label]);
	...
});
```

## 表单联动
表单联动是指，在选择表单项的指定的选项时，联动显示其他的表单项。

### 文本框控件
``` php
$form->text('column')->when('hello', function ($form) {
    $form->select('options')->options();
});
```

### 单选控件
``` php
$form->radio('nationality', '国籍')->options([
    1 => '本国',
    2 => '外国',
])->when(1, function ($form) { 
    $form->text('name', '姓名');
    $form->text('idcard', '身份证');
})->when(2, function ($form) { 
    $form->text('name', '姓名');
    $form->text('passport', '护照');
});
```
上例中，方法`when(1, $callback)`等效于`when('=', 1, $callback)`, 如果用操作符`=`，则可以省略这个参数，同时也支持这些操作符 `=`、`>`、`>=`、`<`、`<=`、`!=`、`in`、`notIn` 使用方法如下：
``` php
$form->radio('check')->when('>', 1, function () {

})->when('>=', 2, function () {

})->when('in', [5, 6], function () {

})->when('notIn', [7, 8], function () {

});
```

## 表单验证

### 通用规则
Form组件使用Laravel的验证规则来验证表单提交的数据：
``` php
$form->text('title','标题')->rules(
    ['required','min:6','max:20'],
    ['required'=>'标题必须填写','min'=>'标题不能少于6个字符','max'=>'标题不能超过20个字符']
);
```

### 创建页规则
创建页面规则，只在创建表单提交时生效
``` php
$form->text('username','用户名')->creationRules(
    ["unique:admins"],
    ['unique'=>'用户名已经存在']
);
```

### 编辑页规则
更新页面规则，只在更新表单提交时生效
``` php
$form->text('username','用户名')->updateRules(
    ["unique:admins,username,{id}"],
    ['unique'=>'用户名已经存在']
);
```

### 数据库unique检查
一个比较常见的场景是提交表单是检查数据是否已经存在，可以使用下面的方式：
``` php
$form->text('username','用户名')
->creationRules(["unique:admins"],['unique'=>'用户名已经存在'])
->updateRules(["unique:admins,username,{id}"],['unique'=>'用户名已经存在']);
```

## 表单回调
Form组件目前提供了下面几个方法来接收回调函数

### 创建页面显示前回调
可以通过对`$form->initialValues`的值更改，来给编辑页面、创建页面表单的值重置
``` php
// 创建页面显示前回调
$form->creating(function ($form) {

    // $form->values 原始值
    if(isset($form->values['avatar'])) {
        $form->values['avatar'] = get_picture($form->values['avatar'],0,'all');
    }
    
    // $form->initialValues 解析后的值
    if(isset($form->initialValues['avatar'])) {
        $form->initialValues['avatar'] = get_picture($form->initialValues['avatar'],0,'all');
    }
});
```

### 编辑页面展示前回调
可以通过对`$form->initialValues`的值更改，来给编辑页面、创建页面表单的值重置
``` php
// 编辑页面展示前回调
$form->editing(function ($form) {
    if(isset($form->values['avatar'])) {
        $form->values['avatar'] = get_picture($form->values['avatar'],0,'all');
    }

    if(isset($form->initialValues['avatar'])) {
        $form->initialValues['avatar'] = get_picture($form->initialValues['avatar'],0,'all');
    }
});
```

### 保存数据前回调
``` php
// 保存数据前回调
$form->saving(function ($form) {
    //...
});
```

可以从回调参数`$form->data`中获取当前提交的表单数据：
``` php
$form->saving(function ($form) {
    dump($form->data['username']);
});
```

或者给某一个表单项赋值：
``` php
$form->saving(function ($form) {
    $form->data['slug'] = $form->data['name'];
});
```

### 保存数据后回调
保存数据后的返回结果可以通过`$form->model()`获取，你可以根据不同的结果进行不同的响应
``` php
// 保存数据后回调
$form->saved(function ($form) {
    // 保存数据后的返回结果可以通过$form->model()获取
    if($form->model()) {
        if($form->isCreating()) {
            $form->model()->id;
        } else {
            Admin::where('id',request('id'))->first()->syncRoles(request('role_ids'));
        }
        return success('操作成功！',frontend_url('admin/admin/index'));
    } else {
        return error('操作失败，请重试！');
    }
});
```

## Tab表单
如果表单元素太多,会导致form页面太长, 这种情况下可以使用tab来分隔form:
``` php
$form = new TabForm(new Movie);

$form->tab('Basic info', function ($form) {
    $form->text('username');
})->tab('Profile', function ($form) {
    $form->image('avatar');
    $form->text('address');
    $form->text('phone');
});
```