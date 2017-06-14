class AddCostChargeToQuote < ActiveRecord::Migration
  def change
    add_column :quotes, :cost, :float
    add_column :quotes, :charge, :float
    add_column :quotes, :name, :string
    add_column :quotes, :location, :string
  end
end
