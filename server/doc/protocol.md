# Talker Protocol
This protocol describes how a Talker client communicates with the server. While similar to XMPP, this protocol is focusing on multi-user chat, low bandwidth, simplicity and efficient usage of resources by the server.

All messages are in JSON format. They contain a hash ({...}) and end with a line break (\n). The hash will contain a type element that will define the type of message. See the following sections for a description of each type of message.

## Authentication
Before sending and receiving messages in a room, the client must connect to the room by sending the following message:

    { "type": "connect", "room": "account.roomname", "user": "user name", "token": "user secret token" }

If the authentication is successful, the connection is left open, if not, the connection is closed after the following message is sent by the server:

    { "type": "error", "message": "Authentication failed" }

## Sending messages
A client connected to a room can send a public message like this:

    { "type": "message", "content": "message to send", "id": "unique message ID" }

The server will broadcast the message to all online members of the room (including the sender) with this:

    { "type": "message", "content": "message to send", "id": "unique message ID", "from": "user name" }

## Presence
When a client connects to a room, the following message will be sent to all online members of the room (excluding the new user):

    { "type": "join", "user": "user name" }

When a client close connection to a room, the following message will be sent to all online members of the room (excluding the new user):

    { "type": "leave", "user": "user name" }

## Pinging
In order to keep the connection open, a client must send pings to the server when there is no activity (no message sent or received) on the connection for more then 30 seconds.

    { "type": "ping" }
