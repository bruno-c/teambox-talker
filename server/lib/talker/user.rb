module Talker
  class User
    attr_reader :info
    attr_accessor :token
    
    def initialize(info)
      @info = info || raise(ArgumentError, "User info required")
    end
    
    def required_info
      @required_info ||= {"id" => id, "name" => name}.freeze
    end
    
    def id
      @id ||= @info["id"].to_i
    end
    
    def name
      @name ||= @info["name"].freeze
    end
  end
end