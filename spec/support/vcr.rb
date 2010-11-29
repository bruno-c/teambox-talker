require 'vcr'

VCR.config do |c|
  c.cassette_library_dir     = 'spec/fixtures/cassette_library'
  c.stub_with                :fakeweb
  c.ignore_localhost         = true
  c.default_cassette_options = { :record => :new_episodes }
end
