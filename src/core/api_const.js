const PORT = 8000;
const MONGODB_URI = "mongodb+srv://wesamalessa53:wesam@cluster0.pl844.mongodb.net/";
//"mongodb+srv://wesam:wesam@mydatabasecluster.um6hyhw.mongodb.net/";
const GOOGLE_DRIVE_TOKEN = {
    "access_token": "ya29.a0AX9GBdUninbCg5t4RyhgvUCw3r3O3DMFVWanBI_d6GGsZamtNmNuR4HkK8_8oLxmkcG1gfAIr-SQrnRBwANKsteLW735UcHnxN_w-xqR_bHmYdbCcC0aj5JNrt3ua-oM7tx7lu6J86BlytxNVhVcmI5OPqmjaCgYKAVQSARESFQHUCsbCOvXFhiW-KIqOnJFWdyi3Mw0163",
    "refresh_token": "1//09p-iqZojSCm4CgYIARAAGAkSNwF-L9Ir5QBEVw1EqowG8Dm0lgx3_-4NaqUZUGD3h9a0K6jcaUP2Q2nDbIgn1zbAoPtv0KslwUY",
    "scope": "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file",
    "token_type": "Bearer",
    "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQzN2FhNTA0MzgxMjkzN2ZlNDM5NjBjYTNjZjBlMjI4NGI2ZmMzNGQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NzU3MjUxNDg5MzctMTYxM2Q0bjBxMGRyOWhndHJmaWJrcW8yc3M1MTVqNnYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NzU3MjUxNDg5MzctMTYxM2Q0bjBxMGRyOWhndHJmaWJrcW8yc3M1MTVqNnYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTY4NzM3MDUyOTcxMzQyODU4NzAiLCJhdF9oYXNoIjoiQWtFZzRuZnFlTGVSVklOeG4xVU9JQSIsIm5hbWUiOiJXZXNhbSBBbGVzc2EiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUVkRlRwNVVMUVFGV2ppTk5SYzVPY1Fsbm13X3lJYXFIZ3BGa25IcnZua0E0UT1zOTYtYyIsImdpdmVuX25hbWUiOiJXZXNhbSIsImZhbWlseV9uYW1lIjoiQWxlc3NhIiwibG9jYWxlIjoiYXIiLCJpYXQiOjE2NzQxMzc4MzksImV4cCI6MTY3NDE0MTQzOX0.Q1DwpwsD1QMbg24oCX1ut3Fxs-lBMtaSR1ex2nqqHXLKOWVEQveN0yWNSbvL46hqgdvLcFAsW1rfChEr0Vo1Gv5kDyAHy_h_t8IwWzTAHkH0XeushO5NpVJrooH4dn8neMpc7Wp_4Z_CFYYP-gOtwToulbzk7sYb-nf96NCJsqgenAz6tKB7ImZFEmj89y5HCsJsWKo11KlkLEL2mTww4j1oWufKaHuLykMpIcW8ph206E5pb0kWtnkqelvVrav8n6ULIkR356hSUjJZgw66PZ_wYzppzKEwXaNfdteHX6l9gnNXxt-IPjAnnkVwhQ8bWVtJVEayfdj09YKkp1WqIA",
    "expiry_date": 1674145055939
};
const FOLDER_ID = '1HrlhgRALxwmljWcI8xibd5e6EiivUdx7';
const DBNAME = "pet_house";
const CLIENT_ID = "475725148937-1613d4n0q0dr9hgtrfibkqo2ss515j6v.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URIS =  ["http://127.0.0.1:8000"];
const IMG_BUCKET = "photos";
const GOOGLE_DRIVE_IMAGE_URL = 'https://drive.google.com/uc?export=view&id=';
 
//cloadinary consts
const CLOUDINARY_NAME= 'defjcngkm';
const CLOUDINARY_API_KEY= '576442852179556';
const CLOUDINARY_API_SECRET= 'ig6rxmrsoh5KWJXWluF68AXVeCw';
const ONE_SIGNAL_CONFIG = {
    APP_ID:"c37cc05e-3b21-4ee6-90ed-d96d0d8ced7a",
    API_KEY:"YmIxNDQ4ZGMtNmI4OC00NzA5LTkyYTQtNTE5YjVlMTgxN2Vk",
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













// const PORT = 8000;
// const MONGODB_URI = "";
// const GOOGLE_DRIVE_TOKEN = {
//     "access_token": "",
//     "refresh_token": "",
//     "scope": "",
//     "token_type": "Bearer",
//     "id_token": "",
//     "expiry_date": 1674145055939
// };
// const FOLDER_ID = '';
// const DBNAME = "pet_house";
// const CLIENT_ID = "";
// const CLIENT_SECRET = "";
// const REDIRECT_URIS =  ["http://127.0.0.1:8000"];
// const IMG_BUCKET = "photos";
// const GOOGLE_DRIVE_IMAGE_URL = 'https://drive.google.com/uc?export=view&id=';

// //cloadinary consts
// const CLOUDINARY_NAME= '';
// const CLOUDINARY_API_KEY= '';
// const CLOUDINARY_API_SECRET= '';
// const ONE_SIGNAL_CONFIG = {
//     APP_ID:"",
//     API_KEY:"",
// };

// exports.PORT = PORT ;
// exports.MONGODB_URI = MONGODB_URI ;
// exports.GOOGLE_DRIVE_TOKEN = GOOGLE_DRIVE_TOKEN;
// exports.FOLDER_ID = FOLDER_ID;
// exports.DBNAME = DBNAME;
// exports.CLIENT_ID = CLIENT_ID;
// exports.CLIENT_SECRET = CLIENT_SECRET;
// exports.REDIRECT_URIS = REDIRECT_URIS;
// exports.IMG_BUCKET = IMG_BUCKET;
// exports.GOOGLE_DRIVE_IMAGE_URL = GOOGLE_DRIVE_IMAGE_URL;
// exports.CLOUDINARY_NAME = CLOUDINARY_NAME;
// exports.CLOUDINARY_API_KEY = CLOUDINARY_API_KEY;
// exports.CLOUDINARY_API_SECRET = CLOUDINARY_API_SECRET;
// exports.ONE_SIGNAL_CONFIG = ONE_SIGNAL_CONFIG;