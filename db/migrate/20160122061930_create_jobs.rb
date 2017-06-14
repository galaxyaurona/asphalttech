class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.string :name
      t.text :notes
      t.integer :client_id
      t.integer :invoice_id
      t.float :amount_payed
      t.float :date_due
      t.integer :quote_id
      
      t.timestamps null: false
    end
  end
end
