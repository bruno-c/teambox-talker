Feature: User adds chat rooms

  Scenario: Add a chat room in one domain
    Given I am logged in in the account "teambox"
    And the user has the following accounts:
      | subdomain  |
      | codegram   |
    And I am within the account "teambox"
    And I follow "Rooms"
    And I follow "Add a room"
    And I fill in "Name" with "Main Room"
    And I fill in "Description" with "Description for main room"
    When I press "Create"
    Then I should see "Main Room"
