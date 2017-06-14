class CreateQuoteOthers < ActiveRecord::Migration
  def change
    create_table :quote_others do |t|

      t.string :name
      t.integer :quote_id
      t.text :description
      t.float :cost
      t.float :charge
      t.integer :other_type
      
      t.timestamps null: false
    end
  end
end
