WebUploader v1.2.1
===

### 基于H5的文件上传layout

功能介绍
---
1. 获得上传列表dom 或 自己编写dom直接调用上传方法 
1. 获得上传列表dom后可以用默认的弹层方式显示，也可以获得dom后自己装载在页面 
1. 用默认的弹层方式显示上传列表时，可选择是否自动开始上传 
1. 可以设置上传最多线程数 
1. 超过2M文件分片上传，配合后端实现断点续传
1. 不支持ie9以下(含)浏览器，请自行判断处理

![demo_1](https://github.com/agulado/WebUploader/blob/master/demo/demo_1.png)
![demo_2](https://github.com/agulado/WebUploader/blob/master/demo/demo_2.png)
![demo_3](https://github.com/agulado/WebUploader/blob/master/demo/demo_3.png)

npm
---
```sh
npm install web-uploader-html5
```

文件说明
---
#### dist：

```
WebUploader_es2015.js是源码
WebUploader.js是babel过的。
```

#### dist/assets：

##### · polyfill.min.js: [babel-polyfill](https://www.babeljs.cn/docs/usage/polyfill/)

```
在视图中引用
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
	check_url: null, // 检查已上传文件进度的处理地址。
	thread_maxCount: 5, // 最多同时执行上传线程。默认5
	z_index: 500, // show_kind=1时有效，背景z-index，wrapper的z-index为z_index+1。默认500
	bg_color: "rgba(0,0,0,0.8)", // show_kind=1时有效，背景颜色。默认"rgba(0,0,0,0.8)"
	autoStart: true, // show_kind=1时有效，选好文件自动开始上传。默认true
	callback_progressViewClose: null, // 关闭进度条后执行回调
	callback_successAll: null // 全部文件上传成功后回调。function(fileinfo={0:{文件0信息},1:{文件1信息},n:文件n信息}){}。其中文件信息包括{fileName,fileSize,filePath}
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
	upload_url: null, // 上传文件处理地址。
	check_url: null, // 检查已上传文件进度的处理地址。
	thread_maxCount: 5, // 最多同时执行上传线程。默认5
	callback_progress: null, // 进度条更改回调。function(index=文件序号,percent=上传百分比)
	callback_success: null, // 上传成功回调（每个文件上传成功都会回调一次）。function(index=文件序号,fileinfo={fileName,fileSize,filePath})
	callback_successAll: null // 全部文件上传成功回调。function(fileinfo={0:{文件0信息},1:{文件1信息},n:文件n信息}){}。其中文件信息包括{fileName,fileSize,filePath}
});     
```

后端说明
---
1. 接收文件上传（upload_url）：
	* 表单说明：
			
			* file: 文件
			* count: 分片数量，1时可以不分片储存
			* index: 分片序号，count>1时有效。
			* filename: 原始文件名
			* totalSize: 文件原始大小

	* 返回结果（json）：

			{ "filePath": filePath }
	
	* 最佳体验：
		
			* 判断count大于1
			** 否：直接将file保存到目标路径 
			** 是：
			*** 以‘文件名+文件原始大小’创建临时文件夹（如文件夹已存在则略过）
			*** 以index为文件名，将file保存至临时文件夹
			*** 如果index>=count，则将临时文件夹中文件按文件名顺序读流合并到目标路径，并删除临时文件夹
			* 返回目标路径到前端

1. 检查已上传文件的进度（check_url）：
	* 表单说明：

			* filename: 原始文件名
			* totalSize: 文件原始大小

	* 返回结果（json）：

			{ "count" : n }

更新日志
---
v1.2.1（2018-09-11）

	* 修改了成功后的回调参数，增加了fileName和fileSize，具体见传参部分
	* 解决了percent可能会超过100%的bug

v1.1.2（2018-08-28）

	* 做了C#版demo
	* 解决了一些bug

v1.1.1（2018-08-28）

	* 超过2M的文件做了分片上传和断点续传

v0.1.6（2018-08-03）

	* 做了上传取消的处理。

v0.1.5（2018-08-01）

	* 做了上传失败的处理。用自带进度条样式会自动处理，自行处理方案请看demo

v0.1.4（2018-07-18）

	* 引入了babel，做了ie10以上的兼容测试
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