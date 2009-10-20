def execute_sql_file(file)
  bin = `which mysql`.chomp
  if bin.empty?
    bin = "/usr/local/bin/mysql"
  end
  out = `#{bin} -uroot talker_test < #{File.dirname(__FILE__) + '/fixtures/' + file}.sql`.chomp
  raise out unless $?.success?
end
