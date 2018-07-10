/*
    web-upload 0.1.1
    高京
    2018-07-06
*/

;
(function() {

    // 通用参数
    const opt = {
        "symbol": Symbol("WebUploader"),
        "li_height": 40,
        "li_height_unit": "px"
    };

    function WebUploader() {

        return {
            // 获得进度条视图
            getProgressView: function(opt) {

                this.opt = getProgress_opt_assign(opt);

                this.debug(`
                    \n24: this.opt=
                `);
                this.debug(this.opt);

                this.debug(`
                    \n29: this.dom_obj=
                `);
                this.debug(this.dom_obj);

                if (!this.dom_obj)
                    this.create_dom();

                let i = 0,
                    len = this.opt.files.length,
                    f;
                let li, span;
                for (; i < len; i++) {
                    li = this.dom_obj.file_li_template.clone();
                    span = li.find("span");
                    f = this.opt.files.item(i);
                    this.debug(`
                        \n45:f=
                    `);
                    this.debug(f);
                    $(span[0]).text(f.name);
                    $(span[1]).text(sizeFormat(f.size));
                    li.appendTo(this.dom_obj.file_ul);
                }

                // 监听按钮
                this.buttonsLisenter();

                this.debug(`\n58: this.opt.show_kind=${this.opt.show_kind}`);

                // 显示弹层
                if (this.opt.show_kind == 1) {

                    this.debug(`\n62`);
                    this.dom_obj.wrapper_bg.css("display", "block");
                    this.dom_obj.wrapper.css("display", "block");
                } else
                    return this.dom_obj.wrapper;
            },
            // 关闭进度条视图
            ProgressViewClose: function() {
                if (this.dom_obj) {
                    this.dom_obj.wrapper_bg &&
                        this.dom_obj.wrapper_bg.css("display", "none");
                    this.dom_obj.wrapper &&
                        this.dom_obj.wrapper.css("display", "none");

                    this.dom_obj.file_ul.html("");
                }
            },
            // 创建dom
            create_dom: function() {

                const dom_body = $("body");

                this.dom_obj = {
                    "body": dom_body
                };

                // 背景层
                if (this.opt.show_kind == 1)
                    this.dom_obj.wrapper_bg = $(document.createElement("div"))
                    .css({
                        "display": "none",
                        "position": "fixed",
                        "width": "100vw",
                        "height": "100vh",
                        "z-index": this.opt.z_index,
                        "top": "0",
                        "left": "0",
                        "background": this.opt.bg_color
                    }).appendTo(this.dom_obj.body);

                this.debug(`
                    \n70: this.opt.wrapper_border_radius_px=${this.opt.wrapper_border_radius_px}
                `);

                // 大盒儿
                this.dom_obj.wrapper = $(document.createElement("div"))
                    .css({
                        "position": "relative",
                        "width": `${this.opt.wrapper_width}${this.opt.wrapper_width_unit}`,
                        "height": `${this.opt.wrapper_height}${this.opt.wrapper_height_unit}`,
                        "border": `solid 1px ${this.opt.wrapper_border_color}`,
                        "border-radius": this.opt.wrapper_border_radius_px,
                        "background": this.opt.wrapper_bg_color
                    }).appendTo(this.dom_obj.body);
                if (this.opt.show_kind == 1)
                    this.dom_obj.wrapper.css({
                        "display": "none",
                        "position": "fixed",
                        "z-index": `${this.opt.z_index+1}`,
                        "top": "50%",
                        "left": "50%",
                        "margin-top": `${-this.opt.wrapper_height/2}${this.opt.wrapper_width_unit}`,
                        "margin-left": `${-this.opt.wrapper_width/2}${this.opt.wrapper_height_unit}`
                    });

                // 获得大盒宽
                const wrapper_width = this.dom_obj.wrapper.width();

                // 表头盒儿
                this.dom_obj.title_ul = $(document.createElement("ul"))
                    .css({
                        "width": `${this.dom_obj.wrapper.width()}px`,
                        "height": `${opt.li_height}${opt.li_height_unit}`
                    }).appendTo(this.dom_obj.wrapper);

                // 文件盒儿
                this.dom_obj.file_ul = $(document.createElement("ul"))
                    .css({
                        "width": `${this.dom_obj.wrapper.width()}px`,
                        "height": `${this.dom_obj.wrapper.height()-this.opt.button_height*2}px`,
                        "overflow-y": "auto"
                    }).appendTo(this.dom_obj.wrapper);

                // li模版
                this.dom_obj.file_li_template = $(document.createElement("li"))
                    .css({
                        "display": "table",
                        "width": `${this.dom_obj.wrapper.width()}px`,
                        "height": `${opt.li_height}${opt.li_height_unit}`,
                        "border-top": "dashed 1px #ccc"
                    });

                // cell模板
                this.dom_obj.file_span_template = $(document.createElement("span"))
                    .css({
                        "display": "table-cell",
                        "word-break": "break-all",
                        "font-size": this.opt.wrapper_font_size,
                        "color": this.opt.wrapper_font_color,
                        "height": `${opt.li_height}${opt.li_height_unit}`,
                        "vertical-align": "middle"
                    });

                // cell1 - 文件名
                this.debug(`
                    \n160: wrapper_width=${wrapper_width}
                `);
                this.dom_obj.file_span_template.clone()
                    .addClass("cell1").css({
                        "width": `${wrapper_width*0.38}px`,
                        "padding": `0 ${wrapper_width*0.01}px`
                    })
                    .appendTo(this.dom_obj.file_li_template);

                // cell2 - 大小
                this.dom_obj.file_span_template.clone()
                    .addClass("cell2").css({
                        "width": `${wrapper_width*0.15}px`,
                        "text-align": "center"
                    })
                    .appendTo(this.dom_obj.file_li_template);

                // cell3 - 进度条
                this.dom_obj.file_span_cell3 = this.dom_obj.file_span_template.clone();
                this.dom_obj.file_span_cell3.addClass("cell3").css({
                        "width": `${wrapper_width*0.35}px`,
                        "text-align": "center",
                        "position": "relative"
                    })
                    .appendTo(this.dom_obj.file_li_template);
                this.dom_obj.progress = {
                    gray: $(document.createElement("p")).css({
                        "width": `${this.dom_obj.file_span_cell3.width()*0.9}px`,
                        "height": "10px",
                        "position": "absolute",
                        "top": "50%",
                        "left": `${this.dom_obj.file_span_cell3.width()*0.05}px`,
                        "margin-top": "-5px",
                        "border-radius": "5px",
                        "background": "#ccc"
                    }).appendTo(this.dom_obj.file_span_cell3),
                    color: $(document.createElement("p")).css({
                        "width": `${this.dom_obj.file_span_cell3.width()*0}px`,
                        "height": "10px",
                        "position": "absolute",
                        "top": "50%",
                        "left": "5%",
                        "margin-top": "-5px",
                        "border-radius": "5px",
                        "background": this.opt.wrapper_border_color
                    }).appendTo(this.dom_obj.file_span_cell3)
                };

                // cell4 - icon - delete
                this.dom_obj.file_span_cell4_button_delete_html = `
                    <svg class="file_span_cell4_button_delete" t="1522138218728" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3162" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                    <defs><style type="text/css">svg.file_span_cell4_button_delete{fill:${this.opt.wrapper_font_color};cursor:pointer;} svg:hover{fill:${this.opt.wrapper_border_color};}</style></defs>
                    <path d="M826.668581 311.533464c0-8.83361 7.163979-16.000395 15.997589-16.000395S858.667967 302.732124 858.667967 311.533464l0 613.801178c0 27.098529-11.134613 51.766973-29.001066 69.665696-17.86505 17.866453-42.567167 28.999663-69.665696 28.999663L264.0016 1024c-27.099932 0-51.832916-11.13321-69.667099-28.999663-17.866453-17.866453-28.999663-42.530688-28.999663-69.665696L165.334839 311.533464c0-8.83361 7.166785-16.000395 15.998992-16.000395 8.83361 0 16.000395 7.199055 16.000395 16.000395l0 613.801178c0 18.267725 7.534384 34.966839 19.600624 47.031676 12.066239 12.067642 28.766756 19.632894 47.033079 19.632894l496.002411 0c18.266322 0 34.93036-7.568058 46.999405-19.632894 12.099913-12.099913 19.631491-28.766756 19.631491-46.999405L826.601235 311.533464 826.668581 311.533464z" p-id="1939"></path>
                    <path d="M392.666997 884.000756c0 8.83361-7.166785 15.998992-16.000395 15.998992s-16.000395-7.165382-16.000395-15.998992l0-568.333904c0-8.83361 7.166785-16.000395 16.000395-16.000395s16.000395 7.166785 16.000395 16.000395L392.666997 884.000756z" p-id="1940"></path>
                    <path d="M528.001096 884.000756c0 8.83361-7.165382 15.998992-15.998992 15.998992s-16.000395-7.165382-16.000395-15.998992l0-568.333904c0-8.83361 7.166785-16.000395 16.000395-16.000395s15.998992 7.166785 15.998992 16.000395L528.001096 884.000756z" p-id="1941"></path>
                    <path d="M663.367465 884.000756c0 8.83361-7.163979 15.998992-15.997589 15.998992-8.835013 0-16.000395-7.165382-16.000395-15.998992l0-568.333904c0-8.83361 7.165382-16.000395 16.000395-16.000395 8.83361 0 15.997589 7.166785 15.997589 16.000395L663.367465 884.000756 663.367465 884.000756z" p-id="1942"></path>
                    <path d="M383.333901 98.666762c0 8.83361-7.166785 16.000395-16.000395 16.000395-8.832207 0-15.998992-7.166785-15.998992-16.000395 0-27.167278 11.099537-51.832916 28.967393-69.699369C398.168361 11.099537 422.835402 0 450.001277 0l124.000252 0c27.133605 0 51.800646 11.13321 69.664293 28.999663 17.866453 17.866453 29.001066 42.599437 29.001066 69.667099 0 8.83361-7.165382 16.000395-15.998992 16.000395s-15.998992-7.166785-15.998992-16.000395c0-18.266322-7.532981-34.966839-19.600624-47.033079-12.069045-12.067642-28.766756-19.634297-47.033079-19.634297l-123.998849 0c-18.299995 0-34.966839 7.532981-47.066752 19.600624C390.866883 63.699922 383.333901 80.366766 383.333901 98.666762z" p-id="1943"></path>
                    <path d="M139.999945 144.665792l744.00011 0c15.698739 0 30.032309 6.432989 40.433126 16.833807l0.065943 0.067346c10.400818 10.399415 16.833807 24.732985 16.833807 40.433126l0 41.333885c0 8.832207-7.166785 15.998992-16.000395 15.998992l-0.433543 0L98.667463 259.332948c-8.83361 0-16.000395-7.166785-16.000395-15.998992l0-0.39987 0-40.934015c0-15.666468 6.432989-30.033712 16.833807-40.433126l0.067346-0.067346C109.967637 151.100184 124.333477 144.665792 139.999945 144.665792L139.999945 144.665792zM884.001458 176.666581 139.999945 176.666581c-6.966149 0-13.333194 2.834163-17.866453 7.399691L122.066146 184.133619c-4.566931 4.531855-7.399691 10.866631-7.399691 17.866453l0 25.33349 794.633417 0 0-25.33349c0-6.966149-2.834163-13.333194-7.398288-17.866453l-0.06875-0.067346C897.302382 179.500744 890.967607 176.666581 884.001458 176.666581z" p-id="1944"></path>
                    </svg>
                `;

                // cell4 - icon - wait
                this.dom_obj.file_span_cell4_button_wait_html = `
                    <svg class="file_span_cell4_button_wait" t="1522138218728" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3162" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                    <defs><style type="text/css">svg.file_span_cell4_button_wait{fill:${this.opt.wrapper_font_color};cursor:default;}</style></defs>
                    <path d="M896 0 128 0l0 42.666667 106.666667 0 0 234.645333C234.666667 389.333333 389.653333 474.389333 469.333333 512c-79.68 37.610667-234.666667 122.666667-234.666667 234.688L234.666667 981.333333 128 981.333333l0 42.666667 768 0 0-42.666667-106.666667 0L789.333333 746.688C789.333333 634.666667 634.346667 549.610667 554.666667 512c79.68-37.610667 234.666667-122.624 234.666667-234.666667l0-234.666667 106.666667 0L896 0zM746.666667 746.688 746.666667 981.333333 277.333333 981.333333 277.333333 746.688c0-93.589333 160.384-182.592 234.666667-213.354667C586.282667 564.117333 746.666667 653.12 746.666667 746.688zM746.666667 277.312c0 93.589333-160.426667 182.592-234.666667 213.354667-74.282667-30.784-234.666667-119.786667-234.666667-213.354667L277.333333 42.666667l469.333333 0L746.666667 277.312z" p-id="2106"></path>
                    </svg>
                `;

                // cell4 - 操作/状态
                this.dom_obj.file_span_template.clone()
                    .addClass("cell4").css({
                        "width": "10%",
                        "text-align": "center"
                    })
                    .html(this.dom_obj.file_span_cell4_button_delete_html)
                    .appendTo(this.dom_obj.file_li_template);

                // 表头
                this.dom_obj.file_li_title = this.dom_obj.file_li_template.clone();
                this.dom_obj.file_li_title.css({
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "border": "none",
                    "background": this.opt.wrapper_bg_color,
                    "border-radius": "5px"
                }).appendTo(this.dom_obj.title_ul);
                const title_span = this.dom_obj.file_li_title.find("span");
                title_span.css({
                    "text-align": "center",
                    "font-weight": "bold"
                });
                $(title_span[0]).text("文件名");
                $(title_span[1]).text("大小");
                $(title_span[2]).text("上传进度");
                $(title_span[3]).html("");

                // 按钮组
                this.dom_obj.buttons = $(document.createElement("ul"))
                    .css({
                        "position": "absolute",
                        "width": "100%",
                        "height": `${this.opt.button_height}${this.opt.button_height_unit}`,
                        "bottom": 0,
                        "left": 0
                    }).appendTo(this.dom_obj.wrapper);

                // 按钮 - 关闭
                this.dom_obj.button_close = $(document.createElement("li"))
                    .css({
                        "float": "left",
                        "box-sizing": "border-box",
                        "width": "50%",
                        "height": `${this.opt.button_height}${this.opt.button_height_unit}`,
                        "line-height": `${this.opt.button_height}${this.opt.button_height_unit}`,
                        "text-align": "center",
                        "border-top": `solid 1px ${this.opt.wrapper_border_color}`,
                        "border-right": `solid 1px ${this.opt.wrapper_border_color}`,
                        "color": this.opt.wrapper_font_color,
                        "cursor": "pointer"
                    })
                    .text("取消并关闭")
                    .appendTo(this.dom_obj.buttons);

                // 按钮 - 开始上传
                this.dom_obj.button_start = $(document.createElement("li"))
                    .css({
                        "float": "right",
                        "box-sizing": "border-box",
                        "width": "50%",
                        "height": `${this.opt.button_height}${this.opt.button_height_unit}`,
                        "line-height": `${this.opt.button_height}${this.opt.button_height_unit}`,
                        "text-align": "center",
                        "border-top": `solid 1px ${this.opt.wrapper_border_color}`,
                        "color": this.opt.wrapper_font_color,
                        "cursor": "pointer"
                    })
                    .text("开始上传")
                    .appendTo(this.dom_obj.buttons);
            },
            // 按钮监听
            buttonsLisenter: function() {
                this.dom_obj.buttons.find("li").hover(
                    (e) => {
                        const _this = $(e.target);
                        if (_this.hasClass("disable"))
                            return;

                        _this.css({
                            "color": this.opt.wrapper_border_color,
                            "text-decoration": "underline"
                        });
                    }, (e) => {
                        $(e.target).css({
                            "color": this.opt.wrapper_font_color,
                            "text-decoration": "none"
                        });
                    }
                );

                // 关闭
                this.dom_obj.button_close.unbind("click").on("click", () => {
                    this.ProgressViewClose();
                });

                // 删除
                this.dom_obj.file_ul.find(".cell4").unbind("click").on("click", (e) => {
                    const _this = $(e.target);

                    if (_this.css("cursor") != "pointer")
                        return;

                    _this.parents("li").remove();
                });

                // 开始上传
                this.dom_obj.button_start.unbind("click").on("click", (e) => {
                    const _this = $(e.target);

                    if (_this.hasClass("disable"))
                        return;

                    _this.addClass("disable").css({
                        "color": this.opt.wrapper_font_color,
                        "text-decoration": "none",
                        "cursor": "default"
                    }).text("上传中，请稍候");

                    const cell4_button = this.dom_obj.file_ul.find(".cell4");
                    cell4_button.html(this.dom_obj.file_span_cell4_button_wait_html);
                    $(cell4_button[0]).html("0%");
                });
            },
            // debug
            debug: function(message, act) {
                if (this.opt.debug !== true)
                    return;

                switch (act) {
                    case "log":
                        console.log(message);
                        break;
                    case "warn":
                        console.warn(message);
                        break;
                    case "error":
                        console.error(message);
                        break;
                    case "debug":
                    default:
                        console.debug(message);
                        break;
                }
            }
        };
    }

    // 获得进度条视图的opt_assign
    const getProgress_opt_assign = (opt) => {

        const opt_default = {
            "debug": true,
            "show_kind": 1, // 1- 弹层显示 2- 不显示，返回dom对象。默认1
            "z_index": 500, // show_kind=1时有效，背景z-index，wrapper的z-index为z_index+1。默认500
            "bg_color": "rgba(0,0,0,0.8)", // show_kind=1时有效，背景颜色
            "wrapper_width": 700,
            "wrapper_width_unit": "px",
            "wrapper_height": 450,
            "wrapper_height_unit": "px",
            "wrapper_border_color": "#192884",
            "wrapper_border_radius_px": "5px",
            "wrapper_bg_color": "rgb(255,255,255)",
            "wrapper_font_size": "12px",
            "wrapper_font_color": "#666",
            "button_height": 40,
            "button_height_unit": "px",
            "files": [],
            "autoStart": true // show_kind=1时有效，自动开始上传。默认true
        };

        return Object.assign(opt_default, opt);

    };

    // 格式化size
    const sizeFormat = (size_total) => {
        const size_perUnit = 1024;
        let size_percent = size_total / size_perUnit;
        let size_level = 0; // 0-KB 1-MB 2-G
        const size_unit = ["KB", "MB", "G"];

        while (size_percent >= size_perUnit && size_level < size_unit.length) {
            size_percent /= size_perUnit;
            size_level++;
        }

        size_percent = Math.floor(size_percent * 100) / 100;

        return `${size_percent}${size_unit[size_level]}`;
    };

    if (typeof define === "function" && define.amd) {
        define(() => WebUploader);
    } else {
        window.WebUploader = WebUploader;
    }
})();