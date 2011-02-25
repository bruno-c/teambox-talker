module Talker::Server
  class User
    include Comparable
    
    attr_accessor :info, :account_id, :admin, :registration_id
    
    def initialize(info)
      @info = info || raise(ArgumentError, "User info required")
      @admin = false
      @account_id = 0
    end
    
    def id
      @id ||= @info["id"].to_i
    end
    
    def name
      @info["name"]
    end
    
    def <=>(other)
      id <=> other.id
    end
  end
end
