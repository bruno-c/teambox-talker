# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_talker_session',
  :secret      => '06395bfbc91ec2315bdce0099ce91d2b9728beae76be4ddbc238dff525e118b4427abb5dc43a3dc0012200c5362f0fe64f3f97c5712e9b403c881098b286a6e8'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
