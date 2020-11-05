# 容器组件

## 简介
容器组件顾名思义就是所有组件最外面的一层

## 基本使用

### 初始化组件
你可以通过Quark门面快速实例化一个Container对象
``` php
Quark::container();
```

### 标题
设置标题文字
``` php
$container->title('友情链接');
```

### 二级标题
设置二级标题文字
``` php
$container->subTitle('二级标题');
```

### 面包屑
面包屑导航
``` php
$container->breadcrumb($data);
```

### 返回按钮
显示一个返回按钮
``` php
$container->backButton();
```

### 容器内容
容器的内容可以是文字或者其他组件的数组或对象
``` php

// 可以是一个表格组件的对象
$container->content($table);

// 可以是文字内容
$container->content('我超喜欢QuarkAdmin');
```