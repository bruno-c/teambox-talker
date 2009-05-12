class User < Sequel::Model
  attr_accessor :password
  
  def self.authenticate(name, password)
    # TODO check password
    User[:name => name]
  end
end