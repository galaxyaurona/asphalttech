class AddUnitTypeToContractors < ActiveRecord::Migration
  def change
    add_column :quote_contractors, :unit_type, :string
    add_column :quote_contractors, :comments, :string
  end
end
