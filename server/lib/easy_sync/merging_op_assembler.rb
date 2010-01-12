module EasySync
  # Efficiently merges several ops into one.
  # Ported from Etherpad easysunc2support.scala
  class MergingOpAssembler
    def initialize(buf=nil)
      @assembler = OpAssembler.new([buf].compact)
      @buf_op = Op.new
      @buf_op_additional_chars_after_newline = 0
    end
  
    def flush(is_end_document)
      if @buf_op.opcode
        if is_end_document && @buf_op.opcode == "=" && @buf_op.attribs.size == 0
          # final merged keep, leave it implicit
        else
          @assembler.append(@buf_op)
          if @buf_op_additional_chars_after_newline > 0
            @buf_op.chars = @buf_op_additional_chars_after_newline
            @buf_op.lines = 0
            @assembler.append(@buf_op)
            @buf_op_additional_chars_after_newline = 0
          end
        end
        @buf_op.opcode = nil
      end
    end
    
    def append_op(op)
      append op.opcode, op.chars, op.lines, op.attribs
    end
    alias :<< :append_op
  
    def append(opcode, chars, lines, attribs)
      if chars > 0
        if @buf_op.opcode == opcode && @buf_op.attribs == attribs
          if lines > 0
            # buf_op and additional chars are all mergeable into a multi-line op
            @buf_op.chars += @buf_op_additional_chars_after_newline + chars
            @buf_op.lines += lines
            @buf_op_additional_chars_after_newline = 0
          elsif @buf_op.lines == 0
            # both buf_op and op are in-line
            @buf_op.chars += chars
          else
            # append in-line text to multi-line buf_op
            @buf_op_additional_chars_after_newline += chars
          end
        else
          flush(false)
          @buf_op = Op.new(opcode, chars, lines, attribs)
        end
      end
    end
  
    def end_document
      flush(true)
    end
  
    def to_s
      flush(false)
      @assembler.to_s
    end
  
    def clear
      @assembler.clear
      @buf_op = Op.new
    end
  end
end