/*
    2.5.4
    高京
    2016-10-25
    this = {
        dom_bg_layer: 背景层,
        dom_info_box: 内容层,
        dom_info_p_box: 内容和段落中间层——JRoll用,
        dom_info_p: 段落层,
        dom_image_box: 图片层,
        dom_close_box: 关闭层,
        dom_close_image: 关闭图片,
        dom_image_ul: 图片ul盒,
        dom_image_li: 图片li盒,
        dom_image_loading: 图片loading盒
        dom_image_li_image: 图片容器盒（放置图片的盒）
        dom_arrow_left_box: 图片左箭头盒,
        dom_arrow_left_image: 图片左箭头,
        dom_arrow_right_box: 图片右箭头盒,
        dom_arrow_right_image: 图片右箭头
    }
*/
var insert_keyframe = function(style) {
    var _obj = document.styleSheets[0];
    if (_obj.insertRule)
        _obj.insertRule(style, 0);
    else
        _obj.appendRule(style, 0);
};

function LayerShow() {
    return {
        // 图片尺寸占window的比例
        image_size_percent_from_window_width: 0.8,
        image_size_percent_from_window_height: 0.9,

        // 标记是否正在执行图片切换
        image_sliding: false,

        // 创建DOM
        create_dom: function() {

            var _this = this;
            var dom_body = $("body");

            // 背景层
            _this.dom_bg_layer = $(document.createElement("div"))
                .css({
                    "position": "fixed",
                    "top": 0,
                    "left": 0,
                    "opacity": 0,
                    "filter": "alpha(opacity=0)",
                    "-moz-opacity": 0
                })
                .appendTo(dom_body);

            // 内容层
            _this.dom_info_box = $(document.createElement("div"))
                .attr("id", "info_wrapper")
                .css({
                    "position": "fixed",
                    "display": "none",
                    "top": "0",
                    "left": "0",
                    "padding": "0",
                    "margin": "0"
                })
                .appendTo(dom_body);

            // 底部fixed层
            _this.dom_info_bottom_fixed_box = $(document.createElement("div")).appendTo(_this.dom_info_box);

            // 内容jroll层
            _this.dom_info_jroll_box = $(document.createElement("div"))
                .attr("class", "jroll")
                .prependTo(_this.dom_info_box);

            // 段落层
            _this.dom_info_p = $(document.createElement("p")).css("margin", "0").appendTo(_this.dom_info_jroll_box);

            // 图片层
            _this.dom_image_box = $(document.createElement("div"))
                .css({
                    "position": "fixed",
                    "overflow": "hidden",
                    "top": "0",
                    "left": "0"
                })
                .appendTo(dom_body);

            // 关闭层
            _this.dom_close_box = $(document.createElement("div"))
                .css({
                    "position": "fixed",
                    "display": "none",
                    "top": "10px",
                    "right": "10px"
                })
                .appendTo(dom_body);

            // 关闭图片
            _this.dom_close_image = $(document.createElement("img"))
                .css({
                    "cursor": "pointer"
                })
                .appendTo(_this.dom_close_box)
                .on("touchstart mousedown", function(e) {
                    e.preventDefault();
                    _this.close.apply(_this);
                });

            // 图片ul盒
            _this.dom_image_ul = $(document.createElement("ul"))
                .css({
                    "position": "absolute",
                    "list-style": "none",
                    "padding": 0,
                    "margin": 0,
                    "z-index": _this.Paras.z_index + 1
                })
                .appendTo(_this.dom_image_box);

            // 图片li盒
            _this.dom_image_li = $(document.createElement("li"))
                .css({
                    "float": "left",
                    "cursor": "pointer",
                    "overflow": "hidden",
                    "position": "relative"
                });

            if (!_this.Paras.Pics_preload_all) {

                // 图片loading盒
                _this.dom_image_loading = $(document.createElement("div"))
                    .css({
                        "width": "38px",
                        "height": "38px",
                        "position": "absolute",
                        "top": "50%",
                        "left": "50%",
                        "margin-top": "-19px",
                        "margin-left": "-19px",
                        "background-color": "transparent",
                        "background-image": "url(\"data:image/svg+xml;charset=utf8, <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'><path fill='none' d='M0 0h100v100H0z'/><rect width='7' height='20' x='46.5' y='40' fill='#E9E9E9' rx='5' ry='5' transform='translate(0 -30)'/></svg>\")" +
                            ",url(\"data:image/svg+xml;charset=utf8, <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'><path fill='none' d='M0 0h100v100H0z'/><rect xmlns='http://www.w3.org/2000/svg' width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.56)' rx='5' ry='5' transform='translate(0 -30)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.5)' rx='5' ry='5' transform='rotate(30 105.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.43)' rx='5' ry='5' transform='rotate(60 75.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.38)' rx='5' ry='5' transform='rotate(90 65 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.32)' rx='5' ry='5' transform='rotate(120 58.66 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.28)' rx='5' ry='5' transform='rotate(150 54.02 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.25)' rx='5' ry='5' transform='rotate(180 50 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.2)' rx='5' ry='5' transform='rotate(-150 45.98 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.17)' rx='5' ry='5' transform='rotate(-120 41.34 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.14)' rx='5' ry='5' transform='rotate(-90 35 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.1)' rx='5' ry='5' transform='rotate(-60 24.02 65)'/><rect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.03)' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/></svg>\")",
                        "background-size": "contain",
                        "background-repeat": "no-repeat",
                        // "display": "inline-block",
                        // "vertical-align": "baseline",
                        "animation": "LayerShow_img_loading 1s steps(12,end) infinite",
                        "-webkit-animation": "LayerShow_img_loading 1s steps(12,end) infinite"
                    });

                insert_keyframe(
                    "@-webkit-keyframes LayerShow_img_loading {" +
                    "0% { transform: rotate3d(0, 0, 1, 0deg); }" +
                    "100% { transform: rotate3d(0, 0, 1, 360deg); } }"
                );

                // insert_keyframe(
                //     "keyframes LayerShow_img_loading {" +
                //     "0% { transform: rotate3d(0, 0, 1, 0deg); }" +
                //     "100% { transform: rotate3d(0, 0, 1, 360deg); } }"
                // );
            }

            // 图片容器盒（放置图片的盒）
            _this.dom_image_li_image = $(document.createElement("div"));

            // 图片左箭头盒
            _this.dom_arrow_left_box = $(document.createElement("div"))
                .css({
                    "position": "absolute",
                    "display": "none",
                    "text-align": "center",
                    "z-index": _this.Paras.z_index + 2
                })
                .appendTo(_this.dom_image_box);

            // 图片左箭头
            _this.dom_arrow_left_image = $(document.createElement("img"))
                .css({
                    "display": "inline"
                })
                .appendTo(_this.dom_arrow_left_box);

            // 图片右箭头盒
            _this.dom_arrow_right_box = $(document.createElement("div"))
                .css({
                    "position": "absolute",
                    "display": "none",
                    "z-index": _this.Paras.z_index + 2
                })
                .appendTo(_this.dom_image_box);

            // 图片右箭头
            _this.dom_arrow_right_image = $(document.createElement("img"))
                .css({
                    "display": "inline"
                })
                .appendTo(_this.dom_arrow_right_box);
        },

        // 设置宽高和位置
        resize: function() {
            var _this = this;

            // 获得窗口尺寸
            _this.window_width_px = $(window).width();
            _this.window_height_px = $(window).height();

            // 计算图片li盒的margin
            _this.li_marginTop_px = _this.window_height_px * (1 - _this.image_size_percent_from_window_height) / 2;
            _this.li_marginLeft_px = _this.window_width_px * (1 - _this.image_size_percent_from_window_width) / 2;

            // 计算图片li盒的宽度（含margin-left）
            _this.li_width_px = _this.window_width_px * _this.image_size_percent_from_window_width;
            _this.li_item_width_px = _this.li_width_px + _this.li_marginLeft_px;

            // 计算图片li盒的高度
            _this.li_height_px = _this.window_height_px * _this.image_size_percent_from_window_height;

            // 背景层
            _this.dom_bg_layer.css({
                // "width": _this.window_width_px + "px",
                // "height": _this.window_height_px + "px",
                "width": "100%",
                "height": "100%",
                "background": _this.Paras.bg_color,
                "z-index": _this.Paras.z_index
            });

            // 关闭按钮层
            if (_this.Paras.Pics_close_show) {
                _this.imageLoad(_this.Paras.Pics_close_path, function($img) {

                    var box_size = {
                        width: _this.window_width_px * 0.1,
                        height: _this.window_width_px * 0.1
                    };
                    var img_size = _this.imageGetSize($img, box_size);

                    _this.dom_close_box.css({
                        "width": img_size.img_width + "px",
                        "height": img_size.img_height + "px",
                        "z-index": _this.Paras.z_index + 2
                    });

                    _this.dom_close_image.css({
                        "width": img_size.img_width + "px",
                        "height": img_size.img_height + "px"
                    }).attr("src", _this.Paras.Pics_close_path);

                    if (_this.Paras.showKind == 1)
                        _this.dom_close_box.appendTo(_this.dom_image_box);
                    else if (_this.Paras.showKind == 2)
                        _this.dom_close_box.appendTo(_this.dom_body);

                    // _this.dom_close_box.show(0);

                });
            }

            if (_this.Paras.showKind == 1) {

                // 图片层
                _this.dom_image_box.css({
                    "width": _this.window_width_px + "px",
                    "height": _this.window_height_px + "px",
                    "z-index": _this.Paras.z_index + 1
                });

                // 图片li盒
                var li_obj = _this.dom_image_ul.find("li");
                li_obj.css({
                    "width": _this.li_width_px + "px",
                    "height": _this.li_height_px + "px",
                    "margin-top": _this.li_marginTop_px + "px",
                    "margin-left": _this.li_marginLeft_px + "px"
                });

                // 图片ul盒
                _this.dom_image_ul.css({
                    "width": _this.li_item_width_px * li_obj.length + "px",
                    "height": _this.window_height_px + "px",
                    "top": 0,
                    "left": 0
                });

                // 左箭头 及 点击监听
                _this.imageLoad(_this.Paras.Pics_arrow_left, function($img) {

                    // 获得宽高
                    var arrow_width_px = _this.li_marginLeft_px * 0.8;
                    if (arrow_width_px > $img.width)
                        arrow_width_px = $img.width;
                    var arrow_height_px = arrow_width_px / $img.width * $img.height;

                    // 盒位置和宽高
                    _this.dom_arrow_left_box
                        .css({
                            "width": arrow_width_px + "px",
                            "height": arrow_height_px + "px",
                            "left": _this.li_marginLeft_px * 0.1,
                            "top": "50%",
                            "margin-top": "-" + (arrow_height_px / 2) + "px"
                        })
                        .unbind().on("touchstart mousedown", function(e) {
                            e.preventDefault();
                            _this.imageUlSlideLeft.apply(_this, [1]);
                        });

                    // 装载图片
                    _this.dom_arrow_left_image.attr("src", _this.Paras.Pics_arrow_left)
                        .css({
                            "cursor": "pointer",
                            "width": arrow_width_px + "px",
                            "height": arrow_height_px + "px"
                        });
                });

                // 右箭头 及 点击监听
                _this.imageLoad(_this.Paras.Pics_arrow_right, function($img) {

                    // 获得宽高
                    var arrow_width_px = _this.li_marginLeft_px * 0.8;
                    if (arrow_width_px > $img.width)
                        arrow_width_px = $img.width;
                    var arrow_height_px = arrow_width_px / $img.width * $img.height;

                    // 盒位置和宽高
                    _this.dom_arrow_right_box
                        .css({
                            "width": arrow_width_px + "px",
                            "height": arrow_height_px + "px",
                            "right": _this.li_marginLeft_px * 0.1,
                            "top": "50%",
                            "margin-top": "-" + (arrow_height_px / 2) + "px"
                        })
                        .unbind().on("touchstart mousedown", function(e) {
                            e.preventDefault();
                            _this.imageUlSlideRight.apply(_this, [1]);
                        });

                    // 装载图片
                    _this.dom_arrow_right_image.attr("src", _this.Paras.Pics_arrow_right)
                        .css({
                            "cursor": "pointer",
                            "width": arrow_width_px + "px",
                            "height": arrow_height_px + "px"
                        });
                });

            } else if (_this.Paras.showKind == 2) {

                // 获得弹层尺寸
                _this.info_box_width_px = _this.window_width_px * _this.Paras.info_box_width_per / 100;
                _this.info_box_height_px = _this.window_height_px * _this.Paras.info_box_height_per / 100;

                // 设置弹层样式
                _this.dom_info_box.css({
                    // "box-sizing": "border-box",
                    "width": _this.info_box_width_px + "px",
                    "height": _this.info_box_height_px + "px",
                    "top": "50%",
                    "left": "50%",
                    "margin-top": (-_this.info_box_height_px / 2) + "px",
                    "margin-left": (-_this.info_box_width_px / 2) + "px",
                    "background": _this.Paras.info_box_bg,
                    "overflow": "hidden",
                    "z-index": _this.Paras.z_index + 1
                });


                // 设置jroll层样式
                var jroll_height = _this.info_box_height_px;
                if (_this.Paras.info_bottom_fixed_content && _this.Paras.info_bottom_fixed_content !== "") {
                    jroll_height -= _this.Paras.info_bottom_fixed_height;

                    // 设置bottom_fixed样式
                    _this.dom_info_bottom_fixed_box.css({
                        "height": _this.Paras.info_bottom_fixed_height + "px"
                    });
                }
                _this.dom_info_jroll_box.css({
                    "height": jroll_height + "px",
                    "overflow": "hidden"
                });

                // 设置段落样式
                _this.dom_info_p.css({
                    "font-size": _this.Paras.info_box_fontSize,
                    "color": _this.Paras.info_box_fontColor,
                    "padding": _this.Paras.info_box_padding_px + "px",
                    "line-height": _this.Paras.info_box_lineHeight
                });

                // 设置弹层圆角
                if (_this.Paras.info_box_radius)
                    _this.dom_info_box.css("border-radius", "5px");
            }

            // 监听窗口resize
            var resize_n = 0;
            var resize_do = function() {
                if (++resize_n > 1)
                    return;
                if (_this.dom_bg_layer.width() !== 0) {
                    setTimeout(function() {
                        if (_this.isIE678() && _this.Paras.showKind == 1) {
                            _this.close.apply(_this, [true]);
                        } else {
                            _this.resize.apply(_this);
                        }
                        resize_n = 0;
                    }, 0);
                }
            };
            $(window).unbind("resize", resize_do).bind("resize", resize_do);

        },

        // 显示弹层
        /*
            opt = {
                z_index: 弹层的z-index。图片/图文内容层为z_index+1。默认400
                bg_color: 背景层16进制颜色。默认#000000
                bg_opacity: 背景层透明度，0～1。默认0.8
                showKind: 1-图片 | 2-HTML。默认1
                Pics: showKind=1时有效。图片路径列表，数组。如 ["/images/001.jpg","/images/002.png"]。无默认值
                Pics_scroll_speed: showKind=1时有效。图片切换时的速度。毫秒。默认500。移动端建议设置为100-200，过慢会有卡顿的现象
                Pics_arrow_left: showKind=1时有效。图片切换 左箭头图片路径。默认/inc/LayerShow_arrow_left.png。
                Pics_arrow_right: showKind=1时有效。图片切换 右箭头图片路径。默认/inc/LayerShow_arrow_left.png。
                Pics_scale_fit: showKind=1且非ie678时有效。图片自动缩小到适配尺寸。true(默认)-无论图片多大，都可以全屏显示完整，不监听拖拽事件；false-图片原尺寸显示，拖拽时可改变显示位置(类似图片放大镜的效果)
                Pics_preload_all: showKind=1时有效。图片预加载所有大图，移动端建议false(以免图片加载太多影响打开)，pc端建议true(ie不支持svg)。默认true。
                callback_image_click: showKind=1时有效。图片点击回调：1-关闭弹层 | 2-下一张图片 | function(li_obj)-自定义方法。默认"1"
                info_content: showKind=2时有效，装载内容。无默认
                info_box_width_per: showKind=2时有效，内容盒宽度百分比。默认80
                info_box_height_per: showKind=2时有效，内容盒高度百分比。默认90
                info_box_radius: showKind=2时有效，内容盒是否圆角。默认true
                info_box_bg: showKind=2时有效，内容盒背景。默认"#ffffff"
                info_box_padding_px: showKind=2时有效，内容盒padding。默认20
                info_box_fontSize: showKind=2时有效，内容盒字体大小。默认"14px"
                info_box_fontColor: showKind=2时有效，内容盒字体颜色。默认"#333"
                info_box_lineHeight: showKind=2时有效，内容盒行间距。默认"30px"
                info_box_use_JRoll: showKind=2时有效，内容盒使用JRoll滚动（建议移动端使用，web端不用。IE7、8不兼容）如使用，则需要依赖或引用jroll.js。默认true
                JRoll_obj: JRoll对象。不使用JRoll做内容盒滚动，可不传。
                info_bottom_fixed_content: showKind=2时有效，底部固定层内容。无默认。
                info_bottom_fixed_height: showKind=2 && info_bottom_fixed_content!="" 时有效，高度，单位px。默认40
                Pics_close_show: true/false。显示关闭按钮。默认true
                Pics_close_path: 关闭按钮图片路径。默认/inc/LayerShow_close.png。
                callback_before: 弹层前回调。如显示loading层。无默认
                callback_success: 弹层成功回调。如关闭loading层。无默认
                callback_close(info_wrapper_html): 关闭弹层后的回调。info_wrapper_html为showKind=2时，$("#info_wrapper").html()。无默认
            }
        */
        show: function(opt) {
            var _this = this;

            var opt_default = {
                z_index: 400,
                bg_color: "#000",
                bg_opacity: 0.8,
                showKind: 1,
                Pics: [],
                Pics_show_index: 3,
                Pics_scroll_speed: 500,
                Pics_arrow_left: "/inc/LayerShow_arrow_left.png",
                Pics_arrow_right: "/inc/LayerShow_arrow_right.png",
                Pics_scale_fit: true,
                Pics_preload_all: true,
                callback_image_click: 1,
                info_box_width_per: 80,
                info_box_height_per: 90,
                info_box_radius: true,
                info_box_bg: "#fff",
                info_box_padding_px: 20,
                info_box_fontSize: "14px",
                info_box_fontColor: "#333",
                info_box_lineHeight: "30px",
                info_box_use_JRoll: true,
                info_bottom_fixed_height: 40,
                Pics_close_show: true,
                Pics_close_path: "/inc/LayerShow_close.png"
            };

            _this.Paras = $.extend(opt_default, opt);

            // IE78强制不使用JRoll，并强制缩小图片到可视大小
            if (_this.isIE678()) {
                _this.Paras.info_box_use_JRoll = false;
                _this.Paras.Pics_scale_fit = true;
            }

            // 看有没有创建dom
            if (!_this.dom_bg_layer)
                _this.create_dom.apply(_this);

            // 执行弹层前回调
            if (_this.Paras.callback_before)
                _this.Paras.callback_before();

            // 装载图片或内容
            if (_this.Paras.showKind == 1) {
                if (_this.Paras.Pics.length > 0) {

                    // 重新组织Pics
                    if (_this.Paras.Pics_show_index > 0 && _this.Paras.Pics_show_index < _this.Paras.Pics.length) {
                        (function() {
                            var Pics_temp = _this.Paras.Pics;
                            _this.Paras.Pics = [];
                            var i = _this.Paras.Pics_show_index,
                                len = Pics_temp.length;
                            for (; i < len; i++) {
                                _this.Paras.Pics.push(Pics_temp[i]);
                            }
                            for (i = 0; i < _this.Paras.Pics_show_index; i++) {
                                _this.Paras.Pics.push(Pics_temp[i]);
                            }
                        })();
                    }

                    // 对插入的li的监听
                    var li_Listener = function(li_obj) {

                        // 鼠标开始位置
                        var position_start = null;

                        // div原始位置
                        var position_ori = null;

                        // 鼠标新位置
                        var position_new = null;

                        // li_obj
                        // var li_obj = $(li);

                        // div
                        var div = li_obj.find("div");

                        // 判断x、y轴的可移动性（图片如果小于盒尺寸，则不允许移动）
                        var canMove = {
                            x: true,
                            y: true
                        };

                        // 起始处理
                        var start_handler = function(p) {

                            // 设置鼠标开始位置
                            position_start = {
                                x: p.x,
                                y: p.y
                            };

                            // 设置div原始位置
                            position_ori = {
                                "top": div.position().top,
                                "left": div.position().left,
                                "margin_top": parseFloat(div.css("margin-top").replace("px", "")),
                                "margin_left": parseFloat(div.css("margin-left").replace("px", ""))
                            };

                            // 判断可移动性
                            canMove = {
                                x: div.width() > li_obj.width(),
                                y: div.height() > li_obj.height()
                            };

                        };

                        // 移动中处理
                        var move_handler = function(p) {

                            if (position_start === null)
                                return;

                            if (!canMove.x && !canMove.y)
                                return;

                            // 获得新位置
                            position_new = {
                                x: p.x,
                                y: p.y
                            };

                            // 比较移动距离
                            var x_diff = position_new.x - position_start.x,
                                y_diff = position_new.y - position_start.y;

                            // 获得div新位置
                            var position_div = {
                                top: position_ori.top + y_diff,
                                left: position_ori.left + x_diff
                            };

                            // 边界判定
                            if (position_div.left > position_ori.margin_left * -1)
                                position_div.left = position_ori.margin_left * -1;
                            else if (position_div.left < 0)
                                position_div.left = 0;
                            if (position_div.top > position_ori.margin_top * -1)
                                position_div.top = position_ori.margin_top * -1;
                            else if (position_div.top < 0)
                                position_div.top = 0;

                            // 移动
                            if (canMove.y) {
                                div.css({
                                    "top": position_div.top + "px"
                                });
                            }
                            if (canMove.x) {
                                div.css({
                                    "left": position_div.left + "px"
                                });
                            }

                        };

                        // 结束移动处理
                        var end_handler = function() {

                            if (position_start === null)
                                return;

                            if (position_new === null) {

                                if (typeof _this.Paras.callback_image_click === "function") // 自定义方法
                                    _this.Paras.callback_image_click($(this));
                                else if (_this.Paras.callback_image_click == 1) // 关闭弹层
                                    _this.close.apply(_this);
                                else if (_this.Paras.callback_image_click == 2) // 下一张图片 
                                    _this.imageUlSlideLeft.apply(_this, [1]);
                            }

                            position_start = null;
                            position_new = null;
                        };

                        if (_this.isIE678()) {
                            li_obj.on("click", function() {
                                position_start = ""; // 欺骗end_handler。掩盖ie678无法进入start_handler的问题
                                end_handler();
                            });
                        } else {

                            var li = li_obj[0];

                            li.addEventListener("touchstart", function(e) {
                                e.preventDefault();

                                start_handler({
                                    x: e.touches[0].clientX,
                                    y: e.touches[0].clientY
                                });
                            });

                            li.addEventListener("mousedown", function(e) {
                                e.preventDefault();

                                start_handler({
                                    x: e.clientX,
                                    y: e.clientY
                                });
                            });

                            li.addEventListener("touchmove", function(e) {
                                e.preventDefault();

                                move_handler({
                                    x: e.touches[0].clientX,
                                    y: e.touches[0].clientY
                                });
                            });

                            li.addEventListener("mousemove", function(e) {
                                e.preventDefault();

                                move_handler({
                                    x: e.clientX,
                                    y: e.clientY
                                });
                            });

                            li.addEventListener("touchend", function(e) {
                                e.preventDefault();

                                end_handler();
                            });

                            li.addEventListener("mouseup", function(e) {
                                e.preventDefault();

                                end_handler();
                            });
                        }

                    };

                    // 插入li到ul，插入图片容器div到li。
                    var insert_li = function(imgPath) {
                        var li = _this.dom_image_li.clone();

                        if (!_this.Paras.Pics_preload_all) {
                            // _this.dom_image_loading_bg.clone()
                            //     .appendTo(li);
                            _this.dom_image_loading.clone()
                                .attr("imgPath", imgPath)
                                .appendTo(li);
                        }

                        // _this.dom_image_li_image.clone()
                        //     .appendTo(li);

                        li.css({
                                "width": _this.li_width_px + "px",
                                "height": _this.li_height_px + "px",
                                "margin-top": _this.li_marginTop_px + "px",
                                "margin-left": _this.li_marginLeft_px + "px"
                            })
                            .appendTo(_this.dom_image_ul);

                        // setTimeout(function() {}, 1000);
                    };

                    // 图片加载成功后的回调（获得图片组中显示大小）
                    _this.imageLoaded_success = function() {
                        var imageLoaded_success_count = 0;
                        return function($img, now_index) {

                            // 计算图片应显示尺寸
                            var img_size = _this.imageGetSize.apply(_this, [$img]);

                            // 获得背景图片尺寸的样式。
                            var background_size = img_size.img_width + "px " + img_size.img_height + "px";

                            // 如需要自动缩小，并且原图确实比容器大，并且不是ie678，则设为"contain"
                            if (_this.Paras.Pics_scale_fit && (img_size.img_width >= img_size.box_width || img_size.img_height >= img_size.box_height) && !_this.isIE678())
                                background_size = "contain";

                            // 装载图片到图片容器div
                            var li = _this.dom_image_ul.find("li");
                            var li_now = $(li[now_index]);
                            var div = $(_this.dom_image_li_image.clone())
                                .css({
                                    "display": "none"
                                })
                                .appendTo(li_now);

                            if (_this.isIE678()) {

                                $(document.createElement("img"))
                                    .attr("src", $img.src)
                                    .css({
                                        "width": img_size.img_width,
                                        "height": img_size.img_height,
                                        "position": "absolute",
                                        "top": "50%",
                                        "left": "50%",
                                        "margin-top": "-" + (img_size.img_height / 2) + "px",
                                        "margin-left": "-" + (img_size.img_width / 2) + "px"
                                    }).appendTo(div);

                            } else {

                                div.css({
                                    "position": "absolute",
                                    "z-index": _this.Paras.z_index + 1,
                                    "width": img_size.img_width + "px",
                                    "height": img_size.img_height + "px",
                                    "top": "50%",
                                    "left": "50%",
                                    "margin-top": -img_size.img_height / 2 + "px",
                                    "margin-left": -img_size.img_width / 2 + "px",
                                    "background": "url('" + $img.src + "') no-repeat center center",
                                    "background-size": background_size
                                });
                            }

                            // 监听li
                            li_Listener(li_now);

                            // 显示图片，隐藏loading
                            div.fadeIn(200);
                            div.siblings("div").fadeOut(200, function() {
                                $(this).remove();
                            });

                            if (now_index > 0) {


                                if (++imageLoaded_success_count + 1 == _this.Paras.Pics.length) {

                                    // 重置ul宽度
                                    _this.dom_image_ul.css("width", _this.li_item_width_px * li.length + "px");

                                    // 显示左右箭头
                                    if (_this.dom_arrow_left_box.css("display") == "none") {
                                        _this.dom_arrow_left_box.fadeIn(200);
                                        _this.dom_arrow_right_box.fadeIn(200);
                                    }
                                }
                            } else {

                                // 设置弹层宽高和位置
                                _this.resize.apply(_this);

                                // 显示关闭按钮
                                if (_this.dom_bg_layer.css("opacity") === "0") {
                                    _this.dom_close_box.fadeIn(200);
                                }

                                var i = 1,
                                    len = _this.Paras.Pics.length;
                                if (_this.Paras.Pics_preload_all) {

                                    // 加载其他图片

                                    // 加载成功后的回调，因为是循环调用，所以闭包伺候
                                    var _imageLoaded_success = function(now_index) {
                                        return function($img) {
                                            _this.imageLoaded_success($img, now_index);
                                        };
                                    };

                                    for (; i < len; i++) {
                                        insert_li();
                                        _this.imageLoad.apply(_this, [_this.Paras.Pics[i], _imageLoaded_success(i)]);
                                    }
                                } else {
                                    if (_this.dom_bg_layer.css("opacity") === "0") {

                                        // 为其他图片插入li
                                        for (; i < len; i++) {
                                            insert_li(_this.Paras.Pics[i]);
                                        }

                                        // 显示左右箭头
                                        _this.dom_arrow_left_box.fadeIn(200);
                                        _this.dom_arrow_right_box.fadeIn(200);
                                    }
                                }

                                // 显示弹层
                                if (_this.dom_bg_layer.css("opacity") === "0") {
                                    _this.dom_bg_layer.fadeTo(200, _this.Paras.bg_opacity);
                                    _this.dom_image_box.fadeIn(200, function() {
                                        if (_this.Paras.callback_success)
                                            _this.Paras.callback_success(div.parents("li"));
                                    });
                                }

                            }
                        };
                    }();

                    // 加载第一张图片。回调中显示弹层
                    insert_li();
                    _this.imageLoad.apply(_this, [_this.Paras.Pics[0], function($img) {
                        _this.imageLoaded_success($img, 0);
                    }]);
                }

            } else if (_this.Paras.showKind == 2) {

                // 获得窗口尺寸
                // _this.window_width_px = $(window).width();
                // _this.window_height_px = $(window).height();

                // 设置盒内容
                if (_this.Paras.info_content)
                    _this.dom_info_p.html(_this.Paras.info_content);

                // 设置底部fixed盒内容
                if (_this.Paras.info_bottom_fixed_content)
                    _this.dom_info_bottom_fixed_box.html(_this.Paras.info_bottom_fixed_content);

                // 设置弹层宽高和位置
                _this.resize.apply(_this);

                // 显示弹层
                _this.dom_bg_layer.fadeTo(200, _this.Paras.bg_opacity);
                _this.dom_info_box.fadeIn(200, function() {
                    // 设置JRoll滚动
                    if (_this.Paras.info_box_use_JRoll && _this.Paras.JRoll_obj) {
                        _this.jroll_obj = new _this.Paras.JRoll_obj(_this.dom_info_jroll_box[0]);
                    }

                    // console.log(_this.Paras.info_box_use_JRoll, _this.jroll_obj);
                    // 成功回调
                    if (_this.Paras.callback_success)
                        _this.Paras.callback_success(_this.jroll_obj);
                });
                _this.dom_close_box.fadeIn(200);

            }
        },
        // 关闭弹层
        // reShow==true时重新显示弹层。用于IE678的resize
        close: function(reShow) {
            var _this = this;

            _this.dom_bg_layer.fadeTo(200, 0, function() {
                $(this).css({
                    "width": 0,
                    "height": 0
                });
            });

            if (_this.Paras.showKind == 1) {
                _this.dom_image_box.fadeOut(200, function() {

                    // 清空li
                    _this.dom_image_ul.html("");

                    if (reShow) {
                        _this.show.apply(_this, [_this.Paras]);
                    } else if (_this.Paras.callback_close)
                        _this.Paras.callback_close();
                });
            } else if (_this.Paras.showKind == 2) {

                var info_wrapper_html = _this.dom_info_box.html();

                if (_this.Paras.info_box_use_JRoll) {
                    // 销毁jroll对象
                    _this.jroll_obj.destroy();

                    // 清空段落的style
                    _this.dom_info_p.removeAttr("style");
                }

                // 内容盒回到顶端
                _this.dom_info_box.scrollTop(0);

                // 清空内容盒
                _this.dom_info_p.html("");

                // 隐藏弹层
                _this.dom_close_box.fadeOut(200);
                _this.dom_info_box.fadeOut(200, function() {
                    if (reShow) {
                        _this.show.apply(_this, [_this.Paras]);
                    } else if (_this.Paras.callback_close)
                        _this.Paras.callback_close(info_wrapper_html);
                });
            }
        },
        // 图片加载
        // function(img)
        imageLoad: function(picPath, callback) {
            var img = new Image();
            img.src = picPath;
            var _callback = function() {
                if (callback)
                    callback(img);
            };
            if (img.width)
                _callback();
            else {
                img.onload = function() {
                    _callback();
                };
            }

        },
        // 根据图片和显示盒的宽高，计算图片最终显示大小
        // box_size{width:0,height:0}为显示盒的宽高，如图片大于此宽高尺寸，则缩放。
        // box_size 默认为{width: _this.window_width_px * _this.image_size_percent_from_window_width, height: _this.window_height_px * _this.image_size_percent_from_window_height}
        imageGetSize: function(img, box_size) {
            var _this = this;

            _this.window_width_px = $(window).width();
            _this.window_height_px = $(window).height();

            // 获得图片盒尺寸
            if (!box_size)
                box_size = {
                    width: _this.window_width_px * _this.image_size_percent_from_window_width,
                    height: _this.window_height_px * _this.image_size_percent_from_window_height
                };

            // 获得图片的宽、高、宽高比
            var img_width_px = img.width;
            var img_height_px = img.height;
            var img_ratio = img_width_px / img_height_px;

            // 如果不需要缩小图片显示，则返回图片原尺寸(Paras.Pics_scale_fit)
            if (!_this.Paras.Pics_scale_fit) {
                return {
                    img_width: img_width_px,
                    img_height: img_height_px,
                    box_width: box_size.width,
                    box_height: box_size.height
                };
            }

            // 获得容器的宽高比
            var box_ratio = box_size.width / box_size.height;

            // 根据宽高比，决定最后图片的宽、高
            if (img_ratio <= box_ratio && img_height_px > box_size.height) {
                img_height_px = box_size.height;
                img_width_px = img_height_px * img_ratio;
            } else if (img_ratio >= box_ratio && img_width_px > box_size.width) {
                img_width_px = box_size.width;
                img_height_px = img_width_px / img_ratio;
            }

            return {
                img_width: img_width_px,
                img_height: img_height_px,
                box_width: box_size.width,
                box_height: box_size.height
            };
        },
        // 图片向左移动X屏
        imageUlSlideLeft: function(x) {
            var _this = this;

            if (_this.image_sliding)
                return;

            _this.image_sliding = true;

            // 如果x大于图片总数-1，则退出
            var li_obj = _this.dom_image_ul.find("li");
            if (x > li_obj.length - 1)
                return;

            _this.dom_image_ul.animate({
                "left": -x * _this.li_item_width_px + "px"
            }, _this.Paras.Pics_scroll_speed, function() {

                // 将队列头部的x个li移到队尾
                var i = 0;
                for (; i < x; i++) {
                    $(li_obj[i]).appendTo(_this.dom_image_ul);
                }

                // 还原ul位置
                _this.dom_image_ul.css("left", 0);

                // 加载图片
                var imgPath = $(_this.dom_image_ul.find("li")[0]).find("div").attr("imgPath");
                if (imgPath !== undefined) {
                    _this.imageLoad.apply(_this, [imgPath, function($img) {
                        _this.imageLoaded_success($img, 0);
                    }]);
                }

                _this.image_sliding = false;
            });

        },
        // 图片向右移动X屏
        imageUlSlideRight: function(x) {
            var _this = this;

            if (_this.image_sliding)
                return;

            _this.image_sliding = true;

            // 如果x大于图片总数-1，则退出
            var li_obj = _this.dom_image_ul.find("li");
            if (x > li_obj.length - 1)
                return;

            // 将队列尾的x个li移到最前
            var i = 0,
                len = li_obj.length;
            for (; i < x; i++) {
                $(li_obj[len - i - 1]).prependTo(_this.dom_image_ul);
            }
            _this.dom_image_ul.css("left", -x * _this.li_item_width_px + "px");

            // 滚动
            _this.dom_image_ul.animate({
                "left": "0"
            }, _this.Paras.Pics_scroll_speed, function() {
                _this.image_sliding = false;

                // 加载图片
                var imgPath = $(_this.dom_image_ul.find("li")[0]).find("div").attr("imgPath");
                if (imgPath !== undefined) {
                    _this.imageLoad.apply(_this, [imgPath, function($img) {
                        _this.imageLoaded_success($img, 0);
                    }]);
                }
            });

        },
        // 判断是否为IE6/7/8浏览器
        isIE678: function() {
            var yes = false;
            var browser = navigator.appName;
            if (browser == "Microsoft Internet Explorer") {
                var b_version = navigator.appVersion;
                var version = b_version.split(";");
                var trim_Version = version[1].replace(/[ ]/g, "");
                if (trim_Version == "MSIE6.0" || trim_Version == "MSIE7.0" || trim_Version == "MSIE8.0") {
                    yes = true;
                }
            }
            return yes;
        }
    };
}

if (typeof define === "function" && define.amd) {
    define(function() {
        return LayerShow;
    });
}