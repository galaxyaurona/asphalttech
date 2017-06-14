class AddQuantityRateCategory < ActiveRecord::Migration
  def change
    add_column :quote_contractors, :quantity, :float
    add_column :quote_contractors, :rate, :float
    add_column :quote_contractors, :notes, :text
  end
end
