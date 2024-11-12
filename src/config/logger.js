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
             options:{useUnifiedTopology: true},
             db:
             "mongodb+srv://wesam:wesam@mydatabasecluster.um6hyhw.mongodb.net/?retryWrites=true&w=majority"
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