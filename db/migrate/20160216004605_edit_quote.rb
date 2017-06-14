class EditQuote < ActiveRecord::Migration
  def change
    remove_column :quotes, :client_name
    add_column :quotes, :description, :string
  end
end
