# Talker

## Install development environment (OS X)

**Note**: If you don't use homebrew for software packages or need root permissions to write the /usr/local directory, you may need to `sudo` some commands.

### Realtime messaging

Install Twisted and Orbited by following instructions on http://orbited.org/wiki/Installation (or below)

    wget http://peak.telecommunity.com/dist/ez_setup.py
    python ez_setup.py setuptools

Well well, before we could skip this step, but now some dependencies are not hosted where they should be anymore, so you'll have to install them manually:

    wget http://pypi.python.org/packages/source/d/demjson/demjson-1.4.tar.gz
    tar zxvf demjson-1.4.tar.gz
    cd demjson-1.4
    python setup.py install

And now, finally, do the rest with one command:

    easy_install orbited

Install **RabbitMQ** using MacPorts or homebrew with:

    sudo port install rabbitmq-server
    # or
    brew install rabbitmq

### Ruby Gems

The gem rubyosa seems to break in Snow Leopard, you can use this fork: http://github.com/jboyett/rubyosa

    git clone git://github.com/jrom/rubyosa.git
    cd rubyosa
    ruby extconf.rb
    make
    make install
    make install-extras

You can always try to use the original rubyosa gem:

    gem install rubyosa

For the rest of the gems just:

    gem install eventmachine amqp yajl-ruby mysqlplus em-http-request rb-appscript thin
    rake gems:install

## Configuration / bootstrapping

Some pieces of talker in development assume your mysql root's account has no password. Do what you need to.

    cp config/database.example.yml config/database.yml
    rake db:create
    rake db:schema:load
    rake db:fixtures:load

## Running the stack

Start the whole stack in development environment:

    script/devenv
