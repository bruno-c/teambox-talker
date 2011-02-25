{
  'in the registered user fieldset' => '#existing_user',
  'in the account switcher' => '#account-switcher',
}.
each do |within, selector|
  Then /^(.+) #{within}$/ do |step|
    with_scope(selector) do
      Then step
    end
  end
end
