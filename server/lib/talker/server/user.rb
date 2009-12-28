module Talker::Server
  class User
    attr_accessor :info, :account_id, :admin
    
    def initialize(info)
      @info = info || raise(ArgumentError, "User info required")
      @admin = false
      @account_id = nil
    end
    
    def id
      @id ||= @info["id"].to_i
    end
    
    def name
      @info["name"]
    end
  end
end