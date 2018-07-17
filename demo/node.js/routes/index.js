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
                fs.statSync(dir_temp);
            } catch (e) {
                fs.mkdirSync(dir_temp);
            }
            cb(null, dir_temp);
        },
        filename: function(req, file, cb) {
            debug.log("\n\n index 9: Date.now=" + Date.now());
            cb(null, file.originalname);
        }
    }),
    multer_uploadFile = multer({ storage: multer_storage });

router.get('/', function(req, res) {
    res.render('demo_amd.html');
});

router.post('/uploadfile', multer_uploadFile.single('file'), function(req, res) {
    debug.log("\n\n index 31: req.body=" + JSON.stringify(req.body));
    debug.log("\n\n index 32: req.file=" + JSON.stringify(req.file));

    var filePath;

    req.body.count = ~~req.body.count || 0;
    if (req.body.count === 0) {
        filePath = dir_temp.replace("/temp", "/") + createFileName(req.file.originalname);
        fs.rename(req.file.path, filePath);
    } else if (~~req.body.index >= req.body.count) {

    }
    res.send({
        filePath: filePath
    });
});

module.exports = router;