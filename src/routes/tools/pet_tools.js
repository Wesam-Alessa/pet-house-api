const express = require('express')
const router = express.Router();
const middlewareAuth = require("../../middleware/auth");
const petToolsController = require('../../controllers/tools/pet_tools_controller')


router.post('/add-new-pet-tool',middlewareAuth,petToolsController.addPetTool )
router.get('/get-pet-tools/:category',middlewareAuth,petToolsController.getPetTools )
router.get('/get-pet-tool-by-id/:id',petToolsController.getPetToolById )
router.get('/search-pet-tool/:text',middlewareAuth,petToolsController.searchPetTool )
router.delete('/remove-pet-tool',middlewareAuth,petToolsController.removePetTool )
router.post('/create-report-item',middlewareAuth,petToolsController.createReportTool)
router.get('/get-tools-reported',middlewareAuth,petToolsController.getReportedTools)
router.delete('/remove-tool-reports',middlewareAuth,petToolsController.removeToolReports)
router.get('/get-waiting-tools',middlewareAuth,petToolsController.getWaitingTools)
router.get('/publishing-waiting-tools',middlewareAuth,petToolsController.publishingWaitingTools)
router.get('/get-search-item/:text',petToolsController.searchPetTool)
module.exports = router