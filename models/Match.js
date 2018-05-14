const db = require('../dbconnection');
const Queries = require('./Queries.js');

const Match = {
  getAllMatches: (callback) => {
    return db.query(Queries.getAllMatches, callback);
  },
  getGroupStageMatches: (callback) => {
    return db.query(Queries.getGroupStageMatches, callback);
  },
  setMatchResultForUser: (homeGoals, awayGoals, user_id, matchNumber, callback) => {
    var result = homeGoals + '-' + awayGoals;
    return db.query(Queries.setMatchResult, [homeGoals, awayGoals, user_id, matchNumber], callback);
  },
  insertMatchesForUsers: (user_id, callback) => {
    var matchesArray = [
      [user_id,1,'group','14/06/2018 18:00','Luzhniki Stadium / Moscow','Russia','Saudi Arabia','Group A',0,0,0],
      [user_id,2,'group','15/06/2018 15:00','Ekaterinburg Stadium','Egypt','Uruguay','Group A',0,0,0],
      [user_id,3,'group','15/06/2018 18:00','Saint Petersburg Stadium','Morocco','Iran','Group B',0,0,0],
      [user_id,4,'group','15/06/2018 21:00','Fisht Stadium / Sochi','Portugal','Spain','Group B',0,0,0],
      [user_id,5,'group','16/06/2018 13:00','Kazan Arena','France','Australia','Group C',0,0,0],
      [user_id,6,'group','16/06/2018 16:00','Otkrytiye Arena / Moscow','Argentina','Iceland','Group D',0,0,0],
      [user_id,7,'group','16/06/2018 19:00','Saransk Stadium','Peru','Denmark','Group C',0,0,0],
      [user_id,8,'group','16/06/2018 22:00','Kaliningrad Stadium','Croatia','Nigeria','Group D',0,0,0],
      [user_id,9,'group','17/06/2018 15:00','Samara Stadium','Costa Rica','Serbia','Group E',0,0,0],
      [user_id,10,'group','17/06/2018 18:00','Luzhniki Stadium / Moscow','Germany','Mexico','Group F',0,0,0],
      [user_id,11,'group','17/06/2018 21:00','Rostov-on-Don Stadium','Brazil','Switzerland','Group E',0,0,0],
      [user_id,12,'group','18/06/2018 15:00','Nizhny Novgorod Stadium','Sweden','Korea Republic','Group F',0,0,0],
      [user_id,13,'group','18/06/2018 18:00','Fisht Stadium / Sochi','Belgium','Panama','Group G',0,0,0],
      [user_id,14,'group','18/06/2018 21:00','Volgograd Stadium','Tunisia','England','Group G',0,0,0],
      [user_id,15,'group','19/06/2018 15:00','Saransk Stadium','Colombia','Japan','Group H',0,0,0],
      [user_id,16,'group','19/06/2018 18:00','Otkrytiye Arena / Moscow','Poland','Senegal','Group H',0,0,0],
      [user_id,17,'group','19/06/2018 21:00','Saint Petersburg Stadium','Russia','Egypt','Group A',0,0,0],
      [user_id,18,'group','20/06/2018 15:00','Luzhniki Stadium / Moscow','Portugal','Morocco','Group B',0,0,0],
      [user_id,19,'group','20/06/2018 18:00','Rostov-on-Don Stadium','Uruguay','Saudi Arabia','Group A',0,0,0],
      [user_id,20,'group','20/06/2018 21:00','Kazan Arena','Iran','Spain','Group B',0,0,0],
      [user_id,21,'group','21/06/2018 15:00','Samara Stadium','Denmark','Australia','Group C',0,0,0],
      [user_id,22,'group','21/06/2018 18:00','Ekaterinburg Stadium','France','Peru','Group C',0,0,0],
      [user_id,23,'group','21/06/2018 21:00','Nizhny Novgorod Stadium','Argentina','Croatia','Group D',0,0,0],
      [user_id,24,'group','22/06/2018 15:00','Saint Petersburg Stadium','Brazil','Costa Rica','Group E',0,0,0],
      [user_id,25,'group','22/06/2018 18:00','Volgograd Stadium','Nigeria','Iceland','Group D',0,0,0],
      [user_id,26,'group','22/06/2018 21:00','Kaliningrad Stadium','Serbia','Switzerland','Group E',0,0,0],
      [user_id,27,'group','23/06/2018 15:00','Otkrytiye Arena / Moscow','Belgium','Tunisia','Group G',0,0,0],
      [user_id,28,'group','23/06/2018 18:00','Rostov-on-Don Stadium','Korea Republic','Mexico','Group F',0,0,0],
      [user_id,29,'group','23/06/2018 21:00','Fisht Stadium / Sochi','Germany','Sweden','Group F',0,0,0],
      [user_id,30,'group','24/06/2018 15:00','Nizhny Novgorod Stadium','England','Panama','Group G',0,0,0],
      [user_id,31,'group','24/06/2018 18:00','Ekaterinburg Stadium','Japan','Senegal','Group H',0,0,0],
      [user_id,32,'group','24/06/2018 21:00','Kazan Arena','Poland','Colombia','Group H',0,0,0],
      [user_id,33,'group','25/06/2018 17:00','Samara Stadium','Uruguay','Russia','Group A',0,0,0],
      [user_id,34,'group','25/06/2018 17:00','Volgograd Stadium','Saudi Arabia','Egypt','Group A',0,0,0],
      [user_id,35,'group','25/06/2018 21:00','Saransk Stadium','Iran','Portugal','Group B',0,0,0],
      [user_id,36,'group','25/06/2018 21:00','Kaliningrad Stadium','Spain','Morocco','Group B',0,0,0],
      [user_id,37,'group','26/06/2018 17:00','Luzhniki Stadium / Moscow','Denmark','France','Group C',0,0,0],
      [user_id,38,'group','26/06/2018 17:00','Fisht Stadium / Sochi','Australia','Peru','Group C',0,0,0],
      [user_id,39,'group','26/06/2018 21:00','Saint Petersburg Stadium','Nigeria','Argentina','Group D',0,0,0],
      [user_id,40,'group','26/06/2018 21:00','Rostov-on-Don Stadium','Iceland','Croatia','Group D',0,0,0],
      [user_id,41,'group','27/06/2018 17:00','Ekaterinburg Stadium','Mexico','Sweden','Group F',0,0,0],
      [user_id,42,'group','27/06/2018 17:00','Kazan Arena','Korea Republic','Germany','Group F',0,0,0],
      [user_id,43,'group','27/06/2018 21:00','Otkrytiye Arena / Moscow','Serbia','Brazil','Group E',0,0,0],
      [user_id,44,'group','27/06/2018 21:00','Nizhny Novgorod Stadium','Switzerland','Costa Rica','Group E',0,0,0],
      [user_id,45,'group','28/06/2018 17:00','Volgograd Stadium','Japan','Poland','Group H',0,0,0],
      [user_id,46,'group','28/06/2018 17:00','Samara Stadium','Senegal','Colombia','Group H',0,0,0],
      [user_id,47,'group','28/06/2018 21:00','Saransk Stadium','Panama','Tunisia','Group G',0,0,0],
      [user_id,48,'group','28/06/2018 21:00','Kaliningrad Stadium','England','Belgium','Group G',0,0,0],
      [user_id,49,'knockout','30/06/2018 21:00','Fisht Stadium / Sochi','Winner Group A','Runner-up Group B','',0,0,0],
      [user_id,50,'knockout','30/06/2018 21:00','Kazan Arena','Winner Group C','Runner-up Group D','',0,0,0],
      [user_id,51,'knockout','01/07/2018 17:00','Luzhniki Stadium / Moscow','Winner Group B','Runner-up Group A','',0,0,0],
      [user_id,52,'knockout','01/07/2018 21:00','Nizhny Novgorod Stadium','Winner Group D','Runner-up Group C','',0,0,0],
      [user_id,53,'knockout','02/07/2018 17:00','Samara Stadium','Winner Group E','Runner-up Group F','',0,0,0],
      [user_id,54,'knockout','02/07/2018 21:00','Rostov-on-Don Stadium','Winner Group G','Runner-up Group H','',0,0,0],
      [user_id,55,'knockout','03/07/2018 17:00','Saint Petersburg Stadium','Winner Group F','Runner-up Group E','',0,0,0],
      [user_id,56,'knockout','03/07/2018 21:00','Otkrytiye Arena / Moscow','Winner Group H','Runner-up Group G','',0,0,0],
      [user_id,57,'knockout','06/07/2018 17:00','Nizhny Novgorod Stadium','To be announced','To be announced','',0,0,0],
      [user_id,58,'knockout','06/07/2018 21:00','Kazan Arena','To be announced','To be announced','',0,0,0],
      [user_id,59,'knockout','07/07/2018 17:00','Samara Stadium','To be announced','To be announced','',0,0,0],
      [user_id,60,'knockout','07/07/2018 21:00','Fisht Stadium / Sochi','To be announced','To be announced','',0,0,0],
      [user_id,61,'knockout','10/07/2018 21:00','Saint Petersburg Stadium','To be announced','To be announced','',0,0,0],
      [user_id,62,'knockout','11/07/2018 21:00','Luzhniki Stadium / Moscow','To be announced','To be announced','',0,0,0],
      [user_id,63,'knockout','14/07/2018 17:00','Saint Petersburg Stadium','To be announced','To be announced','',0,0,0],
      [user_id,64,'knockout','15/07/2018 18:00','Luzhniki Stadium / Moscow','To be announced','To be announced','',0,0,0],
    ];
    return db.query(Queries.insertMatchesForUsers, [matchesArray], callback);
  }
};

module.exports = Match;
