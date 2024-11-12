const express = require('express')
const router = express.Router();
const middlewareAuth = require("../../middleware/auth");
const pet_Food_Controller = require('../../controllers/foods/pet_foods_controller')


router.post('/add-new-pet-food',middlewareAuth,pet_Food_Controller.addPetFood )
router.get('/get-pet-foods',middlewareAuth,pet_Food_Controller.getPetFoods )
router.get('/get-pet-food-by-id/:id',pet_Food_Controller.getPetFoodById )
router.get('/search-pet-food/:text',middlewareAuth,pet_Food_Controller.searchPetFood )
router.delete('/remove-pet-food',middlewareAuth,pet_Food_Controller.removePetFood )
router.post('/create-report-item',middlewareAuth,pet_Food_Controller.createReportFood)
router.get('/get-foods-reported',middlewareAuth,pet_Food_Controller.getReportedFoods)
router.delete('/remove-food-reports',middlewareAuth,pet_Food_Controller.removeFoodReports)
router.get('/get-waiting-foods',middlewareAuth,pet_Food_Controller.getWaitingFoods)
router.get('/publishing-waiting-foods',middlewareAuth,pet_Food_Controller.publishingWaitingFoods)
module.exports = router