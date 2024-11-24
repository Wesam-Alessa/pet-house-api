const winston = require('winston');
require('winston-mongodb');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
     new winston.transports.File({ 
         filename: 'config/error.log',
          level: 'error',
          format: winston.format.combine(winston.format.timestamp(),winston.format.json())
        }),
        new winston.transports.MongoDB({ 
             level: 'error',
             //options:{useUnifiedTopology: true},
             db:'mongodb+srv://wesamalessa53:wesam@cluster0.pl844.mongodb.net/pet_house?retryWrites=true&w=majority'
             //"mongodb+srv://wesamalessa53:wesam@cluster0.pl844.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
            //  "mongodb+srv://wesam:wesam@mydatabasecluster.um6hyhw.mongodb.net/?retryWrites=true&w=majority"
            // "mongodb://localhost/pet_house"
             ,
           }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;