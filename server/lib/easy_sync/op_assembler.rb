module EasySync
  class OpAssembler
    def initialize(buf=[])
      @buf = buf
    end

    def append(op)
      @buf << op.attribs
      if op.lines > 0
        @buf << '|'
        @buf << op.lines.to_s(RADIX)
      end
      @buf << op.opcode
      @buf << op.chars.to_s(RADIX)
    end
    alias :<< :append
  
    def to_s
      @buf.join
    end
  
    def clear
      @buf.clear
    end
  end
end