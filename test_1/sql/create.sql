-- drop database test_1;

create database test_1;

create table test_1.tb_person (
    `id` int not null auto_increment,
    `name` varchar(200) not null,
    `cpf` varchar(12),
    `address` varchar(200),
    `telephone` varchar(25),

    primary key (`id`)
);

select * from test_1.tb_person;
