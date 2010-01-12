require "stringio"
require "generator"

module EasySync
  RADIX = 36
  
  class Op < Struct.new(:opcode, :chars, :lines, :attribs)
    def self.blank
      new(nil, 0, 0, nil)
    end
  end

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
  
    def to_s
      @buf.join
    end
  
    def clear
      @buf.clear
    end
  end
  
  # Efficiently merges several ops into one.
  # Ported from Etherpad easysunc2support.scala
  class MergingOpAssembler
    def initialize(buf=nil)
      @assembler = OpAssembler.new([buf].compact)
      @buf_op = Op.blank
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
        @buf_op.opcode = ""
      end
    end
    
    def append_op(op)
      append op.opcode, op.chars, op.lines, op.attribs
    end
  
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
      clear_op(@buf_op)
    end
  end

  class InvalidChangeset < RuntimeError; end
  
  class Changeset
    HEADER_REGEX = /Z:([0-9a-z]+)([><])([0-9a-z]+)|/
    OPS_REGEX = /((?:\*[0-9a-z]+)*)(?:\|([0-9a-z]+))?([-+=])([0-9a-z]+)|\?|/
    
    def initialize(size, total_size, ops, char_bank)
      @size = size
      @total_size = total_size
      @ops = ops
      @char_bank = char_bank
    end
    
    def apply_to_text(text)
      raise InvalidChangeset, "mismatched apply: #{text.size} / #{@size}" unless text.size == @size
      bank_iter = StringIO.new(@char_bank)
      text_iter = StringIO.new(text)
      buf = []
      extract_ops(@ops).each do |op|
        case op.opcode
          when '+': buf << bank_iter.read(op.chars)
          when '-': text_iter.read(op.chars)
          when '=': buf << text_iter.read(op.chars)
        end
      end
      while (chunk = text_iter.read).size > 0
        buf << chunk
      end
      buf.join
    end
    
    def apply_to_attributions(attribs, pool=nil)
      att_iter = ops_iterator(attribs)
      cs_iter = ops_iterator(@ops)
      assem = MergingOpAssembler.new
      att_op = cs_op = op = nil
      while att_op || att_iter.next? || cs_op || cs_iter.next?
        att_op = att_iter.next if att_op.nil? && att_iter.next?
        cs_op = cs_iter.next if cs_op.nil? && cs_iter.next?
        
        if att_op.opcode == '-'
          op = att_op
          att_op = nil
        elsif !att_op.opcode
          op = cs_op
          cs_op = nil
        else
          case cs_op && cs_op.opcode
          when '-'
            if cs_op.chars <= att_op.chars
              # delete or delete part
              if att_op.opcode == '='
                op = Op.new('-', cs_op.chars, cs_op.lines, nil)
              end
              att_op.chars -= cs_op.chars
              att_op.lines -= cs_op.lines
              cs_op = nil
              if att_op.chars <= 0
                att_op = nil
              end
            else
              # delete and keep going
              if att_op.opcode == '='
                op = Op.new('-', att_op.chars, att_op.lines, nil)
              end
              cs_op.chars -= att_op.chars
              cs_op.lines -= att_op.lines
              att_op = nil
            end
          when '+'
            # insert
            op = cs_op
            cs_op = nil
          when '='
            if cs_op.chars <= att_op.chars
              # keep or keep part
              op = Op.new(att_op.opcode, cs_op.chars, cs_op.lines,
                          compose_attributes(att_op.attribs, cs_op.attribs,
                                             att_op.opcode == '=', pool))
              
              att_op.chars -= cs_op.chars
              att_op.lines -= cs_op.lines
              cs_op = nil
              if att_op.chars <= 0
                att_op = nil
              end
            else
              # keep and keep going
              op = Op.new(att_op.opcode, att_op.chars, att_op.lines,
                          compose_attributes(att_op.attribs, cs_op.attribs,
                                             att_op.opcode == '=', pool))
              cs_op.chars -= att_op.chars
              cs_op.lines -= att_op.lines
              att_op = nil
            end
          when nil, ''
            op = att_op
            att_op = nil
          end
        end
        
        assem.append_op(op) if op
      end
      assem.end_document
      assem.to_s
    end
    
    def self.unpack(cs)
      raise InvalidChangeset, "No changeset" if cs.nil? || cs.empty?
      matches = cs.match(HEADER_REGEX)
      raise InvalidChangeset, "Not a changeset: #{cs}" unless matches
      old_len = matches[1].to_i(RADIX)
      change_sign = (matches[2] == '>') ? 1 : -1
      change_mag = matches[3].to_i(RADIX)
      new_len = old_len + change_sign * change_mag
      ops_start = matches[0].size
      ops_end = cs.index("$")
      ops_end = cs.size if ops_end < 0
      new old_len, new_len, cs[ops_start..ops_end], cs[(ops_end+1)..-1]
    end
    
    def self.create_attributions(text)
      asm = EasySync::MergingOpAssembler.new
      asm.append("+", text.size+1, text.count("\n")+1, "")
      asm.to_s
    end
    
    private
      def extract_ops(ops)
        result = []
        ops.scan(OPS_REGEX) do |m|
          next unless m[2]
          result << Op.new(m[2], # opcode
                           m[3].to_i(RADIX), # chars
                           (m[1] || "0").to_i(RADIX), # lines
                           m[0].empty? ? nil : m[0]) # attribs
        end
        result
      end
    
      def ops_iterator(ops)
        Generator.new(extract_ops(ops))
      end
      
      def compose_attributes(att1, att2, mutation, pool)
        # Sometimes attribute (key,value) pairs are treated as attribute presence
        # information, while other times they are treated as operations that
        # mutate a set of attributes, and this affects whether an empty value
        # is a deletion or a change.
        # Examples, of the form (att1Items, att2Items, resultIsMutation) -> result
        # ([], [(bold, )], true) -> [(bold, )]
        # ([], [(bold, )], false) -> []
        # ([], [(bold, true)], true) -> [(bold, true)]
        # ([], [(bold, true)], false) -> [(bold, true)]
        # ([(bold, true)], [(bold, )], true) -> [(bold, )]
        # ([(bold, true)], [(bold, )], false) -> []

        # pool can be null if att2 has no attributes.
        
        if att1 && mutation
          # In the case of a mutation (i.e. composing two changesets),
          # an att2 composed with an empy att1 is just att2.  If att1
          # is part of an attribution string, then att2 may remove
          # attributes that are already gone, so don't do this optimization.
          return att2
        end
        
        return att1 if !att2
        
        raise InvalidChangeset, "Mergin of attributes not (yet) supported: #{att1} + #{att2}"
      end
  end
end

if __FILE__ == $PROGRAM_NAME
  # # Applying changeset to a text
  # text = "ohae\nhi\n"
  # cs1 = "Z:8>6|1=5=2*0+6$ there"
  # cs2 = "Z:e>1=3*0+1$i"
  # puts text
  # puts attribs = EasySync::Changeset.create_attributions(text)
  # 
  # c1 = EasySync::Changeset.unpack(cs1)
  # puts text = c1.apply_to_text(text)
  # puts attribs = c1.apply_to_attributions(attribs, nil)
  # 
  # c2 = EasySync::Changeset.unpack(cs2)
  # puts text = c2.apply_to_text(text)
  # puts attribs = c2.apply_to_attributions(attribs, nil)
  
  t = "a\nb\n"
  c = EasySync::Changeset.unpack("Z:4<2|1-2-1*1+1$x")
  p c.apply_to_text(t)
  a = EasySync::Changeset.create_attributions(t)
  p a
  p c.apply_to_attributions(a)
  p EasySync::Changeset.create_attributions(c.apply_to_text(t))
end
