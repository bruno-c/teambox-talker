class AddClearCommandPlugin < ActiveRecord::Migration
  def self.up
    p = Plugin.new
    p.name = 'Clear Command'
    p.description = "Clears the current log with the /clear command (useful when your colleagues post obnoxious gif animations in the log)."
    p.author_id = User.talker.id
    p.shared = true
    p.source = <<-eos
plugin.command = 'clear';
plugin.usage = '/clear';

plugin.onCommand = function(event){
  if (event.command == 'clear') {
    $('#log').html('');
    $('#msgbox').val('');
    return false;
  }
}
    eos
    p.save
    
    Plugin.reset_column_information
    
    Account.all.each do |account|
      account.plugin_installations.create(:plugin_id => p.id)
    end
  end

  def self.down
    p = Plugin.find_by_name('Clear Command')
    
    Account.all.each do |account|
      account.plugin_installations.find_by_plugin_id(p.id).destroy
    end
    
    p.destroy
  end
end
