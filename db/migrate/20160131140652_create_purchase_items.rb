class CreatePurchaseItems < ActiveRecord::Migration
  def change
    create_table :purchase_items do |t|
      t.string :item_name
      t.float :estimate
      t.float :actual
      t.text :note
      t.string :invoice_number

      t.timestamps null: false
    end
  end
end
