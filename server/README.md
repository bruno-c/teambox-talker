# Talker

## Installation

The Talker Server needs RabbitMQ.

Install using MacPorts with:

    sudo port install rabbitmq-server

Test it:

    rabbitmq-server

Install these gems:

    sudo gem install brianmario-yajl-ruby -s http://gems.github.com

## Running

Start RabbitMQ:

    rabbitmq-server

Start the Talker server:

    bin/talker

Test it with the CLI client:

    bin/talker-client test.test yourname 0000

## Running tests

Install these gems:

    sudo gem install tmm1-em-spec -s http://gems.github.com
    sudo gem install danielsdeleo-moqueue -s http://gems.github.com
    
Run it!

    rake spec