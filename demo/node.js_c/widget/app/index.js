define(["modules/debug", "lib/WebUploader"], function($debug, $WebUploader) {
    const index = {
        init: () => {
            $debug.warn(`index 4: init()`);

            index.inputListener();

            index.$WebUploader1 = new $WebUploader(1);
            index.$WebUploader2 = new $WebUploader(2);
            index.$WebUploader3 = new $WebUploader(3);
        },
        inputListener: () => {
            index.input_1();
            index.input_2();
            index.input_3();
        },
        input_1: () => {
            $(".file_1").unbind("change").on("change", () => {

                const files = $(".file_1")[0].files;
                if (files.length === 0)
                    return;

                $debug.debug(`\n9:files=`);
                $debug.debug($(".file_1")[0].files);

                let filePath = {};

                index.$WebUploader1.getProgressView({
                    debug: true,
                    files: files,
                    thread_maxCount: 2,
                    upload_url: "/uploadfile",
                    check_url: "/checkfile",
                    autoStart: true,
                    callback_successAll: (_filePath) => {
                        index.$WebUploader1.ProgressViewClose();
                        window.alert("success");
                        filePath = $.extend(filePath, _filePath);
                        $debug.warn(`\n37 callback_successAll: filePath=`);
                        $debug.warn(filePath);
                    },
                    callback_successAll_hasError: (_filePath) => {
                        filePath = $.extend(filePath, _filePath);
                    }
                });

                $(".file_1").val("");
            });
        },
        input_2: () => {
            $(".file_2").unbind("change").on("change", () => {

                const files = $(".file_2")[0].files;
                if (files.length === 0)
                    return;

                const wrapper = $(".file_2_progress");

                let filePath = {};
                const progressView = index.$WebUploader2.getProgressView({
                    debug: true,
                    show_kind: 2,
                    files: files,
                    wrapper_width: 70,
                    wrapper_width_unit: "vw",
                    wrapper_height: 50,
                    wrapper_height_unit: "vh",
                    upload_url: "/handle/upload.ashx",
                    check_url: "/handle/check.ashx",
                    // upload_url: "/uploadfile",
                    // check_url: "/checkfile",
                    thread_maxCount: 2,
                    // callback_progressViewClose: () => {
                    //     progressView.dom_obj.file_ul.html("");
                    // },
                    callback_successAll: (_filePath) => {
                        $debug.warn(`\n70 callback_successAll: _filePath=`);
                        $debug.warn(_filePath);
                        index.$WebUploader2.ProgressViewClose();
                        window.alert("success");
                        filePath = $.extend(filePath, _filePath);
                        $debug.warn(`\n75 callback_successAll: filePath=`);
                        $debug.warn(filePath);
                    },
                    callback_successAll_hasError: (_filePath) => {
                        $debug.warn(`\n79 callback_successAll_hasError: _filePath=`);
                        $debug.warn(_filePath);
                        filePath = $.extend(filePath, _filePath);
                    }
                });

                // $debug.warn(`\n75: progressView=`);
                // $debug.warn(progressView[0].outerHTML);

                progressView.appendTo(wrapper).css("display", "block");

                $(".file_2").val("");
            });
        },
        input_3: () => {
            $(".file_3").unbind("change").on("change", () => {

                const files = $(".file_3")[0].files;
                if (files.length === 0)
                    return;

                const wrapper = $(".file_3_progress").html("");
                let i = 0,
                    len = files.length,
                    f,
                    filesArray = [],
                    filesIndexFlagArray = [],
                    li = [],
                    li_temp = $(document.createElement("li"));
                for (; i < len; i++) {
                    f = files.item(i);
                    filesArray.push(f);
                    filesIndexFlagArray.push(i);
                    li.push(li_temp.clone());
                    li[i].html(`${f.name}: <span>0%</span>`).appendTo(wrapper);
                }

                // 取消按钮
                $(document.createElement("li")).css({
                    "cursor": "pointer",
                    "font-weight": "bold",
                    "color": "#999"
                }).text("取消").appendTo(wrapper).unbind("click").on("click", () => {
                    index.$WebUploader3.Upload_abort();
                });

                // 上传按钮
                let filePath = {};
                $(document.createElement("li"))
                    .addClass("button_li")
                    .css({
                        "cursor": "pointer",
                        "font-weight": "bold"
                    }).text("开始上传").appendTo(wrapper).unbind("click").on("click", () => {

                        $debug.debug(`\n100 button_li clicked`);
                        $debug.debug(filesArray);
                        $debug.debug(filesIndexFlagArray);

                        // 让上传在restart的click后执行。
                        setTimeout(() => {
                            index.$WebUploader3.UploadStart({
                                files: filesArray, // 上传文件列表，FileList或FileArray均可
                                filesIndexFlag: filesIndexFlagArray, // 上传文件对应的index标识
                                upload_url: "/uploadfile",
                                check_url: "/checkfile",
                                thread_maxCount: 2, // 最多同时执行上传线程。默认5
                                callback_progress: (index, percent) => {
                                    li[index].find("span").text(`${percent}%`);
                                }, // 进度条更改回调。function(index=文件序号,percent=上传百分比)
                                callback_success: (index, fileinfo) => {
                                    li[index].find("span").html(`&radic; ${fileinfo.filePath}`);
                                }, // 上传成功回调（每个文件上传成功都会回调一次）。function(index=文件序号,filePath=上传后文件路径)
                                callback_successAll: (_filePath) => {
                                    window.alert("success");
                                    filePath = $.extend(filePath, _filePath);
                                    $debug.warn(`\n37 callback_successAll: filePath=`);
                                    $debug.warn(filePath);
                                },
                                callback_successAll_hasError: (hasError, _filePath) => {

                                    $debug.warn(hasError);
                                    $debug.warn(_filePath);

                                    filePath = $.extend(filePath, _filePath);

                                    let error_li = [],
                                        success_li = [],
                                        error_filesArray = [],
                                        error_filesIndexFlagArray = [];

                                    for (var i = 0, len = li.length; i < len; i++) {
                                        if (hasError.indexOf(i) == -1) {
                                            $debug.warn(i);
                                            success_li.push(li[i]);
                                        } else {
                                            error_li.push(li[i]);
                                            error_filesArray.push(filesArray[i]);
                                            error_filesIndexFlagArray.push(filesIndexFlagArray[i]);
                                        }
                                    }

                                    li = error_li;
                                    error_li = [];

                                    filesArray = error_filesArray;
                                    error_filesArray = [];

                                    filesIndexFlagArray = error_filesIndexFlagArray;
                                    error_filesIndexFlagArray = [];

                                    $debug.warn(`\n184 hasError: filesArray & filesIndexFlagArray=`);
                                    $debug.warn(filesArray);
                                    $debug.warn(filesIndexFlagArray);

                                    $(".button_li").text("重新上传").one("click", function() {
                                        success_li.forEach(function(li) {
                                            li.remove();
                                        });
                                        success_li = [];
                                    });
                                }
                            });
                        }, 0);
                    });

                $(".file_3").val("");
            });
        }
    };

    return index;
});