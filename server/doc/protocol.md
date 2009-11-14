# Talker Protocol
This protocol describes how a Talker client communicates with the server. While similar to XMPP, this protocol is focusing on multi-user chat, low bandwidth, simplicity, efficiency and allows updating previous messages.

All events are in JSON format. They contain a hash ({...}) and end with a line break (\n). The hash will contain a type property that will define the type of event. See the following sections for a description of each type of event.

## Authentication
Before sending and receiving events in a room, the client must connect to the room by sending the following message:

    {"type":"connect","room":"unique room id","token":"user secret token"}

Attributes:

* "room" being the unique number of the room,
* "user" is a hash containing the profile information of the user connecting to the room (id and name attributes are required, but other attributes can be passed) and
* "token" the authentication token for that user.

If the authentication is successful, the connection is left open and the server replies with:

    {"type":"connected","user":{"id":"unique id","name":"user name"}}

The client must wait for this event before sending any message or else an error will be returned and connection will be closed.

If the authentication failed, the connection is closed after the following event is sent by the server:

    {"type":"error","message":"Authentication failed"}

## Sending messages
A client connected to a room can send a public message like this:

    {"type":"message","content":"message to send"}

The server will broadcast the message to all online members of the room (including the sender) with this:

    {"type":"message","content":"message to send",
     "user":{"id":"unique id","name":"user name"},"time":1255447115}

"user" being the required information of the sender (id and name, not profile picture, etc).
"time" is the epoch timestamp when the message was received by the server.

To send a private message, add the "to" property:

    {"type":"message","content":"message to send","to":"recipient unique id"}

The server will send the message to the user in the room matching the name in to:

    {"type":"message","content":"message to send","user":{"id":"unique id","name":"user name",...},"private":true,"time":1255447115}


## Presence
When a client connects to a room, the following event will be sent to all online members of the room:

    {"type":"join","user":{"id":"unique id","name":"user name",...},"time":1255447115}

The server will send the list of users in the room to new users:

    {"type":"users","users":[{"id":"unique id","name":"user name",...}, ...]}

When a client connection is closed momentarily the following event is broadcasted in the room:

    {"type":"idle","user":{"id":"unique id","name":"user name",...},"time":1255447115}

When the client returns from it's idle state, the following event is broadcasted in the room:

    {"type":"back","user":{"id":"unique id","name":"user name",...},"time":1255447115}

When a client close connection to a room, the server sends the following event to all online members of the room:

    {"type":"leave","user":"user unique id","time":1255447115}

## Pinging
In order to keep the connection open, a client must send pings to the server each 30 seconds or less.

    {"type":"ping"}

## Closing
When a client is leaving a room it must send the following event.

    {"type":"close"}
