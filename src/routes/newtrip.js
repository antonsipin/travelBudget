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
  .route('/addcategory')
  .post(newTripController.addCategory)

router
  .route('/category/castomize')
  .get(newTripController.renderCastomizeCategory)
  .post(newTripController.castomizeCategory)

router
  .route('/category/castomize/save')
  .get(newTripController.renderSavedCastomizeCategory)
  .post(newTripController.saveCastomizeCategory)

router
  .route('/report')
  .get(newTripController.renderTripReport)

router
  .route('/allTrips')
  .get(newTripController.allTrips)

router
  .route('/:id')
  .get(newTripController.findTripById)

router
  .route('/category/:id')
  .post(newTripController.findCategoryById)

router
  .route('/category/edit/:id')
  .post(newTripController.editCategoryEqually)

// router
//   .route('/category/edit/castomize/:id')
//   .post(newTripController.editCategoryCastomize)
  
module.exports = router
