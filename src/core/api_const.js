const PORT = 8000;
const MONGODB_URI = "";
const GOOGLE_DRIVE_TOKEN = {
    "access_token": "",
    "refresh_token": "",
    "scope": "",
    "token_type": "Bearer",
    "id_token": "",
    "expiry_date": 1674145055939
};
const FOLDER_ID = '';
const DBNAME = "pet_house";
const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URIS =  ["http://127.0.0.1:8000"];
const IMG_BUCKET = "photos";
const GOOGLE_DRIVE_IMAGE_URL = 'https://drive.google.com/uc?export=view&id=';

//cloadinary consts
const CLOUDINARY_NAME= '';
const CLOUDINARY_API_KEY= '';
const CLOUDINARY_API_SECRET= '';
const ONE_SIGNAL_CONFIG = {
    APP_ID:"",
    API_KEY:"",
};

exports.PORT = PORT ;
exports.MONGODB_URI = MONGODB_URI ;
exports.GOOGLE_DRIVE_TOKEN = GOOGLE_DRIVE_TOKEN;
exports.FOLDER_ID = FOLDER_ID;
exports.DBNAME = DBNAME;
exports.CLIENT_ID = CLIENT_ID;
exports.CLIENT_SECRET = CLIENT_SECRET;
exports.REDIRECT_URIS = REDIRECT_URIS;
exports.IMG_BUCKET = IMG_BUCKET;
exports.GOOGLE_DRIVE_IMAGE_URL = GOOGLE_DRIVE_IMAGE_URL;
exports.CLOUDINARY_NAME = CLOUDINARY_NAME;
exports.CLOUDINARY_API_KEY = CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = CLOUDINARY_API_SECRET;
exports.ONE_SIGNAL_CONFIG = ONE_SIGNAL_CONFIG;