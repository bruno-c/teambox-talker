Feature: Sign up with a free account
  In order to use Talker
  As a visitor
  I want to sign up with a free account

  Scenario: Guest signs up with a free account
    Given I go to the landing page
    And I follow "Pricing & Signup" 
    And I follow "Free Plan"

    When I fill in the following:
      | account_subdomain | teambox        |
      | User name         | jsmith         |
      | Email             | jsmith@foo.com |
      | Password          | secret123      |
      | Password again    | secret123      |

    And I press "Create my account"

    Then I should see "Welcome to Talker"
    And I should see "Thank you for trying our app!"

  Scenario: Guest signs up with a free account and fails
    Given I go to the landing page
    And I follow "Pricing & Signup" 
    And I follow "Free Plan"

    When I fill in the following:
      | account_subdomain | teambox        |
      | User name         |                |
      | Email             | jsmith@foo.com |
      | Password          | secret123      |
      | Password again    |                |

    And I press "Create my account"

    Then I should see "3 errors prohibited this account from being saved"

  Scenario: Existing user signs up with a free account
    Given a user exists with name: "John", email: "jsmith@example.com"
    And the user is active
    And the user has an account named "talker"
    And I go to the landing page
    And I follow "Pricing & Signup" 
    And I follow "Free Plan"

    When I fill in "account_subdomain" with "teambox"
    And I fill in "Email or name" with "jsmith@example.com" in the registered user fieldset
    And I fill in "Password" with "secret123" in the registered user fieldset

    And I press "Create my account"
    Then I should see "Rooms"
    And the user should have 2 accounts
    
  Scenario: Existing user fails signing up with a free account
    Given a user exists with name: "John", email: "jsmith@example.com"
    And the user is active
    And the user has an account named "talker"
    And I go to the landing page
    And I follow "Pricing & Signup" 
    And I follow "Free Plan"

    When I fill in "account_subdomain" with "teambox"
    And I fill in "User name" with "foo_bar"
    And I fill in "Email" with "jsmith@example.com"
    And I fill in "Password" with "secret123"
    And I fill in "Password again" with "secret123"

    And I press "Create my account"
    Then I should see "Email has already been taken"
    And the user should have 1 accounts
