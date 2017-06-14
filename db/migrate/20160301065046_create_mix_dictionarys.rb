class CreateMixDictionarys < ActiveRecord::Migration
  def change
    create_table :mix_dictionarys do |t|
      t.integer :mix_id
      t.string :mix_name
      t.timestamps null: false
      
    end
  end
end
