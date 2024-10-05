# 行为

## 定义行为

QuarkAdmin操作使您可以在一个或多个Eloquent模型上执行自定义任务。例如，您可以编写一个操作，向用户发送一封电子邮件，其中包含他们所请求的帐户数据。或者，您可以编写一个操作来将一组记录转移给另一个用户。

默认情况下，所有操作都放置在`app/Admin/Actions`目录中，要了解如何定义QuarkAdmin动作，我们来看一个示例。在此示例中，我们将定义一个删除的操作：

```php
<?php

namespace App\Admin\Actions;

use QuarkCMS\QuarkAdmin\Actions\Action;

class Delete extends Action
{
    /**
     * 行为名称
     *
     * @var string
     */
    public $name = '删除';

    /**
     * 设置按钮类型,primary | ghost | dashed | link | text | default
     *
     * @var string
     */
    public $type = 'link';

    /**
     * 设置按钮大小,large | middle | small | default
     *
     * @var string
     */
    public $size = 'small';

    /**
     * 初始化
     * 
     * @return void
     */
    public function __construct()
    {
        $this->withConfirm('确定要删除吗？', '删除后数据将无法恢复，请谨慎操作！');
    }

    /**
     * 行为接口接收的参数，当行为在表格行展示的时候，可以配置当前行的任意字段
     *
     * @return array
     */
    public function apiParams()
    {
        return ['id'];
    }

    /**
     * 执行行为
     *
     * @param  Fields  $fields
     * @param  Collection  $model
     * @return mixed
     */
    public function handle($fields, $model)
    {
        $result = $model->delete();

        return $result ? success('操作成功！') : error('操作失败，请重试！');
    }
}
```

行为最重要的方法是`handle`方法。该`handle`方法接收该操作所附的任何字段的值，以及选定模型的集合。即使仅针对单个模型执行操作，该`handle`方法也**始终**接收`Collection`模型。

在该`handle`方法内，您可以执行完成操作所需的任何任务。您可以自由更新数据库记录，发送电子邮件，致电其他服务等。

### 行为可见度

默认情况下，操作在资源索引和详细信息屏幕上都是可见的。此外，默认情况下，内联操作从表行的操作下拉列表中隐藏。定义行为时，可以通过在行为上设置以下方法之一来指定其可见性：

-   `onlyOnIndex`
-   `exceptOnIndex`
-   `showOnIndex`
-   `onlyOnDetail`
-   `exceptOnDetail`
-   `showOnDetail`
-   `onlyOnTableRow`
-   `exceptOnTableRow`
-   `showOnTableRow`

### 行为类型
QuarkAdmin 暂时封装了`Drawer`、`Link`、`Modal`几种类型的动作，下面我们看一下如何使用：

#### 抽屉行为

Drawer行为可以弹出抽屉，用来完成具体操作；例如下面的代码，可以在列表页生成抽屉类型的操作：
```php
<?php

namespace App\Admin\Actions;

use QuarkCMS\Quark\Facades\Form;
use QuarkCMS\QuarkAdmin\Actions\Drawer;
use QuarkCMS\QuarkAdmin\Http\Requests\ResourceCreateRequest;
use QuarkCMS\Quark\Facades\Action;

class CreateDrawer extends Drawer
{
    /**
     * 设置按钮类型,primary | ghost | dashed | link | text | default
     *
     * @var string
     */
    public $type = 'primary';

    /**
     * 设置图标
     *
     * @var string
     */
    public $icon = 'plus-circle';

    /**
     * 初始化
     *
     * @param  string  $name
     * 
     * @return void
     */
    public function __construct($name)
    {
        $this->name = '创建' . $name;
    }

    /**
     * 弹窗内容
     * 
     * @return $string
     */
    public function body()
    {
        $request = new ResourceCreateRequest;

        // 表单
        return Form::key('createDrawerForm')
        ->api($request->newResource()->creationApi($request))
        ->items($request->newResource()->creationFields($request))
        ->initialValues($request->newResource()->beforeCreating($request))
        ->labelCol([
            'span' => 6
        ])
        ->wrapperCol([
            'span' => 18
        ]);
    }

    /**
     * 弹窗行为
     *
     * @return $this
     */
    public function actions()
    {
        return [
            Action::make('取消')->actionType('cancel'),
            
            Action::make("提交")
            ->reload('table')
            ->type('primary')
            ->actionType('submit')
            ->submitForm('createDrawerForm')
        ];
    }
}
```

#### 弹窗行为

Modal行为可以生成弹窗，用来完成具体操作；例如下面的代码，可以在列表页生成弹窗类型的操作：
```php
<?php

namespace App\Admin\Actions;

use QuarkCMS\Quark\Facades\Form;
use QuarkCMS\QuarkAdmin\Actions\Modal;
use QuarkCMS\QuarkAdmin\Http\Requests\ResourceCreateRequest;
use QuarkCMS\Quark\Facades\Action;

class CreateModal extends Modal
{
    /**
     * 设置按钮类型,primary | ghost | dashed | link | text | default
     *
     * @var string
     */
    public $type = 'primary';

    /**
     * 设置图标
     *
     * @var string
     */
    public $icon = 'plus-circle';

    /**
     * 初始化
     *
     * @param  string  $name
     * 
     * @return void
     */
    public function __construct($name)
    {
        $this->name = '创建' . $name;
    }

    /**
     * 弹窗内容
     * 
     * @return $string
     */
    public function body()
    {
        $request = new ResourceCreateRequest;

        // 表单
        return Form::key('createModalForm')
        ->api($request->newResource()->creationApi($request))
        ->items($request->newResource()->creationFields($request))
        ->initialValues($request->newResource()->beforeCreating($request))
        ->labelCol([
            'span' => 6
        ])
        ->wrapperCol([
            'span' => 18
        ]);
    }

    /**
     * 弹窗行为
     *
     * @return $this
     */
    public function actions()
    {
        return [
            Action::make('取消')->actionType('cancel'),
            
            Action::make("提交")
            ->reload('table')
            ->type('primary')
            ->actionType('submit')
            ->submitForm('createModalForm')
        ];
    }
}
```

#### 链接行为

Link行为可以生成一个带连接的按钮，用来完成页面跳转操作：
```php
<?php

namespace App\Admin\Actions;

use Illuminate\Support\Str;
use QuarkCMS\QuarkAdmin\Actions\Link;

class CreateLink extends Link
{
    /**
     * 设置按钮类型,primary | ghost | dashed | link | text | default
     *
     * @var string
     */
    public $type = 'primary';

    /**
     * 设置图标
     *
     * @var string
     */
    public $icon = 'plus-circle';

    /**
     * 初始化
     *
     * @param  string  $name
     * 
     * @return void
     */
    public function __construct($name)
    {
        $this->name = '创建' . $name;
    }

    /**
     * 跳转链接
     *
     * @return string
     */
    public function href()
    {
        return '#/index?api=' . Str::replaceLast('/index', '/create', 
            Str::replaceFirst('api/','',\request()->path())
        );
    }
}
```

## 注册行为

一旦你定义了行为, 你便可以将它注册到一个资源中. 每一个资源都通过容器中 `actions` 方法注册行为, 你只需要将行为项实例放入 `actions` 方法的返回数组中即可:

```php
/**
 * 行为
 *
 * @param  Request  $request
 * @return object
 */
public function actions(Request $request)
{
    return [
        (new \App\Admin\Actions\Delete('删除'))->onlyOnTableRow(),
    ];
}
```