# 卡片组件

## 简介
卡片组件可以帮你实现格式各样的布局

## 基本使用

### 初始化组件
你可以通过Quark门面快速实例化一个Card对象
``` php
Quark::card();
```

### 标题
设置标题文字
``` php
$card->title('友情链接');
```

### 副标题
设置副标题文字
``` php
$card->subTitle('副标题');
```

### 提示信息
标题右侧图标 hover 提示信息
``` php
$card->tip('提示信息');
```

### 内容布局
内容布局，支持垂直居中 `'default'` | `'center'`
``` php
$card->layout('center');
```

### 栅格布局
栅格布局宽度，24 栅格，支持指定宽度 px 或百分比, 支持响应式的对象写法 { xs: 8, sm: 16, md: 24}
``` php
$card->colSpan('center');
```

### 间距
数字或使用数组形式同时设置 [水平间距, 垂直间距], 支持响应式的对象写法 { xs: 8, sm: 16, md: 24}
``` php
$card->gutter(2);
```

### 拆分卡片的方向
拆分卡片的方向, `'vertical'` | `'horizontal'`
``` php
$card->split('vertical');
```

### 边框
是否有边框
``` php
$card->bordered();
```

### 幽灵模式
幽灵模式，即是否取消卡片内容区域的 padding 和 卡片的背景颜色。
``` php
$card->ghost();
```

### 页头分割线
页头是否有分割线
``` php
$card->headerBordered();
```

### 可折叠
配置是否可折叠，受控时无效
``` php
$card->collapsible();
```

### 默认折叠
默认折叠, 受控时无效
``` php
$card->defaultCollapsed();
```

### 卡片内容
卡片的内容可以是文字或者其他组件的数组或对象
``` php

// 可以是一个表格组件的对象
$card->content($table);

// 可以是文字内容
$card->content('我超喜欢QuarkAdmin');
```