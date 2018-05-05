const jquery = require('jquery');
const moment = require('moment');


const apiUrl = 'http://localhost:3000/matches';


$(document).ready(() => {
  console.log(moment().format('YYYY-MM-DD'));
  $.get(apiUrl, (data, status) => {
    $('#matchesTable').append('<tbody>')
    $.each(data, (index, value) => {
      

      $('#matchesTable').append('<tr><td>' + value.date + '<br>' +
                                             value.groupNumber + '<br>' +
                                             value.location + '</td>' +
                                    '<td>' + value.homeTeam + '</td>' +
                                    '<td>' + value.awayTeam + '</td>' +
                                    '<td>' + value.result + '</td></tr>');
    });
    $('#matchesTable').append('</tbody>')
  });
});


/*var request = new XMLHttpRequest();

request.open('GET', apiUrl, true);

request.onload = function () {
  var data = JSON.parse(this.response);
  data.forEach((match) => {
    console.log(match.location);
  });
}

request.send();*/
