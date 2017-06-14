class CreateCallupRegisters < ActiveRecord::Migration
  def change
    create_table :callup_registers do |t|
      t.string :name
      t.string :category
      t.datetime  :last_triggered_date
      t.datetime  :next_due_date
      t.integer :repeat_amount
      t.string :repeat_unit
      t.text :note

      t.timestamps null: false
    end
  end
end
