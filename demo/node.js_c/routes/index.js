var router = require('express').Router(),
    func = require('../handle/functions'),
    debug = require('../handle/debug'),
    fs = require('fs'),
    createFileName = function(_name) {
        return func.dateFormat(Date.now(), 'yyyymmddHHMMss') + func.CreateRandomStr(6, 1) + "_" + _name;
    },
    dir_temp = './UploadFile/temp',
    multer = require('multer'),
    multer_storage = multer.diskStorage({
        destination: function(req, file, cb) {
            try {
                fs.statSync(dir_temp.replace("/temp", ""));
            } catch (e) {
                fs.mkdirSync(dir_temp.replace("/temp", ""));
            }
            try {
                fs.statSync(dir_temp);
            } catch (e) {
                fs.mkdirSync(dir_temp);
            }
            cb(null, dir_temp);
        },
        filename: function(req, file, cb) {
            debug.log("\n\n index 9: Date.now=" + Date.now());
            cb(null, createFileName(file.originalname));
        }
    }),
    multer_uploadFile = multer({ storage: multer_storage });

router.get('/', function(req, res) {
    res.render('demo_amd.html');
});

router.post('/uploadfile', multer_uploadFile.single('file'), function(req, res) {
    debug.log("\n\n index 31: req.body=" + JSON.stringify(req.body));
    debug.log("\n\n index 32: req.file=" + JSON.stringify(req.file));

    const filePath = dir_temp.replace("/temp", "/") + createFileName(req.body.filename);

    req.body.count = ~~req.body.count || 0;
    if (req.body.count <= 1) { // 如果文件没有分片，则直接保存
        fs.rename(req.file.path, filePath);

        // 输出文件路径
        res.send({
            filePath: filePath
        });

    } else { // 文件分片了

        // 创建存放临时文件的目录
        const dir_temp_split = `${dir_temp}/${req.body.filename}_${req.body.totalSize}`;
        try {
            fs.statSync(dir_temp_split);
        } catch (e) {
            fs.mkdirSync(dir_temp_split);
        }

        // 另存文件到临时目录
        fs.rename(req.file.path, `${dir_temp_split}/${req.body.index.toString()}`);

        // 如果是最后一片，则合并文件
        if (~~req.body.index >= req.body.count) {

            let readStream,
                writeStream = fs.createWriteStream(filePath);
            const combineStream = (index) => {
                readStream = fs.createReadStream(`${dir_temp_split}/${index.toString()}`);
                readStream.pipe(writeStream, { end: false });
                readStream.on('end', function() {
                    if (index >= req.body.count) {
                        writeStream.end();

                        // 删除临时文件夹
                        let unlinkFileCount = 0;
                        const unlinkFileSuccess = () => {
                            if (++unlinkFileCount >= req.body.count) {
                                fs.rmdir(dir_temp_split, (err) => {
                                });
                            }
                        };
                        fs.readdir(dir_temp_split, (err, files) => {
                            files.forEach((file) => {
                                // console.log(`\nindex 83: file=${file}`);
                                fs.unlink(`${dir_temp_split}/${file}`, () => {
                                    unlinkFileSuccess();
                                })
                            })
                        });

                        res.send({
                            filePath: filePath
                        });
                    } else
                        combineStream(index + 1);
                });
            };
            combineStream(1);

        } else {
            res.send({
                filePath: req.body.index.toString()
            });
        }
    }
});

router.post('/checkfile', function(req, res) {
    fs.readdir(`./UploadFile/temp/${req.body.filename}_${req.body.totalSize}`, (err, files) => {
        const len = err ? 0 : files.length;
        res.send({ count: len });
    });
});

module.exports = router;