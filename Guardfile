# A sample Guardfile
# More info at http://github.com/guard/guard#readme

guard 'rspec', :version => 1, :drb => true do
  watch('^spec/(.*)_spec.rb')
  watch('^lib/(.*)\.rb')                              { |m| "spec/lib/#{m[1]}_spec.rb" }
  watch('^spec/spec_helper.rb')                       { "spec" }
  
  # Rails example
  watch('^app/(.*)\.rb')                              { |m| "spec/#{m[1]}_spec.rb" }
  # watch('^lib/(.*)\.rb')                              { |m| "spec/lib/#{m[1]}_spec.rb" }
  watch('^config/routes.rb')                          { "spec/routing" }
  watch('^app/controllers/application_controller.rb') { "spec/controllers" }
  watch('^spec/factories.rb')                         { "spec/models" }
end

guard 'spork' do
  watch('^config/application.rb$')
  watch('^config/environment.rb$')
  watch('^config/environments/.*\.rb$')
  watch('^config/initializers/.*\.rb$')
  watch('^spec/spec_helper.rb')
end
