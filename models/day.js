var mongoose = require('mongoose');
var HotelSchema = require('./hotel').schema;
var RestaurantSchema = require('./restaurant').schema;
var ActivitySchema = require('./activity').schema;

var DaySchema = new mongoose.Schema({
  number: Number,
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }]
});

DaySchema.statics.findOrCreate = function (dayInfo) {
  var self = this;

  return this.findOne({ number: dayInfo.number })
    .then(function (day) {
      if (day === null) {
        return self.create(dayInfo);
      } else {
        return day;
      }
    });
};





module.exports = mongoose.model('Day', DaySchema);