const express = require('express')
const router = express.Router()
const mealPlanController = require('../controller/mealPlanController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/',mealPlanController.getMealPlan)
router.post('/',mealPlanController.saveMealPlan)

module.exports = router