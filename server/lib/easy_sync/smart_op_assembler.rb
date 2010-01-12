module EasySync
  # Like OpAssembler but able to produce conforming changesets
  # from slightly looser input, at the cost of speed.
  # Specifically:
  # - merges consecutive operations that can be merged
  # - strips final "="
  # - ignores 0-length changes
  # - reorders consecutive + and - (which margingOpAssembler doesn't do)
  class SmartOpAssembler
    attr_reader :length_change
    
    def initialize
      @minus_assem = MergingOpAssembler.new
      @plus_assem = MergingOpAssembler.new
      @keep_assem = MergingOpAssembler.new
      @assem = []
      @last_opcode = nil
      @length_change = 0;
    end

    def flush_keeps
      @assem << @keep_assem.to_s
      @keep_assem.clear
    end

    def flush_plus_minus
      @assem << @minus_assem.to_s
      @minus_assem.clear
      @assem << @plus_assem.to_s
      @plus_assem.clear
    end

    def <<(op)
      return unless op.opcode
      return unless op.chars > 0

      if op.opcode == '-'
        if @last_opcode == '='
          flush_keeps
        end
        @minus_assem << op
        @length_change -= op.chars
      elsif op.opcode == '+'
        if @last_opcode == '='
          flush_keeps
        end
        @plus_assem << op
        @length_change += op.chars
      elsif op.opcode == '='
        if @last_opcode != '='
          flush_plus_minus
        end
        @keep_assem << op
      end
      @last_opcode = op.opcode
    end

    def to_s
      flush_plus_minus
      flush_keeps
      @assem.to_s
    end

    def clear
      @minus_assem.clear
      @plus_assem.clear
      @keep_assem.clear
      @assem.clear
      @length_change = 0
    end

    def end_document
      @keep_assem.end_document
    end
  end
end