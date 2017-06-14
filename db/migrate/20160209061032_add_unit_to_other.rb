class AddUnitToOther < ActiveRecord::Migration
  def change
    add_column :quote_others, :unit_type, :string
  end
end
