# 详情组件

## 数据模型详情

从表格操作列的眼睛图表按钮或者显示点击进入数据的详情显示页面
Quark::from()类用于生成从表格操作列的眼睛图表按钮或者显示点击进入数据的详情显示页面

以下面的posts表为例：
``` sql
posts
    id          - integer
    author_id   - integer
    content     - text
    title       - string
    content     - text
    rate        - integer
    release_at  - timestamp
```
对应的数据模型为App\Models\Post，下面的代码可以显示posts表的数据的详情：
``` php
<?php

namespace App\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Quark;

class PostController extends Controller
{
    protected function detail($id)
    {
        $show = Quark::show(Post::findOrFail($id)->toArray())->title('详情页');

        $show->field('id', 'ID');
        $show->field('title', '标题');
        $show->field('content', '内容');
        $show->field('rate');
        $show->field('created_at');
        $show->field('updated_at');
        $show->field('release_at');

        //渲染前回调
        $show->rendering(function ($show) {

            if(empty($show->data['created_at'])) {
                $show->data['created_at'] = '暂无';
            }

            if(empty($show->data['updated_at'])) {
                $show->data['updated_at'] = '暂无';
            }
        });

        return $show;
    }
}
```
如果你的控制器中没有detail方法, 参考上面的代码，加入这个方法

## 字段显示
image，字段avatar的内容是图片的路径或者url，可以将它显示为图片：
``` php
$show->field('avatar', '头像')->image();
```