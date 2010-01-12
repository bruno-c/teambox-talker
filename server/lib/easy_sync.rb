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
