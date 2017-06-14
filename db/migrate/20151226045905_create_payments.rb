class CreatePayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.float :reg_8
      t.float :reg_9
      t.float :reg_10
      t.float :reg_11
      t.float :reg_12
      t.float :night_8
      t.float :night_9
      t.float :night_10
      t.float :night_11
      t.float :night_12
      t.float :sat_4
      t.float :sat_5
      t.float :sat_6
      t.float :sat_7
      t.float :sat_8
      t.float :sun_4
      t.float :sun_5
      t.float :sun_6
      t.float :sun_7
      t.float :sun_8

      t.timestamps null: false
    end
    add_foreign_key :employees, :payments
  end
end
