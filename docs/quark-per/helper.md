# 辅助函数

### error($msg,$url = '')
* 函数说明： 错误时返回json数据
#### 函数参数
| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $msg | string | 提示信息 |
| $url | string | 跳转地址 |

### success($msg,$url ='',$data = '',$status = 'success')

* 函数说明： 成功是返回json数据
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $msg | string | 提示信息 |
| $url | string | 跳转地址 |
| $data | string OR array | 成功数据 |
| $status | string | 状态码，默认：success |

### frontend_url($api ='',$isEngineUrl = true)

* 函数说明： 前端跳转链接
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $api | string | 接口地址 |
| $isEngineUrl | bool | 是否为引擎组件的调整链接 |

### backend_url($api ='',$withToken = false)

* 函数说明： 后端跳转链接
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $api | string | 接口地址 |
| $withToken | bool | 跳转是否携带token |

### list_to_tree($list, $pk='id',$pid = 'pid',$child = '_child',$root=0)

* 函数说明： 把数组转换成Tree型
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $list | array | 要转换的数据集 |
| $pk | int | 主键，默认：id |
| $pid | int | parent标记字段，默认：pid |
| $child | string | 转换后，子数组的下标，默认：_child |
| $root | int | 根节点，默认：0 |

### tree_to_ordered_list($arr,$level=0,$field='name',$child='_child')

* 函数说明： 把Tree转换为有序列表
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $arr | array | 要转换的tree数据集 |
| $level | int | level标记字段，默认：0 |
| $field | string | 需要转换的字段 |
| $child | string | 子数组的下标，默认：_child |


### action_log($objectId = 0,$remark = '',$type='USER')

* 函数说明： 记录日志
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $objectId | int | 用户的id或者管理员的id |
| $remark | string | 日志内容 |
| $type | string | 日志对象类型：USER、ADMIN，默认：USER |

### get_picture($id,$key=0,$field='path')

* 函数说明： 获取图片url
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $id | int OR array OR string | pictures表的id、pictures表id的json集合、图片url地址 |
| $key | int | 如果id为json集合时，读取的图片下标 |
| $field | string | 读取字段，默认：path |

### get_file($id,$field='path')

* 函数说明： 获取文件url
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $id | int | files表的id |
| $field | string | 读取字段，默认：path |

### web_config($name)

* 函数说明： 获取网站配置信息
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $name | string | configs表的name |

### unset_null($data)

* 函数说明： 把数组里面null转换为空''
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $data | array | 数组 |

### get_admin_token()

* 函数说明： 获取当前登录管理员用户token
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |

### modify_env($data)

* 函数说明： 修改.env文件
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $data | array | 数组 |

### get_folder_dirs(& $dir)

* 函数说明： 获取文件夹内目录列表
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $dir | string | 文件夹路径 |


### get_folder_files(&$dir)

* 函数说明： 获取文件夹内文件列表
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $dir | string | 文件夹路径 |


### get_folder_anything(& $dir)

* 函数说明： 获取文件夹内目录和文件列表
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $dir | string | 文件夹路径 |

### del_folder_anything($dir)

* 函数说明： 循环删除目录和文件
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $dir | string | 文件夹路径 |

### del_folder_files($dir)

* 函数说明： 循环删除文件并不删除文件夹
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $dir | string | 文件夹路径 |


### is_empty_folder($path)

* 函数说明： 判断文件夹是否为空
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $path | string | 文件夹路径 |

### copy_file_to_folder($sourceFile, $dir)

* 函数说明： 复制文件到文件夹
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $sourceFile | string | 源文件路径 |
| $dir | string | 目标文件夹路径 |

### copy_dir_to_folder($sourceDir, $dir)

* 函数说明： 复制目录到文件夹
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $sourceDir | string | 源文件夹路径 |
| $dir | string | 目标文件夹路径 |

### get_file_mime($fileName)

* 函数说明： 获取文件Mime
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $fileName | string | 文件路径 |