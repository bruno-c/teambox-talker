require "stringio"
require "generator"

# For unicode support
require "active_support/core_ext"
require "active_support/multibyte"
$KCODE = 'UTF8'

# EtherPad EasySync algorihtm ported from http://code.google.com/p/etherpad/
module EasySync
  RADIX = 36
  
  class InvalidChangeset < RuntimeError; end
  
  autoload :Op, "easy_sync/op"
  autoload :OpAssembler, "easy_sync/op_assembler"
  autoload :MergingOpAssembler, "easy_sync/merging_op_assembler"
  autoload :SmartOpAssembler, "easy_sync/smart_op_assembler"
  autoload :Changeset, "easy_sync/changeset"
  autoload :StringIterator, "easy_sync/string_iterator"
end
