class CreateQuoteMixes < ActiveRecord::Migration
  def change
    create_table :quote_mixes do |t|
      
      t.integer :quote_id
      t.integer :mix_id
      t.float :thickness
      t.float :area
      t.float :tonnes
      
      t.timestamps null: false
    end
  end
end
