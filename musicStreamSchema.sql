CREATE DATABASE musicStream;

use musicStream;

CREATE TABLE users(
	userId BIGINT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(50) NOT NULL,
    PRIMARY KEY (userId)
);
INSERT INTO users(userName, pass) VALUES('sfreeman422', 'test');
INSERT INTO users(userName, pass) VALUES('Khornelius', 'test');
INSERT INTO users(userName, pass) VALUES('SilentStrike90', 'test');
INSERT INTO users(userName, pass) VALUES('H0rn3t920', 'test');
INSERT INTO users(userName, pass) VALUES('Romanoman20', 'test');

CREATE TABLE links (
	linkId BIGINT NOT NULL AUTO_INCREMENT,
    linkName VARCHAR(300) NOT NULL,
    linkUrl VARCHAR(400) NOT NULL UNIQUE,
    linkThumbnail VARCHAR(400),
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
INSERT INTO rooms(roomname) VALUES('lobby');
INSERT INTO rooms(roomName, adminUser, pass) VALUES('metalboiz', 1, 'test');

CREATE TABLE messages (
	messageId BIGINT NOT NULL AUTO_INCREMENT,
	message VARCHAR(500) NOT NULL,
    userId BIGINT NOT NULL,
    roomId BIGINT NOT NULL,
    lastModified TIMESTAMP,
    PRIMARY KEY (messageId),
    CONSTRAINT FK_roomId FOREIGN KEY (roomId) REFERENCES rooms(roomId),
    CONSTRAINT FK_userId FOREIGN KEY (userId) REFERENCES users(userId)
);

INSERT INTO messages(message, userId, roomId) VALUES ('Welcome to the lobby!', 1, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('Thanks!', 2, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('Cool.', 3, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('We should checkout /join/metalboiz', 4, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('Good idea, Im going over', 5, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('This music is to harsh', 1, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('Yeah wtf', 2, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('Cool.', 3, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('Im leaving', 4, 1);
INSERT INTO messages(message, userId, roomId) VALUES ('Good idea, Im going home', 5, 1);

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
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(3, 1, 2, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(4, 1, 3, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(5, 1, 2, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(1, 2, 1, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(2, 2, 3, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(3, 2, 5, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(4, 2, 4, 0, 0, 0);
INSERT INTO rooms_links(linkId, roomId, userId, played, upvotes, downvotes) VALUES(5, 2, 3, 0, 0, 0);

CREATE TABLE rooms_messages(
	messageId BIGINT,
    roomId BIGINT,
    CONSTRAINT FK_message_messageId FOREIGN KEY (messageId) REFERENCES messages(messageId),
    CONSTRAINT FK_message_roomId FOREIGN KEY (roomId) REFERENCES rooms(roomId)
);

INSERT INTO rooms_messages(messageId, roomId) VALUES (1, 1);
INSERT INTO rooms_messages(messageId, roomId) VALUES (2, 1);
INSERT INTO rooms_messages(messageId, roomId) VALUES (3, 1);
INSERT INTO rooms_messages(messageId, roomId) VALUES (4, 1);
INSERT INTO rooms_messages(messageId, roomId) VALUES (5, 1);
INSERT INTO rooms_messages(messageId, roomId) VALUES (6, 2);
INSERT INTO rooms_messages(messageId, roomId) VALUES (7, 2);
INSERT INTO rooms_messages(messageId, roomId) VALUES (8, 2);
INSERT INTO rooms_messages(messageId, roomId) VALUES (9, 2);
INSERT INTO rooms_messages(messageId, roomId) VALUES (10, 2);