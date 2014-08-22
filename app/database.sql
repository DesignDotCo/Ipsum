DROP SCHEMA IF EXISTS `ipsum` ;
CREATE SCHEMA IF NOT EXISTS `ipsum` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `ipsum` ;

CREATE TABLE `channel` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` text NOT NULL,
    `youtube` text NOT NULL,
    `email` text NOT NULL,
    `skype` text NOT NULL,
    `analytics` bigint(20) NOT NULL,
    `contract` tinyint(1) NOT NULL,
    `view` bigint(20) NOT NULL,
    `subscriber` bigint(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1
