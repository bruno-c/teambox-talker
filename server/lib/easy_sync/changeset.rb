module EasySync
  class Changeset
    HEADER_REGEX = /Z:([0-9a-z]+)([><])([0-9a-z]+)|/
    OPS_REGEX = /((?:\*[0-9a-z]+)*)(?:\|([0-9a-z]+))?([-+=])([0-9a-z]+)|\?|/
    
    attr_reader :size, :total_size, :ops, :char_bank
    
    def initialize(size, total_size, ops, char_bank)
      @size = size
      @total_size = total_size
      @ops = ops
      @char_bank = char_bank
    end
    
    def apply(text, attribs=nil, pool=nil)
      [apply_to_text(text), attribs ? apply_to_attributions(attribs, pool) : self.class.create_attributions(text)]
    end
    
    def apply_to_text(text)
      text = text.mb_chars
      raise InvalidChangeset, "mismatched apply: #{text.size} / #{@size}" unless text.size == @size
      bank_iter = StringIterator.new(@char_bank)
      text_iter = StringIterator.new(text)
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
      assem = SmartOpAssembler.new
      att_op = cs_op = op = nil
      while att_op || att_iter.next? || cs_op || cs_iter.next?
        att_op = att_iter.next if att_op.nil? && att_iter.next?
        cs_op = cs_iter.next if cs_op.nil? && cs_iter.next?
        
        if att_op.nil?
          op = cs_op
          cs_op = nil
        elsif att_op.opcode == '-'
          op = att_op
          att_op = nil
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
        
        assem << op if op
        op = nil
      end
      assem.end_document
      assem.to_s
    end
    
    def self.unpack(cs)
      raise InvalidChangeset, "No changeset" if cs.nil? || cs.empty?
      matches = cs.match(HEADER_REGEX)
      raise InvalidChangeset, "Not a changeset: #{cs}" unless matches && matches[1] && matches[2] && matches[3]
      old_len = matches[1].to_i(RADIX)
      change_sign = (matches[2] == '>') ? 1 : -1
      change_mag = matches[3].to_i(RADIX)
      new_len = old_len + change_sign * change_mag
      ops_start = matches[0].mb_chars.size
      cs = cs.mb_chars
      ops_end = cs.index("$")
      ops_end = cs.size if ops_end < 0
      new old_len, new_len, cs[ops_start..ops_end], cs[(ops_end+1)..-1]
    end
    
    def self.create_attributions(text)
      # I'm using MergingOpAssembler#append instead of SmartOpAssembler#appendOpWithText
      # like in the original implementation here. It seems to work fine.
      # In case things go wrong, we'll have to implement the original way.
      asm = MergingOpAssembler.new
      text = text.mb_chars
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
        ArrayIterator.new(extract_ops(ops))
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
        
        # We don't need attributes mergin. So I didn't implement...
        raise InvalidChangeset, "Merging of attributes not (yet) supported: #{att1} + #{att2}"
      end
  end
end