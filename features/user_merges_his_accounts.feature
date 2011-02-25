Feature: User merges all his accounts

  Background:
    Given I am logged in in the account "talker"
    And a duplicate of the user exists with an account named: "foo"
    And a duplicate of the user exists with an account named: "bar"

  Scenario: Merges its accounts
    Given I go to the rooms page
    When I fill in "User name" with "cool_username"
    And I fill in "Password" with "newpassword"
    And I fill in "Confirmation" with "newpassword"
    And I press "Merge all my accounts" 
    And the account "talker" should belong to me
    And the account "foo" should belong to me
    And the account "bar" should belong to me

  Scenario: Merges his accounts without password
    Given I go to the rooms page
    When I fill in "User name" with "New user"
    And I press "Merge all my accounts" 
    Then I should see "Password can't be empty"
