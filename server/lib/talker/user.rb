module Talker
  class User
    attr_reader :info
    
    def initialize(info)
      @info = info
    end
    
    def required_info
      @required_info ||= {"id" => id, "name" => name}
    end
    
    def id
      @id ||= @info["id"]
    end

    def name
      @name ||= @info["name"]
    end
  end
end