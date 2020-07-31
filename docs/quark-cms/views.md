# 视图

## 文章列表页

文章列表数据
``` html
    @foreach($articles as $key => $article)
        <img src="{{ get_picture($article['cover_ids']) }}">
        <a href="/home/article/detail?id={{$article->id}}">{{$article->title}}</a>
        {{date('Y-m-d',strtotime($article->created_at))}}
    @endforeach
```
文章列表分页
``` html
    {{ $articles->appends(['name'=>$category->name])->links() }}
```

## 文章详情页

文章标题
``` html
{{$article->title}}
```
文章作者
``` html
{{$article->author}}
```
文章描述
``` html
{{$article->description}}
```
发布日期
``` html
{{$article->created_at}}
```
浏览量
``` html
{{$article->view}}
```
文章内容
``` html
{!!$article->content!!}
```
文章附件
``` html
<a target="_blank" href="{{ get_file($article->file_id) }}" title="{{ get_file($article->file_id,'name') }}">
    {{ get_file($article->file_id,'name') }}
</a>
```

## 单页

单页标题
``` html
{{$page->title}}
```
单页作者
``` html
{{$page->author}}
```
单页描述
``` html
{{$page->description}}
```
发布日期
``` html
{{$page->created_at}}
```
浏览量
``` html
{{$page->view}}
```
单页内容
``` html
{!!$page->content!!}
```

## 无限加载
``` html
<script src="https://unpkg.com/infinite-scroll@3/dist/infinite-scroll.pkgd.min.js"></script>
<ul class="list scroller-list">
    @foreach($articles as $article)
        <li class="scroller-item">
            <a href="/home/activity/detail?id={{$activity->id}}">
                <img src="/home/images/logo.png" class="logo">
                <img src="{{ get_picture($activity->cover_id) }}" class="img">
            </a>
        </li>
    @endforeach
</ul>
    {!! $articles->appends(['name' => $category->name])->links() !!}
</article>
<script>
$(document).ready(function (){
    $('.scroller-list').infiniteScroll({
        path: '.pagination a',
        append: '.scroller-item',
        status: '.scroller-status',
        hideNav: '.pagination',
    });
});
</script>
```

## bootstrap分页样式
~~~ css
.page{text-align: center; width: 100%;}
.page ul,.page li{padding: 0px;margin: 0px;list-style: none;}
.page li{display:inline;padding:5px 10px;border: 1px #cccccc solid; color: #3b3b3b}
.page li a{ color: #3b3b3b}
.page .active{background-color: #073190;}
.page .active a{color:#fff;}
~~~