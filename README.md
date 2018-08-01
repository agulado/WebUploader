WebUploader v0.1.5
===

### 基于H5的文件上传layout

功能介绍
---
1. 获得上传列表dom 或 自己编写dom直接调用上传方法 
1. 获得上传列表dom后可以用默认的弹层方式显示，也可以获得dom后自己装载在页面 
1. 用默认的弹层方式显示上传列表时，可选择是否自动开始上传 
1. 可以设置上传最多线程数 

![demo_1](https://github.com/agulado/WebUploader/blob/master/demo/demo_1.png)
![demo_2](https://github.com/agulado/WebUploader/blob/master/demo/demo_2.png)
![demo_3](https://github.com/agulado/WebUploader/blob/master/demo/demo_3.png)

**待实现功能：**
1. 大文件分片上传 
1. c#版demo

npm（待发布）
---
```sh
npm install web-uploader
```
使用
---
#### 实例化：
```javascript
const webUploader = new WebUploader();
```
#### 获得进度条视图：
```javascript
webUploader.getProgressView({
	show_kind: 1, // 1- 弹层显示 2- 不显示，返回dom对象。默认1
	wrapper_width: 700, // 外盒宽度。默认700
	wrapper_width_unit: "px", // 外盒宽度单位，默认"px"
	wrapper_height: 450, // 外盒高度。默认450
	wrapper_height_unit: "px", // 外盒高度单位，默认"px"
	wrapper_border_color: "#192884", // 外盒边框颜色，默认 "#192884"
	wrapper_border_radius_px: "5px", // 外盒圆角radius，默认 "5px"
	wrapper_bg_color: "rgb(255,255,255)", // 背景颜色，默认 "rgb(255,255,255)"
	wrapper_font_size: "12px", // 字体大小，默认"12px"
	wrapper_font_color: "#666", // 字体颜色，默认"#666"
	button_height: 40, // 底部按钮高度，默认40
	button_height_unit: "px", // 底部按钮高度单位，默认"px"
	files: [], // 待上传图片列表，Filelist。
	upload_url: null, // 上传文件处理地址。
	thread_maxCount: 5, // 最多同时执行上传线程。默认5
	z_index: 500, // show_kind=1时有效，背景z-index，wrapper的z-index为z_index+1。默认500
	bg_color: "rgba(0,0,0,0.8)", // show_kind=1时有效，背景颜色。默认"rgba(0,0,0,0.8)"
	autoStart: true, // show_kind=1时有效，选好文件自动开始上传。默认true
	callback_progressViewClose: null, // 关闭进度条后执行回调
	callback_successAll: null // 全部文件上传成功后回调。function(filePath={0:文件0路径,1:文件1路径,n:文件n路径}){}
});
```
#### 关闭/隐藏 进度条视图盒：
```javascript
webUploader.ProgressViewClose();
```
#### 执行上传文件（跳过获得进度条视图步骤；如已获得进度条视图，是不需要执行此方法的）：
```javascript
webUploader.UploadStart({
	files: [], // 上传文件列表，Filelist或array都可以
	fileIndexFlag: [], // 上传文件对应的index标识，在返回的对象中作为key
	url: null, // ajax页面地址
	thread_maxCount: 5, // 最多同时执行上传线程。默认5
	callback_progress: null, // 进度条更改回调。function(index=文件序号,percent=上传百分比)
	callback_success: null, // 上传成功回调（每个文件上传成功都会回调一次）。function(index=文件序号,filePath=上传后文件路径)
	callback_successAll: null // 全部文件上传成功回调。function(filePath={0:文件0路径,1:文件1路径,n:文件n路径}){}
});     
```
更新日志
---
v0.1.5（2018-08-01）

	* 做了上传失败的处理。用自带进度条样式会自动处理，自行处理方案请看demo

v0.1.4（2018-07-18）

	* 引入了babel，做了ie7以上的兼容测试
	* 解决了一些bug

v0.1.3（2018-07-17）

	* 修正了fis-conf，解决了npm build

v0.1.2（2018-07-17）
	
	* node.js版demo好了。
	* 已实现功能如下：
	** 获得上传列表dom 或 自己编写dom直接调用上传方法 
	** 获得上传列表dom后可以用默认的弹层方式显示，也可以获得dom后自己装载在页面 
	** 用默认的弹层方式显示上传列表时，可选择是否自动开始上传 
	** 可以设置上传最多线程数

v 0.1.1 (2018-07-10)

	*  进度条视图好了