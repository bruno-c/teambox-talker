module EasySync
  # Mimics StringIO but returning multibyte strings.
  class StringIterator
    def initialize(string)
      @string = string
      @i = 0
    end
    
    def read(n=@string.size)
      return "" if @i >= @string.size
      r = @string[@i, n]
      @i += r.size
      r
    end
  end
end