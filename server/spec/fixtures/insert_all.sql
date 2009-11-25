INSERT INTO rooms (id, account_id) VALUES (1, 1);
INSERT INTO rooms (id, account_id) VALUES (2, 1);

INSERT INTO users (id, name, email, talker_token, state, account_id) VALUES (1, 'user 1', 'user1@example.com', 'valid', 'active', 1);
INSERT INTO users (id, name, email, talker_token, state, account_id) VALUES (2, 'user 2', 'user2@example.com', 'valid', 'active', 1);
INSERT INTO users (id, name, email, talker_token, state, account_id) VALUES (3, 'user 3', 'user3@example.com', 'valid', 'active', 1);
INSERT INTO users (id, name, email, talker_token, state, account_id, restricted) VALUES (4, 'restricted', 'restricted@example.com', 'restricted', 'active', 1, 1);

INSERT INTO permissions (room_id, user_id) VALUES (2, 4);

INSERT INTO events (uuid, room_id, type, created_at, payload) VALUES ('1', 1, 'message', NOW() - 3, '{"id":"1","type":"message"}');
INSERT INTO events (uuid, room_id, type, created_at, payload) VALUES ('2', 1, 'message', NOW() - 2, '{"id":"2","type":"message"}');
