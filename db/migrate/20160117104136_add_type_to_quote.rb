class AddTypeToQuote < ActiveRecord::Migration
  def change
    add_column :quotes, :quote_type, :integer
  end
end
