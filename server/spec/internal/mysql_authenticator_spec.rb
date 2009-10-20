require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::MysqlAuthenticator do
  before do
    execute_sql_file "delete_all"
    execute_sql_file "insert_users"
    @authenticator = Talker::MysqlAuthenticator.new :database => "talker_test", :user => "root"
  end
  
  it "should authenticate valid token" do
    @authenticator.authenticate(1, 1, "valid") do |success|
      success.should be_true
      done
    end
  end

  it "should not authenticate invalid token" do
    @authenticator.authenticate(1, 1, "invalid") do |success|
      success.should be_false
      done
    end
  end

  it "should not authenticate invalid user" do
    @authenticator.authenticate(99999, 1, "valid") do |success|
      success.should be_false
      done
    end
  end

  it "should not authenticate invalid room" do
    @authenticator.authenticate(1, 999999, "valid") do |success|
      success.should be_false
      done
    end
  end
end