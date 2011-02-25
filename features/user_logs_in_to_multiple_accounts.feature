Feature: User logs in to multiple accounts

  Scenario: Logs in to an account and switches to another using cookies
    Given I am logged in in the account "developers"
    And I have the following accounts:
      | subdomain  |
      | teambox   |
    When I am within the subdomain "teambox"
    Then I should see "Account: teambox"
    And I should not see "Account: developers"


  Scenario: Logs in to an account and switches using the account switcher
    Given I am logged in in the account "developers"
    And I have the following accounts:
      | subdomain  |
      | teambox   |
    When I am within the subdomain "developers"
    When I change to the first account in the account switcher
    Then I should see "Account: teambox"
    And I should not see "Account: developers"
