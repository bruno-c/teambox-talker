module AuthenticatedTestHelper
  # Sets the current user in the session from the user fixtures.
  def login_as(user)
    @request.session[:user_id] = user ? (user.is_a?(User) ? user.id : users(user).id) : nil
  end

  def assert_access_denied
    assert_redirected_to "/login"
  end

  def assert_access_granted
    assert_not_equal @controller.url_for("/login"), @controller.url_for(@response.redirected_to)
  end
end
