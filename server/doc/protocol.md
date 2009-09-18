# Talker Protocol
This protocol describes how a Talker client communicates with the server. While similar to XMPP, this protocol is focusing on multi-user chat, low bandwidth, simplicity and efficient usage of resources by the server.

All messages are in JSON format. They contain a hash ({...}) and end with a line break (\n). The hash will contain a type element that will define the type of message. See the following sections for a description of each type of message.

## Authentication
Before sending and receiving messages in a room, the client must connect to the room by sending the following message:

    {"type":"connect","room":"0000","user":"user name","token":"user secret token"}

"room" being the name of the room in the format <code>accountname.roomname</code>,
"user" the name of the user connecting to the room and
"token" the authentication token for that user.

If the authentication is successful, the connection is left open, if not, the connection is closed after the following message is sent by the server:

    {"type":"error","message":"Authentication failed"}

## Sending messages
There are two types of messages: partial and final. Partial messages are sent by the client while live-typing and do not contain the full message, delivery of those messages is faster but not guaranteed. Final messages are sent once the user has hit enter and can no longer modify the message, delivery of those messages is guaranteed.
A client connected to a room can send a public message like this:

For partial messages:

    {"type":"message","content":"message to send","id":"unique message ID"}

"id" must be a UUID as described in http://www.ietf.org/rfc/rfc4122.txt.

For final messages:

    {"type":"message","content":"message to send","id":"unique message ID","final":true}

The server will broadcast the message to all online members of the room (including the sender) with this:

    {"type":"message","content":"message to send","id":"unique message ID","from":"user name"}

## Presence
When a client connects to a room, the following message will be sent to all online members of the room (excluding the new user):

    {"type":"join","user":"user name"}

When a client close connection to a room, the following message will be sent to all online members of the room (excluding the new user):

    {"type":"leave","user":"user name"}

## Pinging
In order to keep the connection open, a client must send pings to the server when there is no activity (no message sent or received) on the connection for more then 30 seconds.

    {"type":"ping"}

## Closing
When a client is leaving a room it must the following message.

    {"type":"close"}
