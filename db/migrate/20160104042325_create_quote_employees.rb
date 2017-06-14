class CreateQuoteEmployees < ActiveRecord::Migration
  def change
    create_table :quote_employees do |t|

      t.integer :employee_id
      t.integer :quote_id
      t.timestamps null: false
    end
  end
end
