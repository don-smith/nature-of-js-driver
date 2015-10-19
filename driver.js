import $ from 'jquery';

var baseUrl = 'http://natureofjs.org/api/v1';
var turns = 10;
var rangers = "abcdefghij".split('');
var wombats = ['gershwin', 'coltrane', 'thelonious', 'ellington', 'basie'];

$(function() {

  var turn = 0;
  //seedArea().then(updateDisplay()).catch(showError);
  window.setInterval(updateDisplay, 5000);

});

function seedArea(cb) {
  let requests = [];

  for (let i = 0; i < rangers.length; i++) {
    requests.push(Promise.resolve(
      $.ajax({
        url: `${baseUrl}/rangers`,
        type: 'POST',
        data: JSON.stringify({name: rangers[i]}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      })
    ));
  }
  for (let i = 0; i < wombats.length; i++) {
    requests.push(Promise.resolve(
      $.ajax({
        url: `${baseUrl}/wombats`,
        type: 'POST',
        data: JSON.stringify({name: wombats[i]}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      })
    ));
  }

  return Promise.all(requests);
}

function showError(err) {
  $('#error').html(JSON.stringify(err));
}

function updateDisplay(me = "") {
  return Promise.resolve(
    $.ajax({
      url: `${baseUrl}/areamap/${me}`,
      type: 'GET',
      cache: false
    }).then(data => {
      $('#map').empty();
      $.each(data, (key, val) => {
        $('#map').append(key + ' ' + val + '\n');
      });
    })
  );
}

