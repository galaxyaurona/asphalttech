class CreateQuotes < ActiveRecord::Migration
  def change
    create_table :quotes do |t|
      
      t.string :quote_no
      t.text :notes
      t.float :distance_to_site
      t.float :cartage
      t.float :truck_hire
      
      t.timestamps null: false
    end
  end
end
