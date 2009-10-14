module Talker
  class User
    attr_reader :info
    attr_accessor :token
    
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
    
    def state
      @info["state"]
    end

    def idle?
      @info["state"] == "idle"
    end

    def idle!
      @info["state"] = "idle"
    end

    def online!
      @info["state"] = "online"
    end
  end
end