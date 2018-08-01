/*
    web-upload 0.1.1
    高京
    2018-07-06
*/

(function() {

    // 通用参数
    const opt_global = {
        "debug": false,
        "li_height": 40,
        "li_height_unit": "px"
    };

    function WebUploader() {

        return {
            // 获得进度条视图
            getProgressView: function(opt) {

                this.opt = getProgress_opt_assign(opt);

                debug(`
                    \n24: this.opt=
                `);
                debug(this.opt);

                debug(`
                    \n29: this.dom_obj=
                `);
                debug(this.dom_obj);

                if (!this.dom_obj) {
                    // 创建dom
                    this.create_dom();
                } else {
                    this.dom_obj.file_ul.html("");
                }

                debug(`\n40: this.dom_obj.file_ul&this.dom_obj.file_li_title=`);
                debug(this.dom_obj.title_ul.attr("style"));
                debug(this.dom_obj.title_ul[0].outerHTML);

                debug(`\n43: this.opt.files=`);
                debug(this.opt.files);

                let i = 0,
                    len = this.opt.files.length,
                    f;
                let li, span;
                for (; i < len; i++) {
                    li = this.dom_obj.file_li_template.clone().attr("ProgressView_liIndex", i);
                    span = li.find("span");
                    f = this.opt.files[i];
                    debug(`
                        \n45:f=
                    `);
                    debug(f);
                    $(span[0]).text(f.name);
                    $(span[1]).text(sizeFormat(f.size));
                    li.appendTo(this.dom_obj.file_ul);
                }

                debug(`\n58: this.opt.show_kind=${this.opt.show_kind}; this.opt.files=`);
                debug(this.opt.files);

                // 监听按钮
                this.buttonsLisenter();

                // 显示弹层
                if (this.opt.show_kind == 1) {

                    debug(`\n62`);
                    this.dom_obj.wrapper_bg.css("display", "block");
                    this.dom_obj.wrapper.css("display", "block");

                    // autostart
                    if (this.opt.autoStart === true)
                        this.dom_obj.button_start.trigger("click");

                } else
                    return this.dom_obj.wrapper;
            },
            // 关闭进度条视图
            ProgressViewClose: function() {
                debug("\n79 ProgressViewClose()");
                if (this.dom_obj) {
                    this.dom_obj.wrapper_bg &&
                        this.dom_obj.wrapper_bg.css("display", "none");
                    this.dom_obj.wrapper &&
                        this.dom_obj.wrapper.css("display", "none");
                    this.dom_obj.button_start.removeClass("disable").text("开始上传").css("cursor", "pointer");

                    this.dom_obj.file_ul.html("");
                    this.UploadSuccessFilepath = {};
                    this.UploadSuccessCount = 0;
                }

                this.opt.callback_progressViewClose && this.opt.callback_progressViewClose();
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

                debug(`
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
                        "height": `${opt_global.li_height}${opt_global.li_height_unit}`
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
                        "height": `${opt_global.li_height}${opt_global.li_height_unit}`,
                        "border-top": "dashed 1px #ccc"
                    });

                // cell模板
                this.dom_obj.file_span_template = $(document.createElement("span"))
                    .css({
                        "display": "table-cell",
                        "word-break": "break-all",
                        "font-size": this.opt.wrapper_font_size,
                        "color": this.opt.wrapper_font_color,
                        "height": `${opt_global.li_height}${opt_global.li_height_unit}`,
                        "vertical-align": "middle"
                    });

                // cell1 - 文件名
                debug(`
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
                        // "top": "50%",
                        "left": `${this.dom_obj.file_span_cell3.width()*0.05}px`,
                        "margin-top": "-5px",
                        "border-radius": "5px",
                        "background": "#ccc"
                    }).appendTo(this.dom_obj.file_span_cell3),
                    color: $(document.createElement("p")).css({
                        "width": `${this.dom_obj.file_span_cell3.width()*0}px`,
                        "height": "10px",
                        "position": "absolute",
                        // "top": "50%",
                        "left": "5%",
                        "margin-top": "-5px",
                        "border-radius": "5px",
                        "background": this.opt.wrapper_border_color
                    }).appendTo(this.dom_obj.file_span_cell3)
                };

                // cell4 - icon - delete
                this.dom_obj.file_span_cell4_button_delete_html = `
                    <span><svg class="file_span_cell4_button_delete" t="1522138218728" style="fill:${this.opt.wrapper_font_color}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3162" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                    <path d="M826.668581 311.533464c0-8.83361 7.163979-16.000395 15.997589-16.000395S858.667967 302.732124 858.667967 311.533464l0 613.801178c0 27.098529-11.134613 51.766973-29.001066 69.665696-17.86505 17.866453-42.567167 28.999663-69.665696 28.999663L264.0016 1024c-27.099932 0-51.832916-11.13321-69.667099-28.999663-17.866453-17.866453-28.999663-42.530688-28.999663-69.665696L165.334839 311.533464c0-8.83361 7.166785-16.000395 15.998992-16.000395 8.83361 0 16.000395 7.199055 16.000395 16.000395l0 613.801178c0 18.267725 7.534384 34.966839 19.600624 47.031676 12.066239 12.067642 28.766756 19.632894 47.033079 19.632894l496.002411 0c18.266322 0 34.93036-7.568058 46.999405-19.632894 12.099913-12.099913 19.631491-28.766756 19.631491-46.999405L826.601235 311.533464 826.668581 311.533464z" p-id="1939"></path>
                    <path d="M392.666997 884.000756c0 8.83361-7.166785 15.998992-16.000395 15.998992s-16.000395-7.165382-16.000395-15.998992l0-568.333904c0-8.83361 7.166785-16.000395 16.000395-16.000395s16.000395 7.166785 16.000395 16.000395L392.666997 884.000756z" p-id="1940"></path>
                    <path d="M528.001096 884.000756c0 8.83361-7.165382 15.998992-15.998992 15.998992s-16.000395-7.165382-16.000395-15.998992l0-568.333904c0-8.83361 7.166785-16.000395 16.000395-16.000395s15.998992 7.166785 15.998992 16.000395L528.001096 884.000756z" p-id="1941"></path>
                    <path d="M663.367465 884.000756c0 8.83361-7.163979 15.998992-15.997589 15.998992-8.835013 0-16.000395-7.165382-16.000395-15.998992l0-568.333904c0-8.83361 7.165382-16.000395 16.000395-16.000395 8.83361 0 15.997589 7.166785 15.997589 16.000395L663.367465 884.000756 663.367465 884.000756z" p-id="1942"></path>
                    <path d="M383.333901 98.666762c0 8.83361-7.166785 16.000395-16.000395 16.000395-8.832207 0-15.998992-7.166785-15.998992-16.000395 0-27.167278 11.099537-51.832916 28.967393-69.699369C398.168361 11.099537 422.835402 0 450.001277 0l124.000252 0c27.133605 0 51.800646 11.13321 69.664293 28.999663 17.866453 17.866453 29.001066 42.599437 29.001066 69.667099 0 8.83361-7.165382 16.000395-15.998992 16.000395s-15.998992-7.166785-15.998992-16.000395c0-18.266322-7.532981-34.966839-19.600624-47.033079-12.069045-12.067642-28.766756-19.634297-47.033079-19.634297l-123.998849 0c-18.299995 0-34.966839 7.532981-47.066752 19.600624C390.866883 63.699922 383.333901 80.366766 383.333901 98.666762z" p-id="1943"></path>
                    <path d="M139.999945 144.665792l744.00011 0c15.698739 0 30.032309 6.432989 40.433126 16.833807l0.065943 0.067346c10.400818 10.399415 16.833807 24.732985 16.833807 40.433126l0 41.333885c0 8.832207-7.166785 15.998992-16.000395 15.998992l-0.433543 0L98.667463 259.332948c-8.83361 0-16.000395-7.166785-16.000395-15.998992l0-0.39987 0-40.934015c0-15.666468 6.432989-30.033712 16.833807-40.433126l0.067346-0.067346C109.967637 151.100184 124.333477 144.665792 139.999945 144.665792L139.999945 144.665792zM884.001458 176.666581 139.999945 176.666581c-6.966149 0-13.333194 2.834163-17.866453 7.399691L122.066146 184.133619c-4.566931 4.531855-7.399691 10.866631-7.399691 17.866453l0 25.33349 794.633417 0 0-25.33349c0-6.966149-2.834163-13.333194-7.398288-17.866453l-0.06875-0.067346C897.302382 179.500744 890.967607 176.666581 884.001458 176.666581z" p-id="1944"></path>
                    </svg></span>
                `;

                // cell4 - icon - wait
                this.dom_obj.file_span_cell4_button_wait_html = `
                    <svg class="file_span_cell4_button_wait" t="1522138218728" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3162" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                    <path style="fill:${this.opt.wrapper_font_color};" d="M896 0 128 0l0 42.666667 106.666667 0 0 234.645333C234.666667 389.333333 389.653333 474.389333 469.333333 512c-79.68 37.610667-234.666667 122.666667-234.666667 234.688L234.666667 981.333333 128 981.333333l0 42.666667 768 0 0-42.666667-106.666667 0L789.333333 746.688C789.333333 634.666667 634.346667 549.610667 554.666667 512c79.68-37.610667 234.666667-122.624 234.666667-234.666667l0-234.666667 106.666667 0L896 0zM746.666667 746.688 746.666667 981.333333 277.333333 981.333333 277.333333 746.688c0-93.589333 160.384-182.592 234.666667-213.354667C586.282667 564.117333 746.666667 653.12 746.666667 746.688zM746.666667 277.312c0 93.589333-160.426667 182.592-234.666667 213.354667-74.282667-30.784-234.666667-119.786667-234.666667-213.354667L277.333333 42.666667l469.333333 0L746.666667 277.312z" p-id="2106"></path>
                    </svg>
                `;

                // cell4 - 操作/状态
                this.dom_obj.file_span_template.clone()
                    .addClass("cell4").css({
                        "width": "10%",
                        "text-align": "center"
                    })
                    .html(this.dom_obj.file_span_cell4_button_delete_html)
                    .appendTo(this.dom_obj.file_li_template)
                    .find("span").css({
                        "cursor": "pointer"
                    });

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

                debug(`\n317 this.opt.files=`);
                debug(this.opt.files.length);

                // 开始上传
                this.dom_obj.button_start.unbind("click").on("click", (e) => {

                    setTimeout(() => {

                        const _this = $(e.target);

                        debug(`\n331 start click`);

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

                        debug(`\n357 button_start.click. files=`);
                        debug(this.opt.files);

                        this.UploadStart({
                            files: this.opt.files,
                            url: this.opt.upload_url,
                            thread_maxCount: this.opt.thread_maxCount,
                            callback_successAll: this.opt.callback_successAll
                        });
                    }, 0);
                });

                // hover效果
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
                this.dom_obj.file_ul.find(".cell4 span").hover((e) => {
                    $(e.target).parents(".cell4").find("svg").css({
                        "fill": this.opt.wrapper_border_color
                    });
                }, (e) => {
                    $(e.target).parents(".cell4").find("svg").css({
                        "fill": this.opt.wrapper_font_color
                    });
                }).unbind("click").on("click", (e) => {
                    const _this = $(e.target),
                        li = _this.parents("li");

                    if (_this.css("cursor") != "pointer")
                        return;

                    debug(`\n354 li.remove()前: this.opt.files=`);
                    debug(this.opt.files);

                    this.opt.files.splice(li.index(), 1);
                    li.remove();

                    debug(`\n360 li.remove()后: this.opt.files=`);
                    debug(this.opt.files);

                    if (this.opt.files.length === 0)
                        this.ProgressViewClose();

                });
            },

            // 上传文件成功个数
            UploadSuccessCount: 0,
            // 上传成功的文件路径
            UploadSuccessFilepath: {},
            // 正在上传序数
            Uploading_index: 0,
            // 开始上传
            UploadStart: function(opt) {
                this.opt_upload = UploadStart_opt_assign(opt);

                debug(`\n437 this.opt_upload=`);
                debug(this.opt_upload);

                let i = 0,
                    len = this.opt_upload.files.length,
                    para = {
                        hasError: [],
                        url: this.opt_upload.url,
                        callback_progress: (event_progress, index) => {
                            // debug(`\n438: UploadStart.callback_progress.event_progress=`);
                            // debug(event_progress);
                            if (event_progress.lengthComputable) {
                                const percent = Math.floor(event_progress.loaded * 100 / event_progress.total);

                                if (this.opt_upload.callback_progress)
                                    this.opt_upload.callback_progress(index, percent);
                                else {
                                    const li = this.dom_obj.file_ul.find(`li:eq(${index})`),
                                        progress_gray = li.find(".cell3 p:first"),
                                        progress_color = li.find(".cell3 p:last"),
                                        percent_span = li.find(".cell4");

                                    percent_span.text(`${percent}%`);
                                    progress_color.css("width", `${progress_gray.width()*percent/100}px`);
                                }
                            }
                        },
                        UploadSuccessCounter_success: (filePath) => {

                            debug(`\n459: UploadStart callback_successAll. filePath=`);
                            debug(filePath);
                            debug(`\n461: UploadStart callback_successAll. para.hasError=`);
                            debug(para.hasError);


                            this.UploadSuccessFilepath = {};
                            this.UploadSuccessCount = 0;

                            if (para.hasError.length > 0) {
                                if (this.dom_obj) {

                                    this.opt.callback_successAll_hasError &&
                                        this.opt.callback_successAll_hasError(filePath);

                                    const reStart = () => {
                                        const li = this.dom_obj.file_ul.find("li");

                                        for (var i = 0, len = li.length; i < len; i++) {
                                            if (para.hasError.indexOf(i) == -1) {
                                                $(li[i]).remove();
                                                this.opt.files[i] = "";
                                            }
                                        }
                                        for (var arr = [], i = 0, len = this.opt.files.length; i < len; i++) {
                                            if (this.opt.files[i] === "")
                                                continue;
                                            arr.push(this.opt.files[i]);
                                        }
                                        this.opt.files = arr;

                                        para.hasError = [];

                                        debug(`\n483: 重试后的files=`);
                                        debug(this.opt.files);
                                    };

                                    this.dom_obj && this.dom_obj.button_start.text("重试").css({
                                        "cursor": "pointer"
                                    }).removeClass("disable").one("click", reStart);
                                } else {
                                    this.opt_upload.callback_successAll_hasError &&
                                        this.opt_upload.callback_successAll_hasError(para.hasError, filePath);
                                }
                            } else {
                                this.opt_upload.callback_successAll && this.opt_upload.callback_successAll(filePath);
                            }

                        },
                        UploadSuccessCounter_next: () => {
                            var i = ++this.Uploading_index;
                            if (i < this.opt_upload.files.length) {
                                para.file = this.opt_upload.files[i];
                                para.index = i;
                                para.index_flag = this.opt_upload.filesIndexFlag[i];
                                this.Upload_do(para);
                            }
                        },
                        callback_success: (index, filePath) => {

                            debug(`\n112: UploadStart callback_success. index=${index},filePath=${filePath}`);

                            if (this.opt_upload.callback_success)
                                this.opt_upload.callback_success(index, filePath);

                            setTimeout(() => {
                                this.UploadSuccessCounter(this.opt_upload.files.length, para.UploadSuccessCounter_success, para.UploadSuccessCounter_next);
                            }, 0);
                        },
                        callback_error: (index) => {

                            para.hasError.push(index);

                            if (this.opt_upload.callback_error)
                                this.opt_upload.callback_error(index);
                            if (this.dom_obj) {
                                const li = this.dom_obj.file_ul.find(`li:eq(${index})`),
                                    percent_span = li.find(".cell4");

                                debug(`\n487: callback_error. percent_span.length=${percent_span.length}`);

                                // setTimeout使得文字的修改在callback_progress后执行
                                setTimeout(() => {
                                    percent_span.text(`失败`);
                                }, 0);
                            }
                            setTimeout(() => {
                                this.UploadSuccessCounter(this.opt_upload.files.length, para.UploadSuccessCounter_success, para.UploadSuccessCounter_next);
                            }, 1);
                        }
                    };
                for (; i < len && i < this.opt_upload.thread_maxCount; i++) {
                    para.file = this.opt_upload.files[i];
                    para.index = i;
                    para.index_flag = this.opt_upload.filesIndexFlag[i];
                    debug(`\n560: Upload_do.para.index_flag=${para.index_flag}`);
                    this.Upload_do(para);
                }
            },

            // 上传文件成功计数。count=上传文件总个数; _success_callback=全部文件上传成功回调; _next_callback=未全部上传成功回调(调用下一个UploadDo)
            UploadSuccessCounter: function(count, _success_callback, _next_callback) {
                if (++this.UploadSuccessCount >= count)
                    _success_callback && _success_callback(this.UploadSuccessFilepath);
                else
                    _next_callback && _next_callback();
            },

            // 上传文件
            Upload_do: function(opt) {

                opt = Object.assign({
                    url: "",
                    file: "",
                    index: -1,
                    index_flag: -1,
                    callback_progress: null,
                    callback_success: null
                }, opt);

                this.Uploading_index = opt.index;

                // if (opt.index < 0 || opt.files.length < 1 || opt.index >= opt.files.length)
                if (opt.file === "")
                    opt.callback_success && opt.callback_success();

                debug(`\n422: Upload_do.opt=`);
                debug(opt);

                let formdata = new FormData();
                formdata.append(`file`, opt.file);
                formdata.append(`index`, 1);
                formdata.append(`count`, 0);

                debug(`\n432: Upload_do.formdata=`);
                debug(formdata);
                debug(`file=`);
                debug(opt.file);

                $.ajax({
                    url: opt.url,
                    type: "post",
                    data: formdata,
                    contentType: false,
                    cache: false,
                    processData: false,
                    dataType: "json",
                    xhr: () => {
                        let Xhr = $.ajaxSettings.xhr();
                        Xhr.upload.addEventListener("progress", (e) => {
                            opt.callback_progress && opt.callback_progress(e, opt.index);
                        });
                        return Xhr;
                    },
                    success: (res) => {

                        debug(`\n614: upload success. this.dom_obj=`);
                        debug(this.dom_obj);

                        const index = this.dom_obj ? this.dom_obj.file_ul.find(`li:eq(${opt.index})`).attr("ProgressView_liIndex") : opt.index_flag;
                        this.UploadSuccessFilepath[index] = res.filePath;

                        debug(`\n626: index=${index}; opt.index_flag=${opt.index_flag}; this.UploadSuccessFilepath=`);
                        debug(this.UploadSuccessFilepath);

                        // 为了让callback_success在callback_progress后执行。
                        setTimeout(() => {
                            opt.callback_success && opt.callback_success(opt.index, res.filePath);
                        }, 50);
                    },
                    error: (err) => {
                        debug(`\n554:upload error. err=`);
                        debug(err);

                        opt.callback_error && opt.callback_error(opt.index);
                    }
                });
            }
        };
    }

    // 获得进度条视图的opt_assign
    const getProgress_opt_assign = (opt) => {

        const opt_default = {
            show_kind: 1, // 1- 弹层显示 2- 不显示，返回dom对象。默认1
            wrapper_width: 700, // 外盒宽度。默认700
            wrapper_width_unit: "px", // 外盒宽度单位，默认"px"
            wrapper_height: 450, // 外盒高度。默认450
            wrapper_height_unit: "px", // 外盒高度单位，默认"px"
            wrapper_border_color: "#192884", // 外盒边框颜色，默认 "#192884"
            wrapper_border_radius_px: "5px", // 外盒圆角radius，默认 "5px"
            wrapper_bg_color: "rgb(255,255,255)", // 背景颜色，默认 "rgb(255,255,255)"
            wrapper_font_size: "12px", // 字体大小，默认"12px"
            wrapper_font_color: "#666666", // 字体颜色，默认"#666666"
            button_height: 40, // 底部按钮高度，默认40
            button_height_unit: "px", // 底部按钮高度单位，默认"px"
            files: [], // 待上传图片列表，Filelist。
            upload_url: null, // 上传文件处理地址。
            thread_maxCount: 5, // 最多同时执行上传线程。默认5
            z_index: 500, // show_kind=1时有效，背景z-index，wrapper的z-index为z_index+1。默认500
            bg_color: "rgba(0,0,0,0.8)", // show_kind=1时有效，背景颜色。默认"rgba(0,0,0,0.8)"
            autoStart: true, // show_kind=1时有效，选好文件自动开始上传。默认true
            callback_progressViewClose: null, // 关闭进度条后执行回调
            callback_successAll: null, // 全部文件上传成功后回调。function(filePath={0:文件0路径,1:文件1路径,n:文件n路径}){}
            callback_successAll_hasError: null // 全部文件上传完成 但 其中有上传错误 时回调。function(filePath={0:文件0路径,1:文件1路径,n:文件n路径}){}
        };
        opt.files = FileListToFileArray(opt.files);

        // 设置debug
        if (opt.debug !== undefined)
            opt_global.debug = opt.debug;


        return Object.assign(opt_default, opt);
    };

    // 开始上传的opt_assign
    const UploadStart_opt_assign = (opt) => {

        const opt_default = {
            files: [], // 上传文件列表，Filelist或array都可以
            filesIndexFlag: [], // 上传文件对应的index标识，在返回的对象中作为key
            url: null, // ajax页面地址
            thread_maxCount: 5, // 最多同时执行上传线程。默认5
            callback_progress: null, // 进度条更改回调。function(index=文件序号,percent=上传百分比)
            callback_success: null, // 上传成功回调（每个文件上传成功都会回调一次）。function(index=文件序号,filePath=上传后文件路径)
            callback_error: null, // 上传失败回调（每个文件上传失败都会回调一次）。function(index=文件序号)
            callback_successAll: null, // 全部文件上传成功回调。function(filePath={0:文件0路径,1:文件1路径,n:文件n路径}){}
            callback_successAll_hasError: null // 全部文件上传完成 但 其中有上传错误 时回调。function(index[]=失败的文件序号数组,filePath={0:文件0路径,1:文件1路径,n:文件n路径}){}
        };

        opt.files = FileListToFileArray(opt.files);

        // 设置debug
        if (opt.debug !== undefined)
            opt_global.debug = opt.debug;

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

    // debug
    const debug = (message, act) => {
        if (opt_global.debug !== true)
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
                console.debug(message);
                break;
            default:
                console.debug(message);
                break;
        }
    };

    // FileList to FileArray
    const FileListToFileArray = (filelist) => {

        // FileList会有item方法
        if (!filelist.item)
            return filelist;

        let i = 0,
            len = filelist.length,
            files = [];
        for (; i < len; i++) {
            files.push(filelist.item(i));
        }

        return files;
    };

    if (typeof define === "function" && define.amd) {
        define(() => WebUploader);
    } else {
        window.WebUploader = WebUploader;
    }
})();