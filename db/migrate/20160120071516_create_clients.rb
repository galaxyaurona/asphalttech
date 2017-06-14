class CreateClients < ActiveRecord::Migration
  def change
    create_table :clients do |t|
      t.string :name
      t.string :postal_address
      t.string :email
      t.decimal :credit_limit
      t.integer :payment_term
      t.string :type
      t.text :note
      t.decimal :credit_status

      t.timestamps null: false
    end
  end
end
