class AddTypeNameToQuoteContractor < ActiveRecord::Migration
  def change
    add_column :quote_contractors, :contractor_type, :integer
  end
end
