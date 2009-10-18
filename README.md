# Talker

## Installation

Install Twisted and Orbited by following instructions on http://orbited.org/wiki/Installation

Install RabbitMQ using MacPorts with:

    sudo port install rabbitmq-server

And an host entry in your /etc/hosts file for each subdomains you want to use:

    127.0.0.1       dev.com test.dev.com

Install required gems:
    
    gem sources -a http://gems.github.com # if not already done
    sudo gem install eventmachine uuid tmm1-amqp brianmario-yajl-ruby mysqlplus igrigorik-em-http-request rubyosa
    rake gems:install

## Running the app

Start all service in development environment:

    script/devenv
