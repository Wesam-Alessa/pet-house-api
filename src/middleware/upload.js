const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const apiConst = require('../core/api_const');

var storage = new GridFsStorage({
  // url: dbConfig.url + dbConfig.database,
  url: apiConst.MONGODB_URI + apiConst.DBNAME,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-petHouse-${file.originalname}`;
      return filename;
    }
        
    return {
      // bucketName: dbConfig.imgBucket,
      bucketName: apiConst.IMG_BUCKET,
      filename: `${Date.now()}-petHouse-${file.originalname}`,
    };
  }
});



var uploadSingleFile = multer({ storage: storage }).single("file");
var uploadFiles = multer({ storage: storage }).array("file", 10);

var uploadSingleFileMiddleware = util.promisify(uploadSingleFile);
var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
module.exports = uploadSingleFileMiddleware;
