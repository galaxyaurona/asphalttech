class CreateMixes < ActiveRecord::Migration
  def change
    create_table :mixes do |t|
      #t.references :mix_material_set, index: true, foreign_key: true
      t.float :price_per_tonne
      t.text :note

      t.timestamps null: false
    end
  end
end
