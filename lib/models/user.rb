class User < Sequel::Model
  def self.authenticate(name, password)
    # TODO check password
    User[:name => name]
  end
end