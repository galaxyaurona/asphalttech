class CreateEmployees < ActiveRecord::Migration
  def change
    create_table :employees do |t|
      t.references :payment, index:true
      t.string :given_names
      t.string :last_name
      t.string :contact_no
      t.text :notes
      
      t.timestamps null: false
    end
    #add_foreign_key :employees, :payments
  end
end
