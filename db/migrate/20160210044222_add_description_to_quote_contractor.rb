class AddDescriptionToQuoteContractor < ActiveRecord::Migration
  def change
    add_column :quote_contractors, :description, :string
  end
end
