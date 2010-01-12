module EasySync
  class Op
    attr_accessor :opcode, :chars, :lines, :attribs
    
    def initialize(opcode=nil, chars=0, lines=0, attribs=nil)
      @opcode = opcode
      @chars = chars
      @lines = lines
      @attribs = attribs
    end
  end
end