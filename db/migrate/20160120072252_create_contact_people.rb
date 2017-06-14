class CreateContactPeople < ActiveRecord::Migration
  def change
    create_table :contact_people do |t|
      t.string :name
      t.string :role
      t.string :email
      t.string :office_contact
      t.string :mobile_contact
      t.references :client

      t.timestamps null: false
    end
  end
end
