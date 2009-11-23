module Talker
  class User
    attr_accessor :info, :token
    
    def initialize(info)
      @info = info || raise(ArgumentError, "User info required")
    end
    
    def id
      @id ||= @info["id"].to_i
    end
    
    def name
      @info["name"]
    end
  end
end