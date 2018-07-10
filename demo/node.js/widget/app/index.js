define(["modules/debug", "lib/WebUploader"], function($debug, $WebUploader) {
    const index = {
        init: () => {
            $debug.warn(`index 4: init()`);

            index.inputListener();

            this.$WebUploader1 = new $WebUploader(1);
            this.$WebUploader2 = new $WebUploader(2);
        },
        inputListener: () => {
            $(".file_1").unbind("change").on("change", () => {

                const files = $(".file_1")[0].files;
                if (files.length === 0)
                    return;

                $debug.debug(`\n9:files=`);
                $debug.debug($(".file_1")[0].files);

                this.$WebUploader1.getProgressView({
                    "files": files
                });

                $(".file_1").val("");

                $debug.warn(`
                    \nindex 21: getProgressView()
                    ProgressView=
                `);
            });
            $(".file_2").unbind("change").on("change", () => {

                const files = $(".file_2")[0].files;
                if (files.length === 0)
                    return;

                this.$WebUploader2.ProgressView = this.$WebUploader2.getProgressView({
                    "show_kind": 2,
                    "files": files,
                    "wrapper_width": 90,
                    "wrapper_width_unit": "vw",
                    "wrapper_height": 50,
                    "wrapper_height_unit": "vh"
                }).before($(".file_2")).css("display", "block");

                $(".file_2").val("");
            });
        }
    };

    return index;
});