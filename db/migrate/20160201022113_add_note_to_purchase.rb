class AddNoteToPurchase < ActiveRecord::Migration
  def change
    add_column :purchases, :note, :text
  end
end
