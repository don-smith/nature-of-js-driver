var baseUrl = 'http://apidays-basie-7.c9.io/api/v1/';
var turns = 10;
var rangers = "abcdefghij".split('');
var wombats = ['gershwin', 'coltrane', 'thelonious', 'ellington', 'basie'];

$(function() {

  var turn = 0;
  seedArea(function () {
    nextRound(turn);
  });

});

function nextRound(turn) {
  if (turn < turns) {
    displayMap(null, function () {
      moveAll(function () {
        turn++;
        nextRound(turn);
      });
    });
  }
}

function moveAll(cb) {
  move(rangers, 0, function () {
    move(wombats, 0, function () {
      cb();
    });
  });
}

function move(mammals, i, cb) {
  if (i >= mammals.length) {
    cb();
  }

  $.put(baseUrl + 'rangers/' + mammals[i], {}, function () {
    move(mammals, i+1, 
  });
}

function displayMap(me, cb) {
  me = me || "";
  $.get(baseUrl + 'areamap/' + me, function (data) {
    $.each(data, function (key, val) {
      $('#map').append(key + ' ' + val + '\n');
    });
    cb();
  });
}

// Abandon all hope, ye who enter here
function seedArea(cb) {
  $.post(baseUrl + '/rangers', {name:"a"}, function () {
    $.post(baseUrl + '/rangers', {name:"b"}, function () {
      $.post(baseUrl + '/rangers', {name:"c"}, function () {
        $.post(baseUrl + '/rangers', {name:"d"}, function () {
          $.post(baseUrl + '/rangers', {name:"e"}, function () {
            $.post(baseUrl + '/rangers', {name:"f"}, function () {
              $.post(baseUrl + '/rangers', {name:"g"}, function () {
                $.post(baseUrl + '/rangers', {name:"h"}, function () {
                  $.post(baseUrl + '/rangers', {name:"i"}, function () {
                    $.post(baseUrl + '/rangers', {name:"j"}, function () {
                      $.post(baseUrl + '/wombats', {name:"gershwin"}, function () {
                        $.post(baseUrl + '/wombats', {name:"coltrane"}, function () {
                          $.post(baseUrl + '/wombats', {name:"thelonious"}, function () {
                            $.post(baseUrl + '/wombats', {name:"ellington"}, function () {
                              $.post(baseUrl + '/wombats', {name:"basie"}, function () {
                                cb();
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}
