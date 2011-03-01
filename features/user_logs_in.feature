Feature: User logs in

  Scenario: User without account logs in using the home page login form
    Given an active user exists
    When I go to the home page
    And I follow "Login"
    And I fill in "email" with "foo@bar.com"
    And I fill in "password" with "secret123"
    And I press "Log in"
    Then I should be on the home page

  Scenario: Logs in using the home page login form
    Given an active user exists
    And the user has the following accounts:
      | subdomain  |
      | teambox   |
    When I go to the login page
    And I fill in "email" with "foo@bar.com"
    And I fill in "password" with "secret123"
    And I press "Log in"
    Then I should see "Account: teambox"
    And I should see "Rooms"
    And I should see "Main"

  Scenario: Logs in to an account and switches to another using cookies
    Given I am logged in in the account "developers"
    And the user has the following accounts:
      | subdomain  |
      | teambox   |
    When I am within the subdomain "teambox"
    Then I should see "Account: teambox"
    And I should not see "Account: developers"


  Scenario: Logs in to an account and switches using the account switcher
    Given I am logged in in the account "developers"
    And the user has the following accounts:
      | subdomain  |
      | teambox   |
    When I am within the subdomain "developers"
    When I change to the first account in the account switcher
    Then I should see "Account: teambox"
    And I should not see "Account: developers"
