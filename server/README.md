# Talker

## Installation
Install RabbitMQ using Brew (or other) with:

    brew install rabbitmq

Install these gems:

    sudo gem install mysqlplus yajl-ruby talker

## Running

Start RabbitMQ:

    rabbitmq-server

Start the Talker channel, presence and logger servers:

    bin/talker channel
    bin/talker presence
    bin/talker logger

## Running tests

Install these gems:

    git clone http://github.com/macournoyer/em-spec && cd em-spec && rake gem && sudo gem install em-spec-*.gem
    sudo gem install danielsdeleo-moqueue -s http://gems.github.com
    
Run it!

    rake spec