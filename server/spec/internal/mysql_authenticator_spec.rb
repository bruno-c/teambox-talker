require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::MysqlAuthenticator do
  before do
    execute_sql_file "delete_all"
    execute_sql_file "insert_users"
    @authenticator = Talker::MysqlAuthenticator.new :database => "talker_test", :user => "root"
  end
  
  it "should authenticate valid token" do
    @authenticator.authenticate(1, "valid") do |user|
      user.id.should == 1
      user.name.should == "user 1"
      user.info["email"].should == "user1@example.com"
      done
    end
  end

  it "should not authenticate invalid token" do
    @authenticator.authenticate(1, "invalid") do |user|
      user.should be_nil
      done
    end
  end

  it "should not authenticate invalid room" do
    @authenticator.authenticate(999999, "valid") do |user|
      user.should be_nil
      done
    end
  end
  
  it "should prevent SQL injection" do
    @authenticator.authenticate(1, "' OR 1=1 '") do |user|
      user.should be_nil
      done
    end
  end
end