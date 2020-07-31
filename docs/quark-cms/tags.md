# 标签
## 站点标签

网站名称
``` html
<title>{{web_config('WEB_SITE_NAME')}}</title>
```
网站关键字
``` html
<meta name="keyword" content="{{web_config('WEB_SITE_KEYWORDS')}}">
```
网站描述
``` html
<meta name="description" content="{{web_config('WEB_SITE_DESCRIPTION')}}">
```
网站LOGO
``` html
<img src="{{ get_picture(web_config('WEB_SITE_LOGO')) }}" />
```
网站统计代码
``` html
{{web_config('WEB_SITE_SCRIPT')}}
```
网站版权
``` html
{{web_config('WEB_SITE_COPYRIGHT')}}
```

## 导航列表标签

导航标签
``` html
@navs($nav,0)
	@if (isset($nav['_child']))
	<li class="am-dropdown" data-am-dropdown><a href="{{ $nav['url'] }}" rel="nofollow" class="am-dropdown-toggle" data-am-dropdown-toggle>{!! $nav['title'] !!}<span class="am-icon-caret-down"></span></a>
		<ul class="am-dropdown-content">
			@foreach($nav['_child'] as $childKey=>$childValue)
			<li><a href="{{ $childValue['url'] }}" rel="nofollow">{{ $childValue['title'] }}</a></li>
			@endforeach
		</ul>
	</li>
	@else
	<li><a href="{{ $nav['url'] }}" class="{{ get_url_activated($nav['url'],'on') }}" rel="nofollow">{!! $nav['title'] !!}</a></li>
	@endif
@endnavs
```

## 分类目录列表标签
### 参数说明
参数1：循环对象

参数2：分类类型（ARTICLE,GOODS）

参数3：分类父亲id

categorys($category,'GOODS',0)
``` html
@categorys($category,'GOODS',0)
    <img src="{{ get_picture($category['cover_id']) }}">
    {{$category['name']}}
    {{$category['description']}}</p>
    <a href="/home/goods/list?name={{$category['name']}}">View more</a>
@endcategorys
```

## 指定分类目录标签
### 参数说明
参数1：循环对象

参数2：分类名称

参数3：分类类型（ARTICLE,GOODS）

category($category,'EasyAdmin','GOODS')
``` html
@category($category,'EasyAdmin','GOODS')
    <img src="{{ get_picture($category['cover_id']) }}">
    {{$category['title']}}
    {{$category['description']}}</p>
    <a href="/home/goods/list?name=EasyAdmin">View more</a>
@endcategory
```

## 文章列表标签
文章列表标签

参数：参数：循环对象，分类名称，读取数量，读取位置，推荐位，排序类型（view_desc、view_asc、level_desc、level_asc、id_desc、id_asc），日期（today，yesterday，week，month）
``` html
@articles($article,'yyxw',1,0,1)
    <img src="{{ get_picture($article['cover_ids']) }}">
    <a href="/home/article/detail?id={{$article['id']}}">
    	{{ msubstr($article['title'],0,30) }}
    	{{ msubstr($article['description'],0,50) }}
       {{date('Y-m-d',strtotime($article['created_at']))}}
    </a>
@endarticles
```

## 单页标签
``` html
@page($page,'yyjj')
    {{$page['title']}}
    <a href="/home/page/index?name={{$page['name']}}"></a>
    <img src="{{ get_picture($page['cover_ids']) }}">
    {{$page['description']}}
@endpage
```

## 广告列表标签
``` html
@banners($banner,'IndexBanner')
    <a href="{{$banner['url']}}"><img src="{{ get_picture($banner['cover_id']) }}" /></a>
@endbanners
```

## 友情链接列表标签
``` html
@links($link)
    <a href="{{$link['url']}}">{{$link['title']}}</a>
@endlinks
```

## 评论列表标签

评论标签 参数：循环对象，评论对象id，评论类型，pid，读取数量
``` html
@comments($comment,$article['id'],'ARTICLE',0,4)
<li class="cf p10">
    <div class="fl c-user"><img src="{{get_picture(user($comment['uid'],'cover_id'))}}"></div>
    <div class="fr c-comment">
        <div class="user-comment">
            <div class="cf">
                <p class="fl"><span>{{user($comment['uid'],'nickname')}}</span>{{$comment['created_at']}}</p>
                <p class="fr zanBox"><label>{{$comment['ding']}}</label><span class="zan" id="{{$comment['id']}}"><img src="/pc/images/zan.png"  class="off"></span></p>
            </div>
            <p class="user-font">{{$comment['content']}}</p>
        </div>
    </div>
</li>
@endcomments
```

## 相似文章

相似文章  参数：循环对象，文章id，读取数量
``` html
@similarArticles($similarArticle,$article['id'],4)
<li class="bg-white p15 mb10">
    <div class="cf">
        <ul class="news-img-small fl">
            <li style="background:url({{$similarArticle['cover_ids']}}) no-repeat center center;background-size: cover;"></li>
        </ul> 
        <div class="news-img-right fl">
            <a href="/home/article/detail?id={{$similarArticle['id']}}" target="_blank" class="news-img-right-title"> 
                <h2 class="mb10">{{$similarArticle['title']}}</h2>
            </a>
            <div class="cf mt10 pl5 pr5 news-info">
                <p class="fl">{{$similarArticle['source']}} · {{$similarArticle['author']}} · {{date('Y-m-d H:i:s',strtotime($similarArticle['created_at']))}}  <a href="/home/article/detail?id={{$similarArticle['id']}}"><span class="news-label">社会</span></a></p>
                <p class="fr">{{$similarArticle['view']}}阅读 · <a href="/home/article/detail?id={{$similarArticle['id']}}">{{$similarArticle['comment']}}评论</a></p>
            </div>
        </div>
    </div>
</li>
@endsimilarArticles
```

## 万能标签
万能标签 参数：表名称，循环对象，读取数量,读取位置,读取条件
``` html
@querys('posts',$post,10,0,where('pid',4))
{{$post['title']}}
@endquerys
```

## tag标签

### 参数说明
参数1：循环对象

参数2：模型名称（Article,Goods）

@tags(tag,Goods)
``` html
@tags($tag,'Goods')
{{ $tag['title'] }}{{ $tag['count'] }}
@endtags
```