# Talker Protocol
This protocol describes how a Talker client communicates with the server. While similar to XMPP and IRC, this protocol is focusing on multi-user chat, simplicity and ease of use.

All communications in Talker happen on a named channel. A channel has a type and a unique identifier, for example the Main room (type is room and id is Main).

All events are in JSON format. They contain a hash (`{...}`) and end with a line break (`\n`). The hash will contain a type property that will define the type of event. See the following sections for a description of each type of event.

## Authentication
Before sending and receiving events in a channel, the client must connect to the channel by sending the following message:

To connect to a room:

    {"type":"connect","room":"Main","token":"user secret token"}

To connect to a paste:

    {"type":"connect","paste":"paste ID","token":"user secret token"}

Attributes:

* `room` the name or numeric unique identifier of the room channel to connect to,
* `paste` the unique identifier of the paste channel to connect to,
* `token` the authentication token for that user.

If the authentication is successful, the connection is left open and the server replies with:

    {"type":"connected","user":{"id":"unique id","name":"user name"}}

The client must wait for this event before sending any message or else an error will be returned and connection will be closed.

Attributes:

* `user` is a hash containing the profile information of the user (`id` and `name` attributes).

If the authentication failed, the connection is closed after the following event is sent by the server:

    {"type":"error","message":"Authentication failed"}

## Sending messages
A client connected to a channel can send a public message like this:

    {"type":"message","content":"message to send"}

The server will broadcast the message to all online members of the channel (including the sender) with this:

    {"type":"message","content":"message to send","id":"event UUID",
     "user":{"id":"unique id","name":"user name"},"time":1255447115}

Attributes:

* `user` being the required information of the sender (id and name, not profile picture, etc).
* `time` is the epoch timestamp when the message was received by the server.
* `id` is a unique identifier of the event based on [RFC 4122](http://www.ietf.org/rfc/rfc4122.txt)

To send a private message, add the `to` property:

    {"type":"message","content":"message to send","to":"recipient unique id"}

The server will send the message to the user in the channel matching the `id` in to:

    {"type":"message","content":"message to send","id":"message UUID",
     "user":{"id":"unique id","name":"user name",...},"private":true,"time":1255447115}


## Presence
When a client connects to a channel, the following event will be sent to all online members of the channel:

    {"type":"join","user":{"id":"unique id","name":"user name",...},"time":1255447115,"id":"event UUID"}

The server will send the list of users in the channel to new users:

    {"type":"users","users":[{"id":"unique id","name":"user name",...}, ...]}

When a client connection is closed momentarily the following event is broadcasted in the channel:

    {"type":"idle","user":{"id":"unique id","name":"user name",...},"time":1255447115,"id":"event UUID"}

When the client returns from it's idle state, the following event is broadcasted in the channel:

    {"type":"back","user":{"id":"unique id","name":"user name",...},"time":1255447115,"id":"event UUID"}

When a client close connection to a channel, the server sends the following event to all online members of the channel:

    {"type":"leave","user":"user unique id","time":1255447115,"id":"event UUID"}

## Pinging
In order to keep the connection open, a client must send pings to the server each 30 seconds or less.

    {"type":"ping"}

## Closing
A client can leave a channel by sending following event.

    {"type":"close"}

The connected user will leave the channel automatically if the connection is inactive for more than 30 seconds.
