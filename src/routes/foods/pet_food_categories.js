const express = require('express')
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const middlewareAuth = require("../../middleware/auth");
const pet_foods_controller = require('../../controllers/foods/pet_foods_category_controller')

router.get('/get_pet_foods_categories',middlewareAuth,pet_foods_controller.get_pet_foods_categories)

router.post('/add_pet_foods_category',middlewareAuth,uploads.single('file'),pet_foods_controller.add_pet_foods_category)

router.post('/update_pet_foods_category',middlewareAuth,uploads.single('file'),pet_foods_controller.update_pet_foods_category)

module.exports = router