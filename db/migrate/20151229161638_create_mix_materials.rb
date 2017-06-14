class CreateMixMaterials < ActiveRecord::Migration
  def change
    create_table :mix_materials do |t|
      t.integer :mix_id
      t.integer :material_id
      t.float :aggregate
      t.float :percent
      t.float :cost

      t.timestamps null: false
    end
  end
end
