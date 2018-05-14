CREATE TABLE users (
	user_id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(20) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password BINARY(60) NOT NULL,
	PRIMARY KEY(user_id)
);

CREATE TABLE questionsAndAnswers (
	id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
	category VARCHAR(40),
	question VARCHAR(100),
	questionType VARCHAR(40),
	answer VARCHAR(20),
	PRIMARY KEY(id),
	FOREIGN KEY(user_id) REFERENCES users(user_id)
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
	homeGoals INT,
	awayGoals INT,
	matchEnded INT,
	PRIMARY KEY(id),
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

INSERT INTO questionsAndAnswers (user_id, category, question, questionType, answer)
VALUES (1, 'standings_champion', 'Champion', 'multipleChoice', ''),
			 (1, 'standings_runnerUp', 'Runner-up', 'multipleChoice', ''),
			 (1, 'standings_thirdPlace', '3rd place', 'multipleChoice', ''),
			 (1, 'scorers_topScorer', 'Top Scorer', 'multipleChoice', ''),
			 (1, 'extras_questions1', 'Extra Question 1', '', ''),
			 (1, 'extras_questions2', 'Extra Question 2', '', ''),
			 (1, 'extras_questions3', 'Extra Question 3', '', ''),
			 (1, 'extras_questions4', 'Extra Question 4', '', ''),
			 (1, 'extras_questions5', 'Extra Question 5', '', '');
