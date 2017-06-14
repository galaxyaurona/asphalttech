class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.string :order_by
      t.string :supplier
      t.date :date_ordered
      t.string :order_type
      t.date :date_of_work
      t.references :job, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
