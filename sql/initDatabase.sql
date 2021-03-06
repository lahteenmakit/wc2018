CREATE TABLE users (
	user_id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(20) NOT NULL UNIQUE,
	email VARCHAR(50) NOT NULL UNIQUE,
	password BINARY(60) NOT NULL,
	points INT DEFAULT 0,
	quizDone INT DEFAULT 0,
	PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB;

CREATE TABLE leagues (
	league_id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(20) UNIQUE NOT NULL,
	password VARCHAR(20) NOT NULL,
	PRIMARY KEY(league_id)
);

CREATE TABLE users_leagues (
	user_id INT NOT NULL,
	league_id INT NOT NULL,
	CONSTRAINT PK_user PRIMARY KEY(user_id, league_id)
);

CREATE TABLE questionsAndAnswers_base (
	category VARCHAR(40),
	question VARCHAR(300),
	answer VARCHAR(20)
);

CREATE TABLE matches_base (
	matchNumber INT NOT NULL,
	stage VARCHAR(10),
	date VARCHAR(20),
	location VARCHAR(80),
	homeTeam VARCHAR(30),
	awayTeam VARCHAR(30),
	groupNumber VARCHAR(10),
	homeGoals INT,
	awayGoals INT,
	matchEnded INT
);

CREATE TABLE questionsAndAnswers (
	id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
	category VARCHAR(40),
	question VARCHAR(300),
	answer VARCHAR(20),
	points INT DEFAULT 0,
	pointsGiven INT DEFAULT 0,
	PRIMARY KEY(id)
);

CREATE TABLE matches (
	id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	matchNumber INT NOT NULL,
	stage VARCHAR(10),
	date VARCHAR(20),
	location VARCHAR(80),
	homeTeam VARCHAR(30),
	awayTeam VARCHAR(30),
	groupNumber VARCHAR(10),
	homeGoals INT DEFAULT 0,
	awayGoals INT DEFAULT 0,
	points INT DEFAULT 0,
	pointsGiven INT DEFAULT 0,
	PRIMARY KEY(id)
);

CREATE TABLE teams (
	id INT NOT NULL AUTO_INCREMENT,
	name varchar(25),
	PRIMARY KEY(id)
);

INSERT INTO matches_base (matchNumber, stage, date, location, homeTeam, awayTeam, groupNumber, homeGoals, awayGoals, matchEnded)
VALUES
(1,'group','14/06/2018 18:00','Luzhniki Stadium / Moscow','Russia','Saudi Arabia','Group A',0,0,0),
(2,'group','15/06/2018 15:00','Ekaterinburg Stadium','Egypt','Uruguay','Group A',0,0,0),
(3,'group','15/06/2018 18:00','Saint Petersburg Stadium','Morocco','Iran','Group B',0,0,0),
(4,'group','15/06/2018 21:00','Fisht Stadium / Sochi','Portugal','Spain','Group B',0,0,0),
(5,'group','16/06/2018 13:00','Kazan Arena','France','Australia','Group C',0,0,0),
(6,'group','16/06/2018 16:00','Otkrytiye Arena / Moscow','Argentina','Iceland','Group D',0,0,0),
(7,'group','16/06/2018 19:00','Saransk Stadium','Peru','Denmark','Group C',0,0,0),
(8,'group','16/06/2018 22:00','Kaliningrad Stadium','Croatia','Nigeria','Group D',0,0,0),
(9,'group','17/06/2018 15:00','Samara Stadium','Costa Rica','Serbia','Group E',0,0,0),
(10,'group','17/06/2018 18:00','Luzhniki Stadium / Moscow','Germany','Mexico','Group F',0,0,0),
(11,'group','17/06/2018 21:00','Rostov-on-Don Stadium','Brazil','Switzerland','Group E',0,0,0),
(12,'group','18/06/2018 15:00','Nizhny Novgorod Stadium','Sweden','Korea Republic','Group F',0,0,0),
(13,'group','18/06/2018 18:00','Fisht Stadium / Sochi','Belgium','Panama','Group G',0,0,0),
(14,'group','18/06/2018 21:00','Volgograd Stadium','Tunisia','England','Group G',0,0,0),
(15,'group','19/06/2018 15:00','Saransk Stadium','Colombia','Japan','Group H',0,0,0),
(16,'group','19/06/2018 18:00','Otkrytiye Arena / Moscow','Poland','Senegal','Group H',0,0,0),
(17,'group','19/06/2018 21:00','Saint Petersburg Stadium','Russia','Egypt','Group A',0,0,0),
(18,'group','20/06/2018 15:00','Luzhniki Stadium / Moscow','Portugal','Morocco','Group B',0,0,0),
(19,'group','20/06/2018 18:00','Rostov-on-Don Stadium','Uruguay','Saudi Arabia','Group A',0,0,0),
(20,'group','20/06/2018 21:00','Kazan Arena','Iran','Spain','Group B',0,0,0),
(21,'group','21/06/2018 15:00','Samara Stadium','Denmark','Australia','Group C',0,0,0),
(22,'group','21/06/2018 18:00','Ekaterinburg Stadium','France','Peru','Group C',0,0,0),
(23,'group','21/06/2018 21:00','Nizhny Novgorod Stadium','Argentina','Croatia','Group D',0,0,0),
(24,'group','22/06/2018 15:00','Saint Petersburg Stadium','Brazil','Costa Rica','Group E',0,0,0),
(25,'group','22/06/2018 18:00','Volgograd Stadium','Nigeria','Iceland','Group D',0,0,0),
(26,'group','22/06/2018 21:00','Kaliningrad Stadium','Serbia','Switzerland','Group E',0,0,0),
(27,'group','23/06/2018 15:00','Otkrytiye Arena / Moscow','Belgium','Tunisia','Group G',0,0,0),
(28,'group','23/06/2018 18:00','Rostov-on-Don Stadium','Korea Republic','Mexico','Group F',0,0,0),
(29,'group','23/06/2018 21:00','Fisht Stadium / Sochi','Germany','Sweden','Group F',0,0,0),
(30,'group','24/06/2018 15:00','Nizhny Novgorod Stadium','England','Panama','Group G',0,0,0),
(31,'group','24/06/2018 18:00','Ekaterinburg Stadium','Japan','Senegal','Group H',0,0,0),
(32,'group','24/06/2018 21:00','Kazan Arena','Poland','Colombia','Group H',0,0,0),
(33,'group','25/06/2018 17:00','Samara Stadium','Uruguay','Russia','Group A',0,0,0),
(34,'group','25/06/2018 17:00','Volgograd Stadium','Saudi Arabia','Egypt','Group A',0,0,0),
(35,'group','25/06/2018 21:00','Saransk Stadium','Iran','Portugal','Group B',0,0,0),
(36,'group','25/06/2018 21:00','Kaliningrad Stadium','Spain','Morocco','Group B',0,0,0),
(37,'group','26/06/2018 17:00','Luzhniki Stadium / Moscow','Denmark','France','Group C',0,0,0),
(38,'group','26/06/2018 17:00','Fisht Stadium / Sochi','Australia','Peru','Group C',0,0,0),
(39,'group','26/06/2018 21:00','Saint Petersburg Stadium','Nigeria','Argentina','Group D',0,0,0),
(40,'group','26/06/2018 21:00','Rostov-on-Don Stadium','Iceland','Croatia','Group D',0,0,0),
(41,'group','27/06/2018 17:00','Ekaterinburg Stadium','Mexico','Sweden','Group F',0,0,0),
(42,'group','27/06/2018 17:00','Kazan Arena','Korea Republic','Germany','Group F',0,0,0),
(43,'group','27/06/2018 21:00','Otkrytiye Arena / Moscow','Serbia','Brazil','Group E',0,0,0),
(44,'group','27/06/2018 21:00','Nizhny Novgorod Stadium','Switzerland','Costa Rica','Group E',0,0,0),
(45,'group','28/06/2018 17:00','Volgograd Stadium','Japan','Poland','Group H',0,0,0),
(46,'group','28/06/2018 17:00','Samara Stadium','Senegal','Colombia','Group H',0,0,0),
(47,'group','28/06/2018 21:00','Saransk Stadium','Panama','Tunisia','Group G',0,0,0),
(48,'group','28/06/2018 21:00','Kaliningrad Stadium','England','Belgium','Group G',0,0,0),
(49,'knockout','30/06/2018 21:00','Fisht Stadium / Sochi','Winner Group A','Runner-up Group B','',0,0,0),
(50,'knockout','30/06/2018 21:00','Kazan Arena','Winner Group C','Runner-up Group D','',0,0,0),
(51,'knockout','01/07/2018 17:00','Luzhniki Stadium / Moscow','Winner Group B','Runner-up Group A','',0,0,0),
(52,'knockout','01/07/2018 21:00','Nizhny Novgorod Stadium','Winner Group D','Runner-up Group C','',0,0,0),
(53,'knockout','02/07/2018 17:00','Samara Stadium','Winner Group E','Runner-up Group F','',0,0,0),
(54,'knockout','02/07/2018 21:00','Rostov-on-Don Stadium','Winner Group G','Runner-up Group H','',0,0,0),
(55,'knockout','03/07/2018 17:00','Saint Petersburg Stadium','Winner Group F','Runner-up Group E','',0,0,0),
(56,'knockout','03/07/2018 21:00','Otkrytiye Arena / Moscow','Winner Group H','Runner-up Group G','',0,0,0),
(57,'knockout','06/07/2018 17:00','Nizhny Novgorod Stadium','To be announced','To be announced','',0,0,0),
(58,'knockout','06/07/2018 21:00','Kazan Arena','To be announced','To be announced','',0,0,0),
(59,'knockout','07/07/2018 17:00','Samara Stadium','To be announced','To be announced','',0,0,0),
(60,'knockout','07/07/2018 21:00','Fisht Stadium / Sochi','To be announced','To be announced','',0,0,0),
(61,'knockout','10/07/2018 21:00','Saint Petersburg Stadium','To be announced','To be announced','',0,0,0),
(62,'knockout','11/07/2018 21:00','Luzhniki Stadium / Moscow','To be announced','To be announced','',0,0,0),
(63,'knockout','14/07/2018 17:00','Saint Petersburg Stadium','To be announced','To be announced','',0,0,0),
(64,'knockout','15/07/2018 18:00','Luzhniki Stadium / Moscow','To be announced','To be announced','',0,0,0);

INSERT INTO questionsAndAnswers_base (category, question, answer)
VALUES
('standings_champion', 'Champion', ''),
('standings_runnerUp', 'Runner-up', ''),
('standings_thirdPlace', '3rd place', ''),
('scorers_topScorer', 'Top Scorer', ''),
('extras_questions1', 'Total goals scored: Over or under 150,5 goals in Fifa world cup 2018 (including group and knockout stage, excluding penalty shootouts)?', ''),
('extras_questions2', 'Goals scored in a single match: Over or under 7,5 goals in at least one match (including group and knockout stage, excluding penalty shootouts)?', ''),
('extras_questions3', 'Own goals: Over or under 3,5 own goals (including group and knockout stage)?', ''),
('extras_questions4', 'Hat-tricks: Over or under 0,5 hat-tricks (including group and knockout stage, excluding penalty shootouts)?', ''),
('extras_questions5', 'Cristiano Ronaldo goals: Will he score over or under 2,5 goals in the group stage?', ''),
('extras_questions6', 'Yellow cards: Over or under 200,5 yellow cards (including group and knockout stage)?', ''),
('extras_questions7', 'Red cards: Over or under 12,5 red cards (including group and knockout stage)? ', ''),
('extras_questions8', 'Penalty kicks: Over or under 14,5 penalty kicks (including group and knockout stage, excluding penalty shootouts)?', ''),
('extras_questions9', 'Penalty kick success rate: Over or under 80,5 % of penalty kicks are successful (including group and knockout stage, excluding penalty shootouts)? The goals have to be scored directly from the spot kick to be counted. For example, goals after rebounds do not count. ', ''),
('extras_questions10', 'Penalty shootouts: In the knockout stage, will over or under 2,5 matches be decided in a penalty shooutout?', '');
