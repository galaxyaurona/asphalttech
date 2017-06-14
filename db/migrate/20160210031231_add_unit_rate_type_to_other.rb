class AddUnitRateTypeToOther < ActiveRecord::Migration
  def change
    add_column :quote_others, :rate, :float
    add_column :quote_others, :quantity, :float
  end
end
