class CreateMaterials < ActiveRecord::Migration
  def change
    create_table :materials do |t|
      t.string :name
      t.float :losses
      t.float :price_per_tonne

      t.timestamps null: false
    end
  end
end
