create table participiants (
  id int not null auto_increment,
  email varchar(320),
	username varchar(50),
	password varchar(44),
	points int,
  primary key (id)
);

insert into participiants (email, username, password, points)
values ('pekka@testi.com','pekka','salasana',0),
 ('markku@testi.com','markku','salasana',0),
 ('jussi@testi.com','jussi','salasana',0),
 ('timo@testi.com','timo','salasana',0);
