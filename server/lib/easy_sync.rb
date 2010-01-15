require "stringio"
require "generator"

module EasySync
  RADIX = 36
  
  class InvalidChangeset < RuntimeError; end
  
  autoload :Op, "easy_sync/op"
  autoload :OpAssembler, "easy_sync/op_assembler"
  autoload :MergingOpAssembler, "easy_sync/merging_op_assembler"
  autoload :SmartOpAssembler, "easy_sync/smart_op_assembler"
  autoload :Changeset, "easy_sync/changeset"
end

