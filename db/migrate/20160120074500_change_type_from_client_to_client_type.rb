class ChangeTypeFromClientToClientType < ActiveRecord::Migration
  def self.up
    rename_column :clients, :type, :client_type
  end
  
  def self.down
    rename_column :clients, :client_type, :type
  end
end
