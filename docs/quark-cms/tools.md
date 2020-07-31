# 工具

## 图形验证码

* 接口说明： 图形验证码
* 接口地址： /tools/captcha/getImage
* 请求方式： GET
### 请求参数

## 二维码

* 接口说明： 二维码
* 接口地址： /tools/qrcode/getQrcode
* 请求方式： GET
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| text | string | 生成二维码的内容 |

## 发送短信验证码

* 接口说明： 发送短信验证码
* 接口地址： /tools/sms/send
* 请求方式： POST
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| phone | string | 手机号 |
| captcha | string | 图像验证码值 |
| type | string | 驱动类型，暂时请指定传：sioo|

## 通过url访问图片

* 接口说明： 通过url访问图片，可以用于图片的访问控制
* 接口地址： /tools/picture/getPicture
* 请求方式： GET
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| id | int | pictures表的id值 |
| w | int | 图片宽度 |
| h | int | 图片高度 |

## 上传图片

* 接口说明： 上传图片
* 接口地址： /tools/picture/upload
* 请求方式： POST
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| file | file | 二进制文件 |

## 通过base64上传图片

* 接口说明： 通过base64上传图片
* 接口地址： /tools/picture/base64Upload
* 请求方式： POST
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| file | string | base64字符串 |

## 通过url上传图片

* 接口说明： 通过url上传图片
* 接口地址： /tools/picture/urlUpload
* 请求方式： GET
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| url | string | 图片链接地址 |

## 通过url进行图片合并

* 接口说明： 通过url将两张图片合并
* 接口地址： /tools/picture/insert
* 请求方式： GET
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| source | string | 源图片链接地址 |
| insert | string | 插入图片链接地址 |

## 文件上传

* 接口说明： 文件上传
* 接口地址： /tools/file/upload
* 请求方式： POST
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| file | file | 二进制文件 |

## Git自动部署

* 接口说明： Git自动部署
* 接口地址： /tools/git/webhook
* 请求方式： GET
### 请求参数

| 参数名称 | 类型 | 描述 |
| :-----| :----: | :----- |
| version | string | 拉取的版本：master或者develop |