# 模型表格

## 基于数据模型的表单
Quark::from()类用于生成基于数据模型的表单，先来个例子，数据库中有movies表
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
对应的数据模型为App\Models\Movie，下面的代码可以生成movies的数据表单：

``` php
use App\Models\Movie;
use Quark;

$form = new Form(new Movie);

// 显示记录id
$form->id('id', 'ID');

// 添加text类型的input框
$form->text('title', '电影标题');

$directors = [
    1 => 'John',
    2 => 'Smith',
    3 => 'Kate' ,
];

$form->select('director', '导演')->options($directors);

// 添加describe的textarea输入框
$form->textarea('describe', '简介');

// 数字输入框
$form->number('rate', '打分');

// 添加开关操作
$form->switch('released','发布？')->options([
    'on'  => '正常',
    'off' => '禁用'
])->default(true);

// 添加日期时间选择框
$form->datetime('release_at', '发布时间');

// 两个时间显示
$form->display('created_at', '创建时间');
$form->display('updated_at', '修改时间');
```

表单脚部
使用下面的方法去掉form脚部的元素
``` php

// 去掉`重置`按钮
$form->disableReset();

// 去掉`提交`按钮
$form->disableSubmit();
```

设置布局
``` php
$layout['labelCol']['span'] = 4;
$layout['wrapperCol']['span'] = 20;

$form->layout($layout);
```

设置表单提交的action
``` php
$form->setAction('admin/users');
```

判断当前表单页是创建页面还是更新页面
``` php
$form->isCreating();
$form->isUpdating();
```

# 表单组件
在model-form中内置了大量的form组件来帮助你快速的构建form表单

## 基础方法

设置保存值
``` php
$form->text('title','标题')->value('text...');
```

设置默认值
``` php
$form->text('title','标题')->default('text...');
```

设置help信息
``` php
$form->text('title','标题')->help('help...');

// 或者
$form->text('title','标题')->extra('help...');
```

设置placeholder
``` php
$form->text('title')->placeholder('请输入。。。');
```

设置必填
``` php
$form->text('title')->required();
```

## 标签页表单
如果表单元素太多,会导致form页面太长, 这种情况下可以使用tab来分隔form:

``` php
$form->tab('Basic info', function ($form) {

    $form->text('username');

})->tab('Profile', function ($form) {

   $form->image('avatar');
   $form->text('address');
   $form->text('phone');

});
```

文本输入
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
$form->text($column, [$label])->allowClear('default');

// 输入框宽度
$form->text($column, [$label])->width(100);
```

Textarea 输入
``` php
// 添加占位符
$form->textarea($column, [$label])->placeholder('text');

// 行数
$form->textarea($column[, $label])->rows(10);

// 宽度
$form->textarea($column, [$label])->width(100);
```

Radio选择
``` php
$form->radio($column[, $label])->options(['m' => 'Female', 'f'=> 'Male'])->default('m');

$form->radio($column[, $label])->options(['m' => 'Female', 'f'=> 'Male'])->value('m');
```

Checkbox选择
``` php
$form->checkbox($column[, $label])->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);
```

Select单选
``` php
$form->select($column[, $label])->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);
```

Select多选
``` php
$form->select($column[, $label])->mode('multiple')->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);
```

日期时间输入
``` php

// 设置时间格式，更多格式参考http://momentjs.com/docs/#/displaying/format/
$form->datetime($column[, $label])->format('YYYY-MM-DD HH:mm:ss');

// 显示时间的格式
$form->datetime($column[, $label])->showTime('HH:mm:ss')->format('YYYY-MM-DD HH:mm:ss');
```

时间日期范围选择
$startDateTime、$endDateTime为开始和结束时间日期:
``` php
$form->datetimeRange($column[, $label])->value([$startDateTime,$endDateTime]);
```

时间范围选择
$startTime、$endTime为开始和结束时间:
``` php
$form->timeRange($column[, $label])->format('HH:mm')->value([$startTime,$endTime]);
```

数字输入
``` php
$form->number($column[, $label]);

// 设置最大值
$form->number($column[, $label])->max(100);

// 设置最小值
$form->number($column[, $label])->min(10);

// 步进值
$form->number($column[, $label])->step(1);
```

富文本编辑
``` php
$form->editor($column[, $label])->height(500);
```

开关
on和off对用开关的两个值1和0:
``` php
$form->switch('comment_status','允许评论')->options([
    'on'  => '是',
    'off' => '否'
])->default(true);
```

纯显示
只显示文字，不做任何操作：
``` php
$form->display($label);
```

图标选择
``` php
$form->icon($column[, $label]);
```

级联选择
``` php
$options = [
  [
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      [
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          [
            value: 'xihu',
            label: 'West Lake',
          ],
        ],
      ],
    ],
  ],
  [
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      [
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          [
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          ],
        ],
      ],
    ],
  ],
];

$form->cascader($column[, $label])->options($options);
```

搜索选择
``` php
$form->search($column[, $label])->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);

// 多个选择
$form->search($column[, $label])->mode('multiple')->options([1 => 'foo', 2 => 'bar', 'val' => 'Option name']);

// 通过ajax获取数据
$form->search($column[, $label])->ajax('/api/user/suggest');
```

搜索选择的接口代码示例
``` php
/**
* 用户建议搜索列表
*
* @param  Request  $request
* @return Response
*/
public function suggest(Request $request)
{
    // 获取参数
    $search    = $request->input('search');
    
    // 定义对象
    $query = User::query();

    // 查询用户名
    if(!empty($search)) {
        $query->where('username','like','%'.$search.'%');
    }

    // 查询列表
    $users = $query
    ->limit(20)
    ->select('username as label','id as value')
    ->get()
    ->toArray();

    return success('获取成功！','',$users);
}
```

树选择
``` php
$treeData = [
  [
    title: 'Node1',
    value: '0-0',
    children: [
      [
        title: 'Child Node1',
        value: '0-0-1',
      ],
      [
        title: 'Child Node2',
        value: '0-0-2',
      ],
    ],
  ],
  [
    title: 'Node2',
    value: '0-1',
  ],
];

$form->tree($column[, $label])->data($treeData);
```

地图控件
``` php
$form->map($column[, $label])->style(['width'=>'100%','height'=>400])->position($longitude,$latitude);
```
## 文件/图片上传

图片上传
``` php
$form->image($column[, $label]);

// 多图上传，默认数据库保存json格式数据
$form->image($column[, $label])->mode('multiple');

// 上传button文字
$form->image($column[, $label])->button('上传图片');

// 上传数量限制，默认3个文件
$form->image($column[, $label])->limitNum(4);

// 上传文件大小限制，默认2M
$form->image($column[, $label])->limitSize(20);

// 上传文件类型限制
$form->image($column[, $label])->limitType(['image/jpeg','image/png']);
```

文件上传
``` php
$form->file($column[, $label]);

// 上传button文字
$form->file($column[, $label])->button('上传附件');

// 上传数量限制，默认3个文件
$form->file($column[, $label])->limitNum(4);

// 上传文件大小限制，默认2M
$form->file($column[, $label])->limitSize(20);

// 上传文件类型限制
$form->file($column[, $label])->limitType(['image/jpeg','image/png']);
```

## 表单验证
model-form使用Laravel的验证规则来验证表单提交的数据：
``` php
$form->text('title','标题')->rules(
    ['required','min:6','max:20'],
    ['required'=>'标题必须填写','min'=>'标题不能少于6个字符','max'=>'标题不能超过20个字符']
);
```

创建页面规则，只在创建表单提交时生效
``` php
$form->text('username','用户名')->creationRules(
    ["unique:admins"],
    ['unique'=>'用户名已经存在']
);
```

更新页面规则，只在更新表单提交时生效
``` php
$form->text('username','用户名')->updateRules(
    ["unique:admins,username,{id}"],
    ['unique'=>'用户名已经存在']
);
```

数据库unique检查
一个比较常见的场景是提交表单是检查数据是否已经存在，可以使用下面的方式：
``` php
$form->text('username','用户名')
->creationRules(["unique:admins"],['unique'=>'用户名已经存在'])
->updateRules(["unique:admins,username,{id}"],['unique'=>'用户名已经存在']);
```

## 模型表单回调
model-form目前提供了下面几个方法来接收回调函数：

``` php
//保存前回调
$form->saving(function ($form) {
    //...
});
```

可以从回调参数$form中获取当前提交的表单数据：
``` php
$form->saving(function ($form) {

    dump($form->request['username']);

});
```

或者给某一个表单项赋值：
``` php
$form->saving(function ($form) {

    $form->request['slug'] = $form->request['name'];
    
});
```