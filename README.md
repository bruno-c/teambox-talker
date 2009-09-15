# Talker

## Installation

Install Twisted and Orbited by following instructions on http://orbited.org/wiki/Installation

## Running the app

Start the Rails app:

  thin start -d

Start the Orbited daemon:

  script/orbited

And an host entry in your /etc/hosts file to work with subdomains:

  127.0.0.1       dev.com test.dev.com

Go to http://dev.com:3000 and create an account named test.
