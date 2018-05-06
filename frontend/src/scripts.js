const jquery = require('jquery');
const moment = require('moment');


const apiUrl = 'http://localhost:3000/matches';


$(document).ready(() => {
  $.get(apiUrl, (data, status) => {
    var dateAsTableHeader = '';
    $.each(data, (index, match) => {
      var date = moment(match.date, 'DD/MM/YYYY HH:mm').format('dddd D MMMM');
      if(date != dateAsTableHeader) {
        dateAsTableHeader = date;
        $('#matchesTableDiv').append("<table class='ui single line table'>" +
                                     "<thead><tr>" +
                                            "<th>" + dateAsTableHeader + "</th>" +
                                            "<th></th>" +
                                            "<th></th>" +
                                            "<th></th>" +
                                     "</tr></thead>" +
                                        "<tbody id=" + dateAsTableHeader.replace(/ /g, '-') + ">" +
                                          "<tr><td>" + match.date         + "<br>" +
                                                       match.groupNumber  + "<br>" +
                                                       match.location     + "</td>" +
                                              "<td align='left'>" + match.homeTeam     + "</td>" +
                                              "<td align='left'>" + match.awayTeam     + "</td>" +
                                              "<td>" +
                                                "<div id=divMatchId-" + match.matchId + "-homeGoals" + " class='ui input focus'> " +
                                                    "<input type='number' min='0' placeholder='Home Goals'>" +
                                                "</div>" + " - " +
                                                "<div id=divMatchId-" + match.matchId + "-awayGoals" + " class='ui input focus'> " +
                                                    "<input type='number' min='0' placeholder='Away Goals'>" +
                                                "</div>" +
                                              "</td></tr>" +
                                        "</tbody>" +
                                     "</table>");
      }
      else {
        $('#' + dateAsTableHeader.replace(/ /g, '-')).append("<tr><td>" + match.date         + "<br>" +
                                                       match.groupNumber  + "<br>" +
                                                       match.location     + "</td>" +
                                               "<td align='left'>" + match.homeTeam     + "</td>" +
                                               "<td align='left'>" + match.awayTeam     + "</td>" +
                                               "<td>" +
                                                 "<div id=divMatchId-" + match.matchId + "-homeGoals" + " class='ui input focus'> " +
                                                     "<input type='number' min='0' placeholder='Home Goals'>" +
                                                 "</div>" + " - " +
                                                 "<div id=divMatchId-" + match.matchId + "-awayGoals" + " class='ui input focus'> " +
                                                     "<input type='number' min='0' placeholder='Away Goals'>" +
                                                 "</div>" +
                                               "</td></tr>");
      }
    });
  });
});
