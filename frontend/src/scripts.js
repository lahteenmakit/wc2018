const jquery = require('jquery');
const moment = require('moment');
const standings = require('./finalStandings');

const apiUrl = 'http://localhost:3000/matches';

$(document).ready(function() {
  $(':button#matchesResultSubmitButton').click(function() {
    getUserInputForMatchResults()
    //UNCOMMENT + remove getUserInputForMatchResults() from above
    //if(getUserInputForMatchResults())
      //window.location.replace('/standings');
  });
  displayMatchesTable();
  displayTeams();
});

function displayTeams() {
  const teamsApi = 'http://localhost:3000/teams';
  $.get(teamsApi, (data, status) => {
    var htmlDataList = "<select class='ui dropdown'>"
    htmlDataList += "<option value=''>-</option>"
    data.sort((a,b) => {
      if (a.homeTeam < b.homeTeam)
        return -1;
      if (a.homeTeam > b.homeTeam)
        return 1;
      return 0;
    });
    data.forEach((element) => {
      htmlDataList += "<option value='" + element.homeTeam + "'>" + element.homeTeam + "</option>"
    });
    htmlDataList += "</select>"
    $('#championDiv').append(htmlDataList);
    $('#runnerupDiv').append(htmlDataList);
    $('#3rdplaceDiv').append(htmlDataList);
  });
}

function getUserInputForMatchResults() {
  var results = [];

  $("[id*='divMatchId']").each((index) => {
    var matchResult = {};
    matchResult['matchId'] = index;
    matchResult['homeGoals'] = $('#divMatchId-' + index + '-homeGoals' + ' :input').val();
    matchResult['awayGoals'] = $('#divMatchId-' + index + '-awayGoals' + ' :input').val();

    //UNCOMMENT
    /*if(matchResult['homeGoals'] == '' || matchResult['awayGoals'] == '') {
      alert('Missing scores in one or more matches! Fill in the blanks and click submit again.');
      return null;
    } */
    results.push(matchResult);
  });

  const addResultsApi = 'http://localhost:3000/addResult';
  $.ajax({
    type: 'PUT',
    url: addResultsApi,
    data: JSON.stringify(results),
    contentType: 'application/json'
  });
  return 1;
}

function displayMatchesTable() {
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
}
