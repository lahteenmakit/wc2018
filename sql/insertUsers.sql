create table users (
	user_id int NOT NULL AUTO_INCREMENT,
	username varchar(20) not null,
	email varchar(50) not null,
	password binary(60) not null,
	primary key(id)
);
