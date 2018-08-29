/*
	20160803
	白梦超
	切换body背景
*/
//切换body大背景
var background_change = {
	//存放所有判断换背景的盒子
	obj_arr : [],
	init : function(opt){
		var _opt = {
			obj_arr : [],		//判定变换背景的盒子名称的数组，
			src_arr : []		//背景路径数组
		};

		_opt = $.extend(_opt, opt);
		if (_opt.obj_arr.length>_opt.src_arr.length){
			alert('盒子的数量不能大于图片的数量');
		}
		for (var i=0; i<_opt.obj_arr.length; i++){
			background_change.obj_arr.push($(_opt.obj_arr[i]));
		}
		background_change.window_scroll(_opt);
		
	},
	//浏览器的可视区域宽，高
	size : {'sH':document.body.clientHeight, 'sW': $(window).width()},
	//监听窗口大小变化
	window_size : function(){
		$(window).size(function(){
			background_change.size = {'sH':$(window).height(), 'sW': $(window).width()};
		});
		background_change.window_scroll(_opt);
	},
	//监听scroll值
	window_scroll : function(_opt){
		var scale = background_change.size.sW/background_change.size.sH;
		if (scale < 2){
			$('body').css({'background': 'url('+_opt.src_arr[0]+') center center no-repeat','background-attachment':'fixed','background-size' : 'auto '+background_change.size.sH+'px'});
		}else {
			$('body').css({'background': 'url('+_opt.src_arr[0]+') center center no-repeat','background-attachment':'fixed','background-size' : +background_change.size.sW+'px'+' auto'});
		}
		$(window).scroll(function(){
			background_change.change(_opt);
		});
	},
	//切换body背景
	change : function(_opt){
		var scroll_top = $(window).scrollTop();
		for (var i=0; i<background_change.obj_arr.length; i++){
			if (background_change.obj_arr[i].offset().top<=scroll_top){
				if (background_change.size.sW/background_change.size.sH < 2){
					$('body').css({'background': 'url('+_opt.src_arr[i]+') center center no-repeat','background-attachment':'fixed','background-size' : 'auto '+background_change.size.sH+'px'});
				}else {
					$('body').css({'background': 'url('+_opt.src_arr[i]+') center center no-repeat','background-attachment':'fixed','background-size' : +background_change.size.sW+'px'+' auto'});
				}
			}
		}
	}
};


if (typeof define === "function" && define.amd) {
    define([], function() {
        return background_change;
    });
}