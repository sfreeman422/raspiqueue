CREATE DATABASE musicStream;

use musicStream;

CREATE TABLE users(
	userId BIGINT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(50) NOT NULL,
    PRIMARY KEY (userId)
);
INSERT INTO users(userName, pass) VALUES('sfreeman422', 'test');

CREATE TABLE links (
	linkId BIGINT NOT NULL AUTO_INCREMENT,
    linkName VARCHAR(300) NOT NULL,
    linkUrl VARCHAR(400) NOT NULL,
    PRIMARY KEY (linkId)
);
INSERT INTO links(linkName, linkUrl) VALUES('Volbeat - A Warriors Call', 'rSmtHBMjXLU');
INSERT INTO links(linkName, linkUrl) VALUES('Pierce the Veil - Caraphernelia', 'FZVYOriINwc');
INSERT INTO links(linkName, linkUrl) VALUES('Escape The Fate - Situations', 'USriZAMR2nA');
INSERT INTO links(linkName, linkUrl) VALUES('Framing Hanley - Lollipop', 'vbUR0SRceD0');
INSERT INTO links(linkName, linkUrl) VALUES('The Devil Wears Prada - Still Fly (Punk Goes Crunk)', '45SDOEbC9wg');

CREATE TABLE rooms(
	roomId BIGINT NOT NULL AUTO_INCREMENT,
    roomName VARCHAR(50) NOT NULL UNIQUE,
    adminUser BIGINT,
    pass VARCHAR(150),
    PRIMARY KEY (roomId),
    CONSTRAINT FK_adminUser FOREIGN KEY (adminUser) REFERENCES users(userId)
);
INSERT INTO rooms(roomName, adminUser, pass) VALUES('metalboiz', 1, 'test');

CREATE TABLE rooms_links (
	linkId BIGINT,
    roomId BIGINT,
    userId BIGINT,
    played TINYINT(1),
    upvotes BIGINT,
    downvotes BIGINT,
    lastModified TIMESTAMP,
    CONSTRAINT room_link_pk PRIMARY KEY (linkId, roomId),
    CONSTRAINT FK_link FOREIGN KEY (linkId) REFERENCES links(linkId),
    CONSTRAINT FK_room FOREIGN KEY (roomId) REFERENCES rooms(roomId),
	CONSTRAINT FK_user FOREIGN KEY (userId) REFERENCES users(userId)
);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(1, 1, 1, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(2, 1, 1, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(3, 1, 1, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(4, 1, 1, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(5, 1, 1, 0, 0, 0);