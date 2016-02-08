var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

//get all days
router.get('/', function(req, res, next) {
  Day.find().populate('hotel restaurants activities')
  .then(function (days) {
    res.json(days);
  })
  .then(null, next);
})

//get one day by its number
router.get('/:number', function(req, res, next) {
  Day.findOne({number: req.params.number}).populate('hotel restaurants activities')
  .then(function (day) {
    res.json(day);
  })
  .then(null, next)
})

//delete a day
//use put or delete to delete
router.delete('/', function (req, res, next) {
  Day.findOne({number: req.body.number})
  .then(function (day) {
    day.remove();
  })
  // .then(function (day) {
  //   res.redirect('/');
  // })
  .then(null, next)
})

//make new day
router.post('/', function (req, res, next) {
  Day.findOrCreate({
    number: req.body.number,
    hotel: req.body.hotel,
    restaurants: req.body.restaurants,
    activities: req.body.activities
  })
  // .then(function(day) {
  //   res.redirect('/');
  // })
  .then(null, next);
})

// adding attractions
router.put('/:number/hotel', function (req, res, next) {
  console.log("req.body: ", req.body);
  var hotel = req.body.hotel;
  Day.findOne({number: req.params.number})
  .then(function (day) {
    day.hotel = hotel;
    return day.save();
  })
  // .then(function (day) {
  //   res.redirect('/');
  // })
  .then(null, next);
})

router.put('/:number/restaurants', function (req, res, next) {
  console.log("restaurant obj: ", req.body.restaurant);
  var restaurant = req.body.restaurant;
  Day.findOne({number: req.params.number})
  .then(function (day) {
    day.restaurants.push(restaurant);
    return day.save();
  })
  // .then(function (day) {
  //   res.redirect('/');
  // })
  .then(null, next);
})

router.put('/:number/activities', function (req, res, next) {
  var activity = req.body.activity;
  console.log('req.body: ', req.body);
  Day.findOne({number: req.params.number})
  .then(function (day) {
    day.activities.push(activity);
    return day.save();
  })
  // .then(function (day) {
  //   res.redirect('/');
  // })
  .then(null, next);
})

// removing attractions
router.delete('/:number/hotel', function (req, res, next) {
  Day.findOne({number: req.params.number})
  .then(function (day) {
    day.hotel = "";
    return day.save();
  })
  // .then(function (day) {
  //   res.redirect('/');
  // })
  .then(null, next);
})

router.delete('/:number/restaurants', function (req, res, next) {
  var restaurant = req.body.restaurants;
  Day.findOne({number: req.params.number})
  .then(function (day) {
    var restIdx = day.restaurants.indexOf(restaurant);
    day.restaurants.slice(restIdx, 1);
    return day.save();
  })
  // .then(function (day) {
  //   res.redirect('/');
  // })
  .then(null, next);
})

router.delete('/:number/activities', function (req, res, next) {
  var activity = req.body.activities;
  Day.findOne({number: req.params.number})
  .then(function (day) {
    var actIdx = day.activities.indexOf(activity);
    day.activities.slice(actIdx, 1);
    return day.save();
  })
  // .then(function (day) {
  //   res.redirect('/');
  // })
  .then(null, next);
})

module.exports = router;









