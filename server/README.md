# Talker

## Installation

The Talker Server needs RabbitMQ.

Install using MacPorts with:

    sudo port install rabbitmq-server

Test it:

    rabbitmq-server

## Running

Start RabbitMQ:

    rabbitmq-server

Start the Talker server:

    bin/talker

Test it with the CLI client:

    bin/talker-client test/test yourname 0000
