class CreateQuoteContractors < ActiveRecord::Migration
  def change
    create_table :quote_contractors do |t|
      t.integer :sub_contractor_id
      t.integer :quote_id
      t.string :role
      t.float :cost
      t.float :margin
      t.float :charge

      t.timestamps null: false
    end
  end
end
