class CreateCartageRates < ActiveRecord::Migration
  def change
    create_table :cartage_rates do |t|
      t.integer :km
      t.float :rate

      t.timestamps null: false
    end
  end
end
