# Talker Protocol
This protocol describes how a Talker client communicates with the server. While similar to XMPP, this protocol is focusing on multi-user chat, low bandwidth, simplicity, efficiency and allows updating previous messages.

All messages are in JSON format. They contain a hash ({...}) and end with a line break (\n). The hash will contain a type property that will define the type of message. See the following sections for a description of each type of message.

## Authentication
Before sending and receiving messages in a room, the client must connect to the room by sending the following message:

    {"type":"connect","room":"unique room id","user":{"id":"unique id","name":"user name",...},"token":"user secret token"}

Attributes:

* "room" being the unique number of the room,
* "user" is a hash containing the profile information of the user connecting to the room (id and name attributes are required, but other attributes can be passed) and
* "token" the authentication token for that user.

If the authentication is successful, the connection is left open and the server replies with:

    {"type":"connected"}

The client must wait for this message before sending any message or else an error will be returned and connection will be closed.

If the authentication failed, the connection is closed after the following message is sent by the server:

    {"type":"error","message":"Authentication failed"}

## Sending messages
There are two types of messages: partial and final. Partial messages are sent by the client while live-typing and do not contain the full message, delivery of those messages is faster but not guaranteed. Final messages are sent once the user has hit enter and can no longer modify the message, delivery of those messages is guaranteed.
A client connected to a room can send a public message like this:

    {"type":"message","content":"message to send","id":"unique message ID","final":true}

Attributes:

 * "id" must be a UUID as described in http://www.ietf.org/rfc/rfc4122.txt.
 * "final" specifies that this message wont be updated again and delivery is required. Partial messages ("final":false) delivery is not guaranteed but faster.

The server will broadcast the message to all online members of the room (including the sender) with this:

    {"type":"message","content":"message to send","id":"unique message ID",
     "user":{"id":"unique id","name":"user name"}}

"user" being the required information of the sender (id and name, not profile picture, etc).

To send a private message, add the "to" property:

    {"type":"message","content":"message to send","id":"unique message ID","to":"recipient unique id"}

The server will send the message to the user in the room matching the name in to:

    {"type":"message","content":"message to send","id":"unique message ID","user":{"id":"unique id","name":"user name",...},"private":true}


## Presence
When a client connects to a room, the following message will be sent to all online members of the room:

    {"type":"join","user":{"id":"unique id","name":"user name",...}}

The server will send the list of users in the room to new users:

    {"type":"users","users":[{"id":"unique id","name":"user name",...}, ...]}

When a client close connection to a room, the server sends the following message to all online members of the room:

    {"type":"leave","user":"user unique id"}

## Pinging
In order to keep the connection open, a client must send pings to the server when there is no activity (no message sent or received) on the connection for more then 30 seconds.

    {"type":"ping"}

## Closing
When a client is leaving a room it must the following message.

    {"type":"close"}
