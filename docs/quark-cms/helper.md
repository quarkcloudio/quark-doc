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

### get_url_activated($url,$activated = 'active')

* 函数说明： 判断传入的url是否被选中
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $url | string | 传入url |
| $activated | string | 如果被选中返回的字符串 |

### sioo_send_sms($phone,$content)

* 函数说明： Sioo希奥发送手机短信接口
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $phone | string | 手机号码 |
| $content | string | 短信内容 |

### aliyun_send_sms($templateCode,$phone,$smsParam)

* 函数说明： 阿里云发送手机短信接口
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $templateCode | string | 阿里云通信templateCode |
| $phone | string | 手机号 |
| $smsParam | string | 阿里云通信模板替换变量 |

### make_thumb($imagePath,$thumbPath,$width,$height,$thumbType = 1)

* 函数说明： 生成缩略图
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $imagePath | string | 图片路径 |
| $thumbPath | string | 缩略图路径 |
| $width | int | 宽度 |
| $height | int | 高度 |

### mobile_adaptor($objects)

* 函数说明： 适应手机页面
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $objects | array | posts表等数组 |


### get_content_video($content)

* 函数说明： 获取内容视频
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $content | text | 内容 |

### get_content_picture($content)

* 函数说明： 获取内容图片
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $content | text | 内容 |

### get_category($id)

* 函数说明： 获取分类名称
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $id | int | 分类id |

### msubstr($str, $start=0, $length, $charset="utf-8")

* 函数说明： 字符串截取，支持中文和其他编码
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $str | string | 需要转换的字符串 |
| $start | int | 开始位置 |
| $length | int | 截取长度 |
| $charset | string | 编码格式，默认："utf-8" |

### filter_emoji($str)

* 函数说明： 过滤Emoji字符
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $str | string | 需要过滤的字符串 |

### wechat_config($type = 'fwh')

* 函数说明： 返回公众号配置
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $type | string | 读取的配置类型：fwh、dyh、mp；默认：fwh |

### wechat_pay_config()

* 函数说明： 返回微信公众号支付配置
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |

### wechat_app_pay_config()

* 函数说明： 返回微信app支付配置
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |

### wechat_mp_pay_config()

* 函数说明： 返回微信小程序支付配置
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |


### create_order_no()

* 函数说明： 创建订单号
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |

### is_mobile()

* 函数说明： 判断是否为手机端
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |

### curl($url, $params = false, $method = 'get', $headers = false, $https = 0)

* 函数说明： 简单封装的curl函数
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $url | string | 请求网址 |
| $params | array | 请求参数 |
| $method | string | 请求方式，get或post |
| $headers | array | 请求头部 |
| $https | int | 是否为https协议 |

### user($uid = '',$field = 'username')

* 函数说明： 获取用户信息
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $uid | int | 用户id（可选），为空则读取当前登录的用户信息 |
| $field | string | 字段名称，默认：username |

### qrcode($text)

* 函数说明： 生成二维码
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $text | string | 生成二维码的内容 |

### send_email($subject,$toEmail,$content)

* 函数说明： 发送邮件
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $subject | string | 邮箱主题 |
| $toEmail | string | 接受人邮箱 |
| $content | string | 邮件内容 |

### is_wechat()

* 函数说明： 是否微信浏览器
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |

### export($fileName,$titles,$lists,$columnFormats = [])

* 函数说明： 导出Excel
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $fileName | string | 文件名称 |
| $titles | string OR array | Excel表头 |
| $lists | array | 内容数组 |
| $columnFormats | array | 列格式 |

### import($fileId)

* 函数说明： 导入Excel
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $fileId | int | files表的id |


### get_address($ip='', $latitude='', $longitude='')

* 函数说明： 获取当前地理位置
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $ip | string | ip地址 |
| $latitude | double | 经度 |
| $longitude | double | 纬度 |


### validate_sms_code($phone,$code)

* 函数说明： 快捷验证短信验证码是否有效
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $phone | string | 手机号 |
| $code | string | 短信验证码 |

### get_printer_token($clientId,$clientSecret,$grantType, $scope, $timesTamp, $code = null)

* 函数说明： 获取易联云打印机Token
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |

### printer($printerId,$originId,$content)

* 函数说明： 易联云打印机打印内容
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $printerId | int | prints表id值 |
| $originId | int | 可以为订单号的id |
| $content | text | 打印内容 |

### hide_str($string, $bengin=0, $len = 4, $type = 0, $glue = "@")

* 函数说明： 将一个字符串部分字符用*替代隐藏
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $string | string | 待转换的字符串 |
| $bengin | int | 起始位置，从0开始计数，当$type=4时，表示左侧保留长度 |
| $len | int | 需要转换成*的字符个数，当$type=4时，表示右侧保留长度 |
| $type | int | 转换类型：0，从左向右隐藏；1，从右向左隐藏；2，从指定字符位置分割前由右向左隐藏；3，从指定字符位置分割后由左向右隐藏；4，保留首末指定字符串 |
| $glue | string | 分割符 |

### get_phone_location($phone,$type = 'baidu')

* 函数说明： 将一个字符串部分字符用*替代隐藏
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $phone | string | 手机号 |
| $type | string | 驱动类型：baidu、360、taobao，默认：baidu |

### speech_recognition($audioFile,$ffmpeg = '')

* 函数说明： 腾讯云语音识别
#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $audioFile | string | $audioFile='http://www.website/1.mp3'，必须安装ffmpeg程序 |
| $ffmpeg | string | ffmpeg程序的绝对路径 |

### html_to_image($source,$width = null,$height = null,$path = '',$phantomjs = '')

* 函数说明： web页面生成图片，必须安装phantomjs程序(https://github.com/ariya/phantomjs),windows下需要指定$phantomjs的绝对路径，如果截图出现乱码请安装相应的字体，例如：html_to_image('https://www.taobao.com',750,null,'','D:\\Software\\phantomjs\\bin\\phantomjs');

#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $source | string | 网址 |
| $width | int | 图片宽度 |
| $height | int | 图片高度 |
| $path | string | 保存路径 |
| $phantomjs | string | phantomjs路径 |

### download_picture_to_storage($url)

* 通过远程url上传图片

#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $url | string | 远程图片地址 |


### create_rand($len = 6,$string = false)

* 生成随机字符串

#### 函数参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| $len | int | 长度 |
| $string | bool | 是否为字符串，默认：false |