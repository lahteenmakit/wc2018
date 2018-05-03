var apiUrl = 'http://localhost:3000/matches';

var request = new XMLHttpRequest();

request.open('GET', apiUrl, true);

request.onload = function () {
  var data = JSON.parse(this.response);
  data.forEach((match) => {
    console.log(match.location);
  });
}

request.send();
