var program = require('commander'),
    fs = require('fs'),
    shell = require('child_process');


// 处理参数
program
    .version('0.1.0')
    .option('-e, --env [env]', 'environment type [test|pub]', /^test|pub$/i, 'test')
    .option('-r, --run [autorun]', 'autorun [true|false]', /^true|false$/i, 'true')
    .option('-s,--supervisor [run with supervisor]', 'run with supervisor [true|false]', /^true|false$/i, 'false')
    .option('-c, --cache [fis cache]', 'fis cache [noclear|clear]', /^noclear|clear$/i, 'noclear')
    .parse(process.argv);

process.stdout.write("please wait a moment ");
var interval_print = setInterval(function() {
    process.stdout.write(".");
}, 500);

// less
(function() {
    var r_index = 0,
        r_count = 1;

    var check_r_count = function() {
        if (++r_index >= r_count) {
            if (program.env == "test")
                run(".");
            else
                r();
        }
    };
    shell.exec("lessc css/style.less css/style.css", function(error) {
        if (error)
            console.log("\n", 50, error, "\n");
        check_r_count();
    });
})();

// 打包js
var r = function() {
    var r_index = 0,
        r_count = 1;

    var check_r_count = function() {
        if (++r_index >= r_count)
            doFis()
    };
    shell.exec("node widget/r.js -o widget/build.js", function(error) {
        if (error)
            console.log("\n", 29, error, "\n");
        check_r_count();
    });
};

// 执行fis操作
var doFis = function() {

    var fis_media = program.env,
        fis_releaseDir = "../" + program.env,
        fis_no_cache = Boolean(program.cache);

    // console.log(fis_no_cache);

    var cmd = "fis3 release " + fis_media;
    if (fis_no_cache)
        cmd += " -c ";
    cmd += " -d " + fis_releaseDir;

    shell.exec(cmd, function(error, stdout, stderr) {

        delete_tempFile();

        // 获取命令执行的输出
        if (error)
            console.log(error);

        run(fis_releaseDir);
    });
};

// 运行node

// 运行
var run = function(fis_releaseDir) {

    clearInterval(interval_print);
    console.log("\n" + "success. release dir:", fis_releaseDir);

    if (program.run.toString().toLowerCase() === "false") {
        return;
    }

    var cmd = "";
    var argv = [];
    var launch_fp = fis_releaseDir + "/launch.js";

    if (program.supervisor.toString().toLowerCase() === "false") {
        cmd = "node";
        argv.push(launch_fp);
    } else {
        cmd = "supervisor";
        argv.push("-w", `${fis_releaseDir}/app.js,${fis_releaseDir}/launch,${fis_releaseDir}/routes,${fis_releaseDir}/handle`, "--debug", launch_fp);
    }

    var spawn = shell.spawn(cmd, argv);

    spawn.stdout.on("data", function(data) {
        console.log(data.toString());
    });

    spawn.stderr.on("data", function(data) {
        console.log(data.toString());
    });
};

// 删除临时文件
var delete_tempFile = function() {
    fs.unlink('./widget/aio.js');
    // fs.unlink('./mobile/widget/aio.js');
};