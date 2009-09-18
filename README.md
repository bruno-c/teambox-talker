# Talker

## Installation

Install Twisted and Orbited by following instructions on http://orbited.org/wiki/Installation

Install RabbitMQ using MacPorts with:

    sudo port install rabbitmq-server

And an host entry in your /etc/hosts file for each subdomains you want to use:

    127.0.0.1       dev.com test.dev.com


## Running the app

Start the Rails app:

    thin start -d

Start the Orbited daemon:

    script/orbited

Start the Talker server:

    script/talker

