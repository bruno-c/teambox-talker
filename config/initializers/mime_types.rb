# Be sure to restart your server when you modify this file.

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf
# Mime::Type.register_alias "text/html", :iphone


class Mime::Type
  delegate :split, :to => :to_s
end

Mime::Type.register "application/x-webapp", :webapp
