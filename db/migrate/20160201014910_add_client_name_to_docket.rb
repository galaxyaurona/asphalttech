class AddClientNameToDocket < ActiveRecord::Migration
  def change
    add_column :jobs, :client_name, :string
  end
end
