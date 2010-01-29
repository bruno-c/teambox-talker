module EasySync
  # Wrapper to make array acts like an iterator
  class ArrayIterator
    def initialize(array)
      @array = array
      @i = 0
    end
    
    def next?
      @i < @array.size
    end
    
    def next
      return nil unless next?
      item = @array[@i]
      @i += 1
      item
    end
  end
end
