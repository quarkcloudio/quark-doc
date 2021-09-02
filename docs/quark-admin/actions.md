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

动作最重要的方法是`handle`方法。该`handle`方法接收该操作所附的任何字段的值，以及选定模型的集合。即使仅针对单个模型执行操作，该`handle`方法也**始终**接收`Collection`模型。

在该`handle`方法内，您可以执行完成操作所需的任何任务。您可以自由更新数据库记录，发送电子邮件，致电其他服务等。

## 动作可见度

默认情况下，操作在资源索引和详细信息屏幕上都是可见的。此外，默认情况下，内联操作从表行的操作下拉列表中隐藏。定义动作时，可以通过在动作上设置以下方法之一来指定其可见性：

-   `onlyOnIndex`
-   `exceptOnIndex`
-   `showOnIndex`
-   `onlyOnDetail`
-   `exceptOnDetail`
-   `showOnDetail`
-   `onlyOnTableRow`
-   `exceptOnTableRow`
-   `showOnTableRow`

## [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#action-fields)行动领域

有时，您可能希望在分派操作之前从用户那里收集其他信息。因此，Nova允许您将Nova支持的大多数[字段](https://nova.laravel.com/docs/2.0/resources/fields.html)直接附加到动作上。启动操作时，Nova将提示用户提供以下字段的输入：

![行动领域](https://nova.laravel.com/docs/assets/img/action-field.b545d287.png)

要将字段添加到动作，请将字段添加到该动作的`fields`方法返回的字段数组中：

```
use Laravel\Nova\Fields\Text;

/**
 * Get the fields available on the action.
 *
 * @return array
 */
public function fields()
{
    return [
        Text::make('Subject'),
    ];
}

```

最后，在您的操作`handle`方法内，您可以使用提供的`ActionFields`实例上的动态访问器来访问字段：

```
/**
 * Perform the action on the given models.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Support\Collection  $models
 * @return mixed
 */
public function handle(ActionFields $fields, Collection $models)
{
    foreach ($models as $model) {
        (new AccountData($model))->send($fields->subject);
    }
}

```

## [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#action-modal-customization)动作模式自定义

默认情况下，操作将在运行前要求用户确认。您可以自定义确认消息，确认按钮和取消按钮，以在执行操作之前为用户提供更多上下文。这是通过指定的完成`confirmText`，`confirmButtonText`以及`cancelButtonText`定义操作时的方法：

```
/**
 * Get the actions available for the resource.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return array
 */
public function actions(Request $request)
{
    return [
        (new Actions\ActivateUser)
            ->confirmText('Are you sure you want to activate this user?')
            ->confirmButtonText('Activate')
            ->cancelButtonText("Don't activate"),
    ];
}

```

这将自定义模式，如下所示：

![动作定制](https://nova.laravel.com/docs/assets/img/action-customization.52d158fd.png)

## [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#action-responses)动作回应

通常，执行操作时，Nova UI中会显示通用的“成功”消息。但是，您可以使用`Action`类上的各种方法来自定义此响应。

要显示自定义的“成功”消息，可以`Action::message`从您的`handle`方法中返回该方法的结果：

```
/**
 * Perform the action on the given models.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Support\Collection  $models
 * @return mixed
 */
public function handle(ActionFields $fields, Collection $models)
{
    // ...

    return Action::message('It worked!');
}

```

要返回红色的“危险”消息，可以使用以下`Action::danger`方法：

```
return Action::danger('Something went wrong!');

```

#### [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#redirect-responses)重定向响应

要在执行操作后将用户重定向到一个全新的位置，可以使用以下`Action::redirect`方法：

```
return Action::redirect('https://example.com');

```

要将用户重定向到内部路由，请使用以下`Action::push`方法：

```
return Action::push('/resources/posts/new', [
  'viaResource' => 'users',
  'viaResourceId' => 1,
  'viaRelationship' => 'posts'
]);

```

#### [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#download-responses)下载回应

要在执行操作后启动文件下载，可以使用该`Action::download`方法。该`download`方法将要下载的文件的URL作为其第一个参数，并将文件的所需名称作为其第二个参数：

```
return Action::download('https://example.com/invoice.pdf', 'Invoice.pdf');

```

## [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#queued-actions)排队的动作

有时，您可能需要花费一些时间才能完成运行。出于这个原因，Nova让您[排队](https://laravel.com/docs/queues)行动很容易。要指示Nova将操作排入队列而不是同步运行，请在`ShouldQueue`界面上标记该操作：

```
<?php

namespace App\Nova\Actions;

use App\AccountData;
use Illuminate\Bus\Queueable;
use Laravel\Nova\Actions\Action;
use Illuminate\Support\Collection;
use Laravel\Nova\Fields\ActionFields;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class EmailAccountProfile extends Action implements ShouldQueue
{
  use InteractsWithQueue, Queueable;

  // ...
}

```

使用排队操作时，请不要忘记为应用程序配置和启动队列工作器。否则，您的操作将不会被处理。

排队的操作文件

目前，Nova不支持将`File`字段附加到排队的操作。如果需要将`File`字段附加到操作，则该操作必须同步运行。

#### [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#customizing-the-connection-and-queue)自定义连接和队列

您可以通过在操作上定义`$connection`和`$queue`属性来自定义操作排队的队列连接和队列名称：

```
/**
 * The name of the connection the job should be sent to.
 *
 * @var string|null
 */
public $connection = 'redis';

/**
 * The name of the queue the job should be sent to.
 *
 * @var string|null
 */
public $queue = 'emails';

```

## [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#action-log)动作日志

查看针对资源运行的操作的日志通常很有用。此外，在对操作进行排队时，知道它们何时真正完成通常很重要。值得庆幸的是，Nova通过将`Laravel\Nova\Actions\Actionable`特征附加到资源的相应Eloquent模型来轻松地向该资源添加操作日志。

例如，我们可以将`Laravel\Nova\Actions\Actionable`特征附加到`User`Eloquent模型：

```
<?php

namespace App;

use Laravel\Nova\Actions\Actionable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
  use Actionable, Notifiable;

  // ...
}

```

将特征附加到模型后，Nova将自动开始在资源的详细信息屏幕底部显示操作日志：

![动作日志](https://nova.laravel.com/docs/assets/img/action-log.1b96fe60.png)

### [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#disabling-the-action-log)禁用操作日志

如果您不想在操作日志中记录操作，则可以通过`withoutActionEvents`在操作类上添加属性来禁用此行为：

```
/**
 * Disables action log events for this action.
 *
 * @var bool
 */
public $withoutActionEvents = true;

```

或者，使用该`withoutActionEvents`方法，可以在将操作附加到资源时为该操作禁用操作日志：

```
/**
 * Get the actions available for the resource.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return array
 */
public function actions(Request $request)
{
    return [
        (new SomeAction)->withoutActionEvents()
    ];
}

```

### [＃](https://nova.laravel.com/docs/2.0/actions/defining-actions.html#queued-action-statuses)排队的动作状态

当排队的操作正在运行时，您可以为通过其模型集合传递给该操作的任何模型更新该操作的“状态”。例如，您可以使用操作的`markAsFinished`方法来指示该操作已完成对特定模型的处理：

```
/**
 * Perform the action on the given models.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Support\Collection  $models
 * @return mixed
 */
public function handle(ActionFields $fields, Collection $models)
{
    foreach ($models as $model) {
        (new AccountData($model))->send($fields->subject);

        $this->markAsFinished($model);
    }
}

```

或者，如果您想指示某个动作对于给定的模型“失败”，则可以使用以下`markAsFailed`方法：

```
/**
 * Perform the action on the given models.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Support\Collection  $models
 * @return mixed
 */
public function handle(ActionFields $fields, Collection $models)
{
    foreach ($models as $model) {
        try {
            (new AccountData($model))->send($fields->subject);
        } catch (Exception $e) {
            $this->markAsFailed($model, $e);
        }
    }
}
```