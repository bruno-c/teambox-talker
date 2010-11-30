# encoding: utf-8
require File.dirname(__FILE__) + '/../spec_helper'

describe User do
  it "should create user" do
    user = Factory(:user)
    user.valid?
    user.errors.full_messages.to_sentence.should_not == nil
    user.should be_pending
  end
  
  it "name validation" do
    %w{ma ma@ossum ma.n_i-ce Marc-André}.each do |valid_name|
      valid_user = Factory.build(:user, :name => valid_name)
      valid_user.valid?
      valid_user.errors.on(:name).should be_nil
    end
    ["ma dude", ""].each do |invalid_name|
      invalid_user = Factory.build(:user, :name => invalid_name)
      invalid_user.valid?
      invalid_user.errors.on(:name).should_not be_nil
    end
  end
  
  it "generate name" do
    account = Factory.create(:account)

    user = Factory.create(:user, :email => "ma@gmail.com", :account => account)
    user.generate_name
    user.save!
    user.name.should == "ma"
    
    user = Factory.create(:user, :email => "ma@hotmail.com", :account => account)
    user.generate_name
    user.save!
    user.name.should == "ma_1"
    
    user = Factory.create(:user, :email => "ma@yahoo.com", :account => account)
    user.generate_name
    user.save!
    user.name.should == "ma_2"
  end
  
  it "generate name without email" do
    account = Factory.create(:account)
    user = Factory.build(:user, :email => nil, :account => account)
    user.guest = true
    user.generate_name
    user.save!
    user.name.should == "user"
    
    user = Factory.build(:user, :email => nil, :account => account)
    user.guest = true
    user.generate_name
    user.save!
    user.name.should == "user_1"
  end

  it "activating should set timestamp" do
    user = Factory.create(:user)
    user.activate!
    user.should be_active
    user.activated_at.should_not == nil
  end

  it "should reset password" do
    admin = Factory(:admin_user)
    admin.activate!
    admin.update_attributes(:password => 'new password', :password_confirmation => 'new password')
    User.authenticate(admin.email, 'new password').should == admin
  end

  it "should_not update to blank password" do
    admin = Factory(:admin_user, :password => 'monkey',
                                 :password_confirmation => 'monkey')
    admin.activate!
    admin.update_attributes(:password => '', :password_confirmation => '')
    User.authenticate(admin.email, 'monkey').should == admin
  end

  it "should_not rehash password" do
    admin = Factory(:admin_user, :password => 'monkey',
                                 :password_confirmation => 'monkey')
    admin.activate!
    admin.update_attributes(:email => 'quentin2@example.com')
    User.authenticate('quentin2@example.com', 'monkey').should == admin
  end

  it "should authenticate user by email" do
    admin = Factory(:admin_user, :password => 'monkey',
                                 :password_confirmation => 'monkey')
    admin.activate!
    admin.account = Factory(:account)
    User.authenticate(admin.email, 'monkey').should == admin
  end

  it "should authenticate user by name" do
    admin = Factory(:admin_user, :password => 'monkey',
                                 :password_confirmation => 'monkey')
    admin.activate!
    admin.account = Factory(:account)
    User.authenticate(admin.name, 'monkey').should == admin
  end

  it "should_not authenticate suspended user" do
    admin = Factory(:admin_user)
    admin.suspend!
    User.authenticate(admin.email, admin.password).should be_nil
  end

  it "should authenticate by perishable token" do
    admin = Factory(:admin_user)
    admin.create_perishable_token!
    User.authenticate_by_perishable_token(admin.perishable_token).should == admin
  end

  it "should fail authenticate by nil perishable token" do
    Factory(:admin_user)
    User.authenticate_by_perishable_token(nil).should be_nil
  end

  it "should fail authenticate by bad perishable token" do
    Factory(:admin_user)
    User.authenticate_by_perishable_token("ohaie").should be_nil
  end

  it "should set remember token" do
    admin = Factory(:admin_user)
    admin.remember_me
    admin.remember_token.should_not be_nil
  end

  it "should unset remember token" do
    admin = Factory(:admin_user)
    admin.remember_me
    admin.remember_token.should_not be_nil
    admin.forget_me
    admin.remember_token.should be_nil
  end

  it "create talker tokens" do
    Factory(:user).talker_token.should_not be_nil
  end
  
  it "guest have permission to room" do
    expect {
      Factory.create(:user, :guest => true, :room => Factory(:room))
    }.to change(Permission, :count).by(1)
  end
  
  it "delete unconnected guest user with same name" do
    room = Factory(:room)
    user = Factory.build(:user, :name => "bob", :guest => true)
    user.room = room
    
    other_user = Factory.build(:user, :name => "bob", :room => room)
    other_user.should be_valid
    User.exists?(user.id).should_not == true
  end

  it "do not delete connected guest user with same name" do
    room = Factory(:room)
    user = Factory(:user, :name => "bob", :guest => true, :room => room)
    user.connections.create :channel => room
    
    other_user = Factory.build(:user, :name => "bob", :room => room)
    other_user.valid?
    other_user.errors.on(:name).should_not be_nil
    User.exists?(user.id).should_not be_nil
  end
  
  it "color validation" do
    %w{alert('hi') boom red}.each do |invalid_color|
      invalid_user = Factory.build(:user, :color => invalid_color)
      invalid_user.valid?
      invalid_user.errors.on(:color).should_not be_nil
    end
    %w{#ccaabb #CCAABB #123456}.each do |valid_color|
      valid_user = Factory.build(:user, :color => valid_color)
      valid_user.valid?
      valid_user.errors.on(:color).should be_nil
    end
    User.create.errors.on(:color).should == nil
  end
end
