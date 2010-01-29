module Talker::Server
  class Cache
    def initialize(max_size)
      @store = {}
      @queue = []
      @size = 0
      @max_size = max_size
    end
    
    def [](id)
      @store[id]
    end
    
    def []=(id, item)
      @queue << id unless @store.key?(id)
      @store[id] = item
      truncate
      item
    end
    
    def size
      @store.values.inject(0) { |sum, item| sum += item.size }
    end
    
    def truncate
      while size > @max_size && id = @queue.shift
        @store.delete(id)
      end
    end
  end
end