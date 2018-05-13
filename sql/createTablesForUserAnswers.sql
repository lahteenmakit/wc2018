create table users (
	user_id int NOT NULL AUTO_INCREMENT,
	username varchar(20) not null,
	email varchar(50) not null,
	password binary(60) not null,
	primary key(id)
);

create table questionsAndAnswers (
	id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
	answer_champion varchar(30),
  answer_runnerup varchar(30),
  answer_thirdplace varchar(30),
	answer_topScorer varchar(40),
	extra1_question varchar(100),
	extra1_answer varchar(10),
	extra2_question varchar(100),
	extra2_answer varchar(10),
	extra3_question varchar(100),
	extra3_answer varchar(10),
	extra4_question varchar(100),
	extra4_answer varchar(10),
	extra5_question varchar(100),
	extra5_answer varchar(10),
	primary key(id),
  foreign key(user_id) references users(user_id)
);

/*
create table scorersAnswers (
	id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
	answer_champion varchar(40),
  answer_runnerup varchar(40),
  answer_thirdplace varchar(40),
	primary key(id),
  foreign key(user_id) references users(user_id)
);

create table extrasAnswers (
	id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  question1 varchar(100),
  answer1 varchar(10),
  question2 varchar(100),
  answer2 varchar(10),
  question3 varchar(100),
  answer3 varchar(10),
  question4 varchar(100),
  answer4 varchar(10),
  question5 varchar(100),
  answer5 varchar(10),
	primary key(id),
  foreign key(user_id) references users(user_id)
);*/
