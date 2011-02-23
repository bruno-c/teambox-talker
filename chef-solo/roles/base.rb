name "base"
description "Base server"
run_list(
  # "recipe[postgresql::server]",
  "recipe[codegram::rails]"
)
