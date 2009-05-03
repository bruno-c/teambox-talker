class Message < Sequel::Model
  many_to_one :user
  
  plugin :hook_class_methods
  before_create { |m| m.created_at = Time.now }
end
