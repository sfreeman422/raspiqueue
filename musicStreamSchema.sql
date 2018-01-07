CREATE DATABASE musicStream;

use musicStream;

CREATE TABLE users(
	userId BIGINT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(50) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE links (
	linkId BIGINT NOT NULL AUTO_INCREMENT,
    linkName VARCHAR(300) NOT NULL,
    linkUrl VARCHAR(400) NOT NULL,
    PRIMARY KEY (linkId)
);

CREATE TABLE rooms(
	roomId BIGINT NOT NULL AUTO_INCREMENT,
    roomName VARCHAR(50) NOT NULL UNIQUE,
    adminUser BIGINT,
    pass VARCHAR(150),
    PRIMARY KEY (roomId),
    CONSTRAINT FK_adminUser FOREIGN KEY (adminUser) REFERENCES users(userId)
);

CREATE TABLE rooms_links (
	linkId BIGINT,
    roomId BIGINT,
    userId BIGINT,
    played TINYINT(1),
    lastModified TIMESTAMP,
    CONSTRAINT room_link_pk PRIMARY KEY (linkId, roomId),
    CONSTRAINT FK_link FOREIGN KEY (linkId) REFERENCES links(linkId),
    CONSTRAINT FK_room FOREIGN KEY (roomId) REFERENCES rooms(roomId),
	CONSTRAINT FK_user FOREIGN KEY (userId) REFERENCES users(userId)
);