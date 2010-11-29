require File.dirname(__FILE__) + '/../test_helper'

describe "User", ActiveSupport::TestCase do
  it "should create user" do
    user = create_user
    user.valid?, user.errors.full_messages.to_sentence.should.not == nil
    user.pending?.should.not == nil
  end
  
  it "name validation" do
    create_user(:name => "ma").errors.on(:name).should == nil
    create_user(:name => "ma@ossum").errors.on(:name).should == nil
    create_user(:name => "ma.n_i-ce").errors.on(:name).should == nil
    create_user(:name => "Marc-André").errors.on(:name).should == nil
    create_user(:name => "").errors.on(:name).should.not == nil
    create_user(:name => "ma dude").errors.on(:name).should.not == nil
  end
  
  it "generate name" do
    user = build_user(:email => "ma@gmail.com")
    user.generate_name
    user.save!
    user.name.should == "ma"
    
    user = build_user(:email => "ma@hotmail.com")
    user.generate_name
    user.save!
    user.name.should == "ma_1"
    
    user = build_user(:email => "ma@yahoo.com")
    user.generate_name
    user.save!
    user.name.should == "ma_2"
  end
  
  it "generate name without email" do
    user = build_user(:email => nil)
    user.guest = true
    user.generate_name
    user.save!
    user.name.should == "user"
    
    user = build_user(:email => nil)
    user.guest = true
    user.generate_name
    user.save!
    user.name.should == "user_1"
  end

  it "activating should set timestamp" do
    user = create_user
    user.activate!
    user.active?.should.not == nil
    user.activated_at.should.not == nil
  end

  it "should reset password" do
    users(:quentin).update_attributes(:password => 'new password', :password_confirmation => 'new password')
    assert_equal users(:quentin), User.authenticate('quentin@example.com', 'new password')
  end

  it "should not update to blank password" do
    users(:quentin).update_attributes(:password => '', :password_confirmation => '')
    assert_equal users(:quentin), User.authenticate('quentin@example.com', 'monkey')
  end

  it "should not rehash password" do
    users(:quentin).update_attributes(:email => 'quentin2@example.com')
    assert_equal users(:quentin), User.authenticate('quentin2@example.com', 'monkey')
  end

  it "should authenticate user by email" do
    assert_equal users(:quentin), User.authenticate('quentin@example.com', 'monkey')
  end

  it "should authenticate user by name" do
    assert_equal users(:quentin), User.authenticate('quentin', 'monkey')
  end

  it "should not authenticate suspended user" do
    users(:quentin).suspend!
    User.authenticate('quentin@example.com', 'monkey').should == nil
  end

  it "should authenticate by perishable token" do
    users(:quentin).create_perishable_token!
    User.authenticate_by_perishable_token(users(:quentin).perishable_token).should == users(:quentin)
  end

  it "should fail authenticate by nil perishable token" do
    users(:quentin), User.authenticate_by_perishable_token(nil).should.not == nil
  end

  it "should fail authenticate by bad perishable token" do
    users(:quentin), User.authenticate_by_perishable_token("ohaie").should.not == nil
  end

  it "should set remember token" do
    users(:quentin).remember_me
    users(:quentin).remember_token.should.not == nil
  end

  it "should unset remember token" do
    users(:quentin).remember_me
    users(:quentin).remember_token.should.not == nil
    users(:quentin).forget_me
    users(:quentin).remember_token.should == nil
  end

  it "create talker tokens" do
    create_user.talker_token.should.not == nil
  end
  
  it "guest have permission to room" do
    assert_difference "Permission.count", 1 do
      create_user(:guest => true, :room => rooms(:main))
    end
  end
  
  it "delete unconnected guest user with same name" do
    user = create_user(:name => "bob", :guest => true, :room => rooms(:main))
    
    create_user(:name.should => "bob", :room => rooms(:main)).valid?
     User.exists?(user.id).should.not == true
  end

  it "do not delete connected guest user with same name" do
    user = create_user(:name => "bob", :guest => true, :room => rooms(:main))
    user.connections.create :channel => rooms(:main)
    
    create_user(:name => "bob", :room => rooms(:main)).errors.on(:name).should.not == nil
    User.exists?(user.id).should.not == nil
  end
  
  it "color validation" do
    User.create(:color => "alert('hi')").errors.on(:color).should.not == nil
    User.create(:color => "boom").errors.on(:color).should.not == nil
    User.create(:color => "red").errors.on(:color).should.not == nil
    User.create(:color => "#ccaabb").errors.on(:color).should == nil
    User.create(:color => "#CCAABB").errors.on(:color).should == nil
    User.create(:color => "#123456").errors.on(:color).should == nil
    User.create.errors.on(:color).should == nil
  end
end
