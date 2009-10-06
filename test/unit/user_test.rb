require File.dirname(__FILE__) + '/../test_helper'

class UserTest < ActiveSupport::TestCase
  def test_should_create_user
    user = create_user
    assert user.valid?, user.errors.full_messages.to_sentence
    assert user.pending?
  end

  def test_activating_should_set_timestamp
    user = create_user
    user.activate!
    assert user.active?
    assert_not_nil user.activated_at
  end

  def test_should_reset_password
    users(:quentin).update_attributes(:password => 'new password', :password_confirmation => 'new password')
    assert_equal users(:quentin), User.authenticate('quentin@example.com', 'new password')
  end

  def test_should_not_rehash_password
    users(:quentin).update_attributes(:email => 'quentin2@example.com')
    assert_equal users(:quentin), User.authenticate('quentin2@example.com', 'monkey')
  end

  def test_should_authenticate_user
    assert_equal users(:quentin), User.authenticate('quentin@example.com', 'monkey')
  end

  def test_should_not_authenticate_suspended_user
    users(:quentin).suspend!
    assert_nil User.authenticate('quentin@example.com', 'monkey')
  end

  def test_should_set_remember_token
    users(:quentin).remember_me
    assert_not_nil users(:quentin).remember_token
  end

  def test_should_unset_remember_token
    users(:quentin).remember_me
    assert_not_nil users(:quentin).remember_token
    users(:quentin).forget_me
    assert_nil users(:quentin).remember_token
  end

  def test_create_talker_tokens
    assert_not_nil create_user.talker_token
  end
end
