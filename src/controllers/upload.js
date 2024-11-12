
const upload = require("../middleware/upload");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;


const apiConst = require('../core/api_const');
const url = apiConst.MONGODB_URI;
const baseUrl = "http://localhost:8080/files/";
const mongoClient = new MongoClient(url);


// var cloadinaryUploads = async (req, res) => {
//   try{
//       var result_url;
//       // Upload the file to Cloudinary
//       cloudinary.uploader.upload_stream({ folder: 'uploads' }, (error, result) => {
//         if (error) {
//           console.error(error);
//           return res.status(500).json({ error: 'Something went wrong' });
//         }
//         result_url = result.secure_url;
//         console.log('cloadinary =>'+ result.secure_url);
//         return result_url;
//         // Return the URL of the uploaded image to the client
//         //res.json({ url: result.secure_url });
//       }).end(req.file.buffer);
//   }
//   catch (e){
//       return e;
//   }

 
// };




const uploadSingleFile = async (req, res) => {
  try {
    await upload(req, res);
    console.log(req.file);

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }
    await mongoClient.connect();

    const database = mongoClient.db(apiConst.DBNAME);
    const images = database.collection(apiConst.IMG_BUCKET + ".files");

    const cursor = images.find({});
    
    var fileInfo ;
    await cursor.forEach((doc) => {
      if(doc.filename == req.file.filename){
        fileInfo = {
          name: doc.filename,
          url: baseUrl + doc.filename,
        };
      //    fileInfos.push({
      //   name: doc.filename,
      //   url: baseUrl + doc.filename,
      // });
      }
    });
    return fileInfo;
    
    //return res.status(200).send(fileInfos);

    // return res.send({
    //   message: "File has been uploaded.",
    // });
  } catch (error) {
    console.log(error);

    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();

    // const database = mongoClient.db(dbConfig.database);
    const database = mongoClient.db(apiConst.DBNAME);
    // const images = database.collection(dbConfig.imgBucket + ".files");
    const images = database.collection(apiConst.IMG_BUCKET + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    // const database = mongoClient.db(dbConfig.database);
    // const bucket = new GridFSBucket(database, {
    //   bucketName: dbConfig.imgBucket,
    // });

      const database = mongoClient.db(apiConst.DBNAME);
      const bucket = new GridFSBucket(database, {
        bucketName: apiConst.IMG_BUCKET,
       });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const uploadFiles = async (req, res) => {
    try {
      await upload(req, res);
      console.log(req.files);
  
      if (req.files.length <= 0) {
        return res
          .status(400)
          .send({ message: "You must select at least 1 file." });
      }
  
      return res.status(200).send({
        message: "Files have been uploaded.",
      });
  
    } catch (error) {
      console.log(error);
  
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).send({
          message: "Too many files to upload.",
        });
      }
      return res.status(500).send({
        message: `Error when trying upload many files: ${error}`,
      });
    }
  };

module.exports = {
  uploadFiles,
  getListFiles,
  download,
  uploadSingleFile,
  //cloadinaryUploads,
};