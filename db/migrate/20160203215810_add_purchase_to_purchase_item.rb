class AddPurchaseToPurchaseItem < ActiveRecord::Migration
  def change
    add_reference :purchase_items, :purchase, index: true, foreign_key: true
  end
end
