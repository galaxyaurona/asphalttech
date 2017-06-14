class SplitLocationToFieldsOnQuoteJobDocket < ActiveRecord::Migration
  def change
    remove_column :quotes, :location
    add_column :quotes, :street, :string
    add_column :quotes, :suburb, :string
    
    add_column :dockets, :suburb, :string
    add_column :dockets, :street, :string
    
  end
end
