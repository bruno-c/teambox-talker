# Run me with:
#
#   $ watchr tests.watchr.rb

# --------------------------------------------------
# Convenience Methods
# --------------------------------------------------
def all_test_files
  Dir['test/**/*_test.rb']
end

def run(cmd)
  puts(cmd)
  system(cmd)
end

def run_test(file)
  run "ruby -rubygems -Itest #{file}"
end

def run_all_tests
  cmd = "ruby -rubygems -Itest -e'%w( #{all_test_files.join(' ')} ).each {|file| require file }'"
  run(cmd)
end

# --------------------------------------------------
# Watchr Rules
# --------------------------------------------------
watch( '^test.*/.*_test\.rb'   )    { |m| run_test m[0] }
watch( '^test/test_helper\.rb' )    { run_all_tests }
watch( '^app/models/(.*)\.rb'  )    { |m| run_test "test/unit/#{m[1]}_test.rb" }
watch( '^app/helpers/(.*)\.rb')     { |m| run_test "test/unit/helpers/#{m[1]}_test.rb" }
watch( '^app/mailers/(.*)\.rb'  )    { |m| run_test "test/unit/mailers/#{m[1]}_test.rb" }
watch( '^app/controllers/(.*)\.rb') { |m| run_test "test/functional/#{m[1]}_test.rb" }
watch( '^app/views/(.*)/.*\.erb') { |m| run_test "test/functional/#{m[1]}_controller_test.rb" }
watch( '^app/views/(.*_mailer)/.*\.erb') { |m| run_test "test/unit/mailers/#{m[1]}_test.rb" }

# --------------------------------------------------
# Signal Handling
# --------------------------------------------------
# Ctrl-\
Signal.trap('QUIT') do
  puts " --- Running all tests ---\n\n"
  run_all_tests
end

# Ctrl-C
Signal.trap('INT') { abort("\n") }