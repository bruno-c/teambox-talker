namespace :sprockets do
  desc 'generate sprockets talker.js file'
  task :generate => :environment do
    include ActionController::UrlWriter
    File.open("public/#{sprockets_path}", 'w'){ |f| f.write SprocketsApplication.source}
  end
end
