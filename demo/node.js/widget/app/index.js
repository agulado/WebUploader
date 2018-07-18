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

                index.$WebUploader1.getProgressView({
                    debug: true,
                    files: files,
                    thread_maxCount: 2,
                    upload_url: "/uploadfile",
                    autoStart: false,
                    callback_successAll: (filePath) => {
                        $debug.warn("\n27 filePath=");
                        $debug.warn(filePath);

                        window.alert("success");

                        index.$WebUploader1.ProgressViewClose();
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

                const progressView = index.$WebUploader2.getProgressView({
                    debug: true,
                    show_kind: 2,
                    files: files,
                    wrapper_width: 70,
                    wrapper_width_unit: "vw",
                    wrapper_height: 50,
                    wrapper_height_unit: "vh",
                    upload_url: "/uploadfile",
                    thread_maxCount: 2,
                    // callback_progressViewClose: () => {
                    //     progressView.dom_obj.file_ul.html("");
                    // },
                    callback_successAll: (filePath) => {
                        $debug.warn(`\n53 filePath=`);
                        $debug.warn(filePath);
                        index.$WebUploader2.ProgressViewClose();
                        window.alert("success");
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
                    li = [],
                    li_temp = $(document.createElement("li"));
                for (; i < len; i++) {
                    f = files.item(i);
                    filesArray.push(f);
                    li.push(li_temp.clone());
                    li[i].html(`${f.name}: <span>0%</span>`).appendTo(wrapper);
                }

                const button_li = $(document.createElement("li"))
                    .css({
                        "cursor": "pointer",
                        "font-weight": "bold"
                    }).text("开始上传").appendTo(wrapper).unbind("click").on("click", () => {

                        $debug.debug(`\n100 button_li clicked`);
                        $debug.debug(filesArray);

                        index.$WebUploader3.UploadStart({
                            files: filesArray, // 上传文件列表，FileList或FileArray均可
                            url: "/uploadfile", // ajax页面地址
                            thread_maxCount: 1, // 最多同时执行上传线程。默认5
                            callback_progress: (index, percent) => {
                                li[index].find("span").text(`${percent}%`);
                            }, // 进度条更改回调。function(index=文件序号,percent=上传百分比)
                            callback_success: (index, filePath) => {
                                li[index].find("span").html(`&radic; ${filePath}`);
                            }, // 上传成功回调（每个文件上传成功都会回调一次）。function(index=文件序号,filePath=上传后文件路径)
                            callback_successAll: () => {
                                window.alert("success");
                            } // 全部文件上传成功回调。function(filePath={0:文件0路径,1:文件1路径,n:文件n路径}){}
                        });
                    });

                $(".file_3").val("");
            });
        }
    };

    return index;
});