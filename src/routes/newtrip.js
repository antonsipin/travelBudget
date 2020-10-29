const express = require('express');
const router = express.Router();
const newTripController = require('../controllers/newtrip-controller')

router
  .route('/')
  .get(newTripController.renderNewtrip)
  .post(newTripController.createNewTrip)

router
  .route('/category')
  .get(newTripController.renderCreateCategory)
  .post(newTripController.createNewCategory)

router
  .route('/category/castomize')
  .get(newTripController.renderCastomizeCategory)
  .post(newTripController.castomizeCategory)

router
  .route('/category/castomize/save')
  .get(newTripController.renderSavedCastomizeCategory)
  .post(newTripController.saveCastomizeCategory)
  
module.exports = router
