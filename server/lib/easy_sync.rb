require "stringio"
require "generator"

module EasySync
  RADIX = 36
end

require "easy_sync/op"
require "easy_sync/op_assembler"
require "easy_sync/merging_op_assembler"
require "easy_sync/smart_op_assembler"
require "easy_sync/changeset"

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
  
  t = "\n"
  a = EasySync::Changeset.create_attributions(t)
  t, a = EasySync::Changeset.unpack("Z:1>5*2+5$12456").apply(t, a)
  p [t, a]
  t, a = EasySync::Changeset.unpack("Z:6>1=2*1+1$3").apply(t, a)
  p [t, a]
end
