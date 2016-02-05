var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

router.get('/days', function(req, res, next) {
  Day.find({})
  .then(function (days) {
    res.json(days);
  })
  .then(null, next);
})

module.exports = router;