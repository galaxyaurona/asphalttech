class ChangeQuoteOthersDescription < ActiveRecord::Migration
  def change
    remove_column :quote_others, :description
    add_column :quote_others, :notes, :text
  end
end
