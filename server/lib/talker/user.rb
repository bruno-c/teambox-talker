module Talker
  class User
    attr_reader :info
    attr_accessor :timer
    
    def initialize(info)
      @info = info
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