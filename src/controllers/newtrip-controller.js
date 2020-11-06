const Trip = require('../models/trip-model')
const Category = require('../models/category-model')
const mongoose = require('mongoose')
const fetch = require('node-fetch');
const GoogleChartsNode = require('google-charts-node');
var request = require('request');

var unirest = require("unirest");







const renderTripReport = (req, res) => {
  res.render('summary')
}

const allTrips = async (req, res) => {
  const allTrips = await Trip.find();
  res.render('allTrips', {allTrips})
}

const findCategoryById = async (req, res) => {
  let tripName = req.body.tripName
  // let categoryName = req.body.categoryName
  let category = await Category.findById(req.params.id);
  let categoryName = category.name;

  res.render('editCategory', {tripName, categoryName, category})
}

const editCategoryEqually = async (req, res) => {
  let tripId = req.body.tripId
  let category = await Category.findById(req.params.id);
  let newTrip = await Trip.findById(tripId);
  
  // let tripName = category.trip;

  let { name, cost, users } = req.body.category;

  category.name = name ;
  category.cost = cost ;
  
  let userString = users.join();
  console.log('userString  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', userString);

  let newusers = userString.split(',');
  users = newusers;

  console.log('newusers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', newusers);

  let payerCost = Math.round(cost / users.length)
  let payerCostArr = []
  for (let i = 0; i < users.length; i++) {
    payerCostArr.push({ name: users[i], cost: payerCost })
  }

  if (name && cost && users) {
    try {

  category.users = payerCostArr;

      let categoryName = name;
      let payers = users;
      let newCategory = category;

      await category.save();

      res.render('equally', { categoryName, payers, payerCost/* , tripName  */, newCategory })

    } catch (e) {
      console.log(e);
      res.render('createcategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('createcategory', {error: 'Not all fields are filled!'})
}
}

const findTripById = async (req, res) => {
  let trip = await Trip.findById(req.params.id);
  let allCategories = await Category.find({ trip: trip.name });

  let users = []
  for (let i = 0; i < allCategories.length; i++) {
    users.push(allCategories[i].users)
  }

  let names = []
  let usersArr = users.flat()


  for (let i = 0; i < usersArr.length; i++) {
    names.push(usersArr[i].name)
  }
  
  resultNames = [...new Set(names)]
  
  let userSpent = 0;
  let resulCostArr = [];

  for (let i = 0; i < resultNames.length; i++) {
    for (let j = 0; j < usersArr.length; j++) {
      if (usersArr[j].name === resultNames[i]) {
        userSpent += Number(usersArr[j].cost)
      }
    }
    resulCostArr.push({ name: resultNames[i], cost: userSpent })
    userSpent = 0;
  }

  let maxSum = 0;
  for (let i = 0; i < resulCostArr.length; i++) {
    maxSum += resulCostArr[i].cost
  }
  let maxSumObj = { name: 'All ', cost: maxSum }
  resulCostArr.push(maxSumObj)
  
  console.log('maxSumObj.cost >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', maxSumObj.cost);
  console.log('resulCostArr >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', resulCostArr);




  console.log('resultNames >>>>>>>>>>>>>>', resultNames);
  
  let result = ''
  for (let i = 0; i < resultNames.length; i++) {
     result += `'${resultNames[i]}',`
  }
  console.log('result >>>>>>>>>>>>>>', result);

  let sum = 0
  let resultCost = []
  for (let i = 0; i < resulCostArr.length - 1; i++) {
    resultCost[i] = resulCostArr[i].cost
    sum += resulCostArr[i].cost
  }

  console.log('resultCost >>>>>>>>>>>>>>>>>', resultCost);

  let src = `https://quickchart.io/chart?c={type:'pie',data:{labels:[${result}], datasets:[{data:[${resultCost}]}]}}`
  
  let src2 = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${result}],datasets:[{data:[${resultCost}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${sum}',font:{size:20}},{text:'total'}]}}}}`

  let qrSrc = `https://quickchart.io/qr?text=mail.ru`
 
    
  console.log('src >>>>>>>>>>>',src);

  res.render('summary', { trip, allCategories, resultNames, resulCostArr, maxSumObj, src, src2, qrSrc} );
}

const renderNewtrip = (req, res) => {
  res.render('newtrip')
}

const createNewTrip = async (req, res) => {
  let tripName = req.body.newTripName;
  let tripUsers = req.body.tripUsers;
  console.log('tripUsers>>>>>>>>>>>>', tripUsers);
  let tripUsersResult = tripUsers.split(',')
  let newTrip

  if (tripName && tripUsers) {
    try {

          newTrip = new Trip({
          name: tripName,
          users: tripUsersResult
        })

      await newTrip.save()
      // res.redirect('/newtrip/category', {tripName})
      res.render('createcategory', { tripName, tripUsersResult, newTrip })

    } catch (e) {
      console.log(e);
      res.render('newtrip', { error: 'This trip already exist or incorrect data!', tripName, tripUsersResult, newTrip  })
    }
  } else {
    res.render('newtrip', {error: 'Not all fields are filled!', tripName, tripUsersResult, newTrip})
} 
}

const renderCreateCategory = (req, res) => {
  let tripName = req.body.tripName;
  res.render('createcategory', { tripName })
}

const addCategory = async (req, res) => {
  let tripId = req.body.tripId;
  let newTrip = await Trip.findById(tripId)
  res.render('createcategory', { newTrip  })
}

const createNewCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName;
  let cost = req.body.fullCost;
  let tripId = req.body.tripId;
  console.log('tripId**********************', tripId);
  let newTrip = await Trip.findById(tripId)
  let payers = newTrip.users
  let tripCategories = newTrip.categories
  let newCategory

  console.log('trip **********************', newTrip);

  // if (req.body.payers) {
  //   payers = req.body.payers.split(',');
  // }
  console.log('payers **********************', payers);
  console.log('cost **********************', cost);

  let tripName = newTrip.name
  // let payerCost = Math.floor((cost / payers.length) * 100) / 100
  let payerCost = Math.round(cost / payers.length)
  let payerCostArr = []
  for (let i = 0; i < payers.length; i++) {
    payerCostArr.push({ name: payers[i], cost: payerCost })
  }

  if (categoryName && cost && payers) {
    try {

        newCategory = new Category({
        name: categoryName,
        cost,
        users: payerCostArr,
        trip: tripName
      })
      
      tripCategories.push(newCategory)
      newTrip.categories = tripCategories

      await newCategory.save()
      await newTrip.save()

      console.log('newCategory.id >>>>>>>>>>>>>>>', newCategory.id);
      
      res.render('equally', { categoryName, payers, payerCost, tripName , newCategory, newTrip})

    } catch (e) {
      console.log(e);
      res.render('createcategory', { error: 'This category already exist or incorrect data!', categoryName, payers, payerCost, tripName , newCategory, newTrip })
    }
  } else {
    res.render('createcategory', {error: 'Not all fields are filled!', categoryName, payers, payerCost, tripName , newCategory, newTrip})
}
}

const renderCastomizeCategory = (req, res) => {
  let name = req.body.newCategoryName;
  res.render('castomizeCategory', {name})
}

const castomizeCategory = async (req, res) => {
  let categoryName = req.body.newCategoryName;
  let tripName = req.body.tripName
  let fullCost = req.body.fullCost;
  let payers = req.body.payers.split(',');
  res.locals.payers = payers

console.log('tripName castomizeCategory >>>>>>>>>>>>', tripName);

  if (categoryName && fullCost && payers) {
    try {
      
      res.render('castomizeCategory', { categoryName, payers, fullCost, tripName })

    } catch (e) {
      console.log(e);
      res.render('castomizeCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('castomizeCategory', {error: 'Not all fields are filled!'})
}
}

const renderSavedCastomizeCategory = async (req, res) => {
  let categoryName = req.body.categoryName;
  let castomCost = req.body.castomizeCategoryCost;
  let payers = req.body.payer;
  let tripName = req.body.tripName
  res.render('savedCastomizeCategory', {categoryName, castomCost, payers, tripName})
}

const saveCastomizeCategory = async (req, res) => {
  let categoryName = req.body.categoryName;
  let castomCost = req.body.castomizeCategoryCost;
  let payers = req.body.payer;
  let fullCost = req.body.fullCost;
  let tripName = req.body.tripName

  let castomCostArr = [];

  for (let i = 0; i < payers.length; i++) {
    castomCostArr.push({ name: payers[i], cost: castomCost[i] })
  }
  
  if (castomCost) {
    try {
      const newCategory = new Category({
        name: categoryName,
        cost: fullCost,
        users: castomCostArr,
        trip: tripName
      })

      await newCategory.save()
      res.render('savedCastomizeCategory', {categoryName, castomCostArr, payers, tripName})
      
    } catch (e) {
      console.log(e);
      res.render('savedCastomizeCategory', { error: 'Incorrect data!' })
    }
  } else {
    res.render('savedCastomizeCategory', {error: 'Not all fields are filled!'})
}
}

module.exports = {
  renderNewtrip,
  renderCreateCategory,
  createNewTrip,
  createNewCategory,
  renderCastomizeCategory,
  castomizeCategory,
  renderSavedCastomizeCategory,
  saveCastomizeCategory,
  renderTripReport,
  allTrips,
  findTripById,
  addCategory,
  findCategoryById,
  editCategoryEqually,
  // editCategoryCastomize
}
