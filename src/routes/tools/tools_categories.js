const express = require('express')
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const middlewareAuth = require("../../middleware/auth");
const tools_controller = require('../../controllers/tools/toolsCategories/tools_categories_controller')

router.get('/get_tools_categories',middlewareAuth,tools_controller.get_tools_categories)

router.post('/add_tools_category',middlewareAuth,uploads.single('file'),tools_controller.add_tools_category)

router.post('/update_tools_category',middlewareAuth,uploads.single('file'),tools_controller.update_tools_category)

module.exports = router