use musicStream;

CREATE TABLE users(
	userId BIGINT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(50) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE rooms(
	roomId BIGINT NOT NULL AUTO_INCREMENT,
    roomName VARCHAR(50) NOT NULL UNIQUE,
    adminUser VARCHAR(50) NOT NULL,
    FOREIGN KEY (adminUser) REFERENCES users(userId),
    PRIMARY KEY (roomId)
);

CREATE TABLE links (
	linkId BIGINT NOT NULL AUTO_INCREMENT,
    linkName VARCHAR(100) NOT NULL,
    linkUrl VARCHAR(400) NOT NULL,
    roomId BIGINT NOT NULL,
    userId BIGINT NOT NULL,
    FOREIGN KEY (roomId) REFERENCES rooms(roomId),
    FOREIGN KEY (userId) REFERENCES users(userId),
    PRIMARY KEY (linkId)
);
