class CreateDockets < ActiveRecord::Migration
  def change
    create_table :dockets do |t|
      t.datetime :docket_date
      t.integer :employee_id
      t.integer :mix_id
      t.integer :job_id
      t.float :tonnes_delivered
      
      t.timestamps null: false
    end
  end
end
