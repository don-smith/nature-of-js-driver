import $ from 'jquery';

const baseUrl = 'http://localhost:5000/api/v1';
let viewTurn = 0;
let maxTurn = 0;
const rangers = "abcdefghij".split('');
const wombats = ['gershwin', 'coltrane', 'thelonious', 'ellington', 'basie'];

$(function() {

  window.setInterval(updateDisplay, 2000);
  seedArea().catch(showError);
  $('#forward').click(next);
  $('#back').click(prev);
  $('#reset').click(reset);
  $('#repopulate').click(seedArea);

});

function reset() {
  let requests = [];

  for (let i = 0; i < rangers.length; i++) {
    requests.push(Promise.resolve(
      $.ajax({
        url: `${baseUrl}/rangers/${rangers[i]}`,
        type: 'DELETE'
      })
    ));
  }
  for (let i = 0; i < wombats.length; i++) {
    requests.push(Promise.resolve(
      $.ajax({
        url: `${baseUrl}/wombats/${wombats[i]}`,
        type: 'DELETE'
      })
    ));
  }

  requests.push(Promise.resolve(
    $.ajax({
      url: `${baseUrl}/reset`,
      type: 'GET'
    })
  ));

  viewTurn = 0;
  maxTurn = 0;
  return Promise.all(requests);
}

function seedArea() {
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

function updateDisplay() {
  return Promise.resolve(
    $.ajax({
      url: `${baseUrl}/areamap?turn=${viewTurn}`,
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

function next() {
  if (viewTurn < maxTurn) {
    viewTurn++;
    return;
  }

  let requests = [];

  $.ajax({
    url: `${baseUrl}/rangers`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      for (let i = 0; i < data.length; i++) {
        let move = constructMove(data[i]);
        requests.push(Promise.resolve(
          $.ajax({
            url: `${baseUrl}/rangers/${data[i].name}`,
            type: 'PUT',
            data: JSON.stringify(move),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
          })
        ));
      }
    }
  });

  $.ajax({
    url: `${baseUrl}/wombats`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      for (let i = 0; i < data.length; i++) {
        let move = constructMove(data[i]);
        requests.push(Promise.resolve(
          $.ajax({
            url: `${baseUrl}/wombats/${data[i].name}`,
            type: 'PUT',
            data: JSON.stringify(move),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
          })
        ));
      }
      maxTurn++;
      viewTurn++;
    }
  });

  return Promise.all(requests);
}

function prev() {
  viewTurn = (viewTurn > 0) ? viewTurn - 1 : 0;
}

function constructMove(mammal) {
  let move = {
    name: mammal.name
  };
  let xLowLimit = mammal.x -1 < 0 ? 0 : mammal.x - 1;
  let xHighLimit = mammal.x + 1 > 19 ? 19 : mammal.x + 1;
  move.x = Math.floor(Math.random() * (xHighLimit - xLowLimit + 1)) + xLowLimit;
  let yLowLimit = mammal.y -1 < 0 ? 0 : mammal.y - 1;
  let yHighLimit = mammal.y + 1 > 19 ? 19 : mammal.y + 1;
  move.y = Math.floor(Math.random() * (yHighLimit - yLowLimit + 1)) + yLowLimit;
  return move;
}
