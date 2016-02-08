'use strict';
/* global $ utilsModule */

var daysModule = (function(){

  var days = [],
      currentDay;

  // jQuery selections

  var $dayButtons, $dayTitle, $addButton, $removeButton;
  $(function(){
    $dayButtons = $('.day-buttons');
    $dayTitle = $('#day-title > span');
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // Day class and setup

  function Day () {
    this.hotel = null;
    this.restaurants = [];
    this.activities = [];
    this.number = days.push(this);
    this.buildButton().drawButton();
  }

  Day.prototype.buildButton = function() {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function(){
      this.blur(); // removes focus box from buttons
      self.switchTo();

    });
    return this;
  };

  Day.prototype.drawButton = function() {
    this.$button.appendTo($dayButtons);
    return this;
  };

  Day.prototype.hideButton = function() {
    this.$button.detach();
    return this;
  };

  // day switching

  Day.prototype.switchTo = function () {
    currentDay.hide();

    $.get('/days/' + this.number, function (data) {console.log('GET response data', data)})
  .fail( function (err) {console.error('err', err)} );

    currentDay = this;
    currentDay.draw();
  };

  Day.prototype.draw = function () {
    // day UI
    this.$button.addClass('current-day');
    $dayTitle.text('Day ' + this.number);
    // attractions UI
    function draw (attraction) { attraction.draw(); }
    if (this.hotel) draw(this.hotel);
    this.restaurants.forEach(draw);
    this.activities.forEach(draw);
  };

  Day.prototype.hide = function () {
    // day UI
    this.$button.removeClass('current-day');
    $dayTitle.text('Day not Loaded');
    // attractions UI
    function hide (attraction) { attraction.hide(); }
    if (this.hotel) hide(this.hotel);
    this.restaurants.forEach(hide);
    this.activities.forEach(hide);
  };

  // jQuery event binding

  $(function(){
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });

  function addDay () {
    if (this && this.blur) this.blur(); // removes focus box from buttons
    var newDay = new Day();
    if (days.length === 1) currentDay = newDay;
    newDay.switchTo();

    $.ajax({
      method: 'POST',
      url: '/days',
      data: { number: newDay.number,
              hotel: newDay.hotel._id,
              restaurants: newDay.restaurants.map(function(rest) {
                return rest._id
            }),
              activities: newDay.activities.map(function(act) {
                return act._id
              })
       },
      success: function (data) {console.log('POST response data', data)},
      error: function (err) {console.error('err', err)}
    })
  }

  function deleteCurrentDay () {
    if (days.length < 2 || !currentDay) return;
    var index = days.indexOf(currentDay),
      previousDay = days.splice(index, 1)[0],
      newCurrent = days[index] || days[index - 1];

      console.log('prev day', previousDay);
      days.forEach(function (day, idx) {
      day.number = idx + 1;
      day.$button.text(day.number);
    });
    // $.ajax({
    //     type: "DELETE",
    //     url: "/days",
    //     data: {number: 1},
    //     success: function(data) {console.log("DELETE response data: ", data)},
    //     error: function (err) {console.error('err', err)}
    //   });

    newCurrent.switchTo();
    previousDay.hideButton();
  }

  // globally accessible module methods

  var methods = {

    load: function(){
      $(addDay);
    },

    addAttraction: function(attraction){
      // adding to the day object
      switch (attraction.type) {
        case 'hotel':
          // if (currentDay.hotel) currentDay.hotel.removeFromDay();
          currentDay.hotel = attraction;
          console.log(attraction);
          $.ajax({
            type: "PUT",
            url: "/days/" + currentDay.number + "/hotel",
            data: {hotel: currentDay.hotel._id},
            success: function(data) {console.log("PUT response data: ", data)},
            error: function (err) {console.error('err', err)}
          });
          break;
        case 'restaurant':
          utilsModule.pushUnique(currentDay.restaurants, attraction);
          var restIdx = currentDay.restaurants.indexOf(attraction);
          $.ajax({
            type: "PUT",
            url: "/days/" + currentDay.number + "/restaurants",
            data: {restaurant: currentDay.restaurants[restIdx]._id},
            success: function(data) {console.log("PUT response data: ", data)},
            error: function (err) {console.error('err', err)}
          });
          break;
        case 'activity':
          utilsModule.pushUnique(currentDay.activities, attraction); 
          var actIdx = currentDay.activities.indexOf(attraction);
          $.ajax({
            type: "PUT",
            url: "/days/" + currentDay.number + "/activities",
            data: {activity: currentDay.activities[actIdx]._id},
            success: function(data) {console.log("PUT response data: ", data)},
            error: function (err) {console.error('err', err)}
          });
          break;
        default: console.error('bad type:', attraction);
      }
      // activating UI
      attraction.draw();
    },

    removeAttraction: function (attraction) {
      // removing from the day object
      switch (attraction.type) {
        case 'hotel':
          currentDay.hotel = null; break;
        case 'restaurant':
          utilsModule.remove(currentDay.restaurants, attraction); break;
        case 'activity':
          utilsModule.remove(currentDay.activities, attraction); break;
        default: console.error('bad type:', attraction);
      }
      // deactivating UI
      attraction.hide();
    }

  };

  return methods;

}());
