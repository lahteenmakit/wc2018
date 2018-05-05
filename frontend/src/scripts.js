const jquery = require('jquery');
const moment = require('moment');


const apiUrl = 'http://localhost:3000/matches';


$(document).ready(() => {
  $.get(apiUrl, (data, status) => {
    var dateAsTableHeader = '';
    $.each(data, (index, value) => {
      var date = moment(value.date, 'DD/MM/YYYY HH:mm').format('dddd D MMMM');
      if(date != dateAsTableHeader) {
        dateAsTableHeader = date;
        $('#matchesTableDiv').append("<table id='newDateTableHeader' class='ui single line table'>" +
                                     "<thead><tr>" +
                                            "<th>" + dateAsTableHeader + "</th>" +
                                            "<th></th>" +
                                            "<th></th>" +
                                            "<th></th>" +
                                     "</tr></thead>" +
                                        "<tbody>" +
                                          "<tr><td>" + value.date         + "<br>" +
                                                       value.groupNumber  + "<br>" +
                                                       value.location     + "</td>" +
                                              "<td>" + value.homeTeam     + "</td>" +
                                              "<td>" + value.awayTeam     + "</td>" +
                                              "<td>" + value.result       + "</td></tr>" +
                                        "</tbody>" +
                                     "</table>");
      }


      /*$('#matchesTable').append('<tr><td>' + value.date + '<br>' +
                                             value.groupNumber + '<br>' +
                                             value.location + '</td>' +
                                    '<td>' + value.homeTeam + '</td>' +
                                    '<td>' + value.awayTeam + '</td>' +
                                    '<td>' + value.result + '</td></tr>');*/
    });
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
