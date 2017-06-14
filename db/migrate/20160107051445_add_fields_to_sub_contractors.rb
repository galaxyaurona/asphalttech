class AddFieldsToSubContractors < ActiveRecord::Migration
  def change
    add_column :sub_contractors, :name, :string
    add_column :sub_contractors, :description, :string
    add_column :sub_contractors, :contact_no, :string
    add_column :sub_contractors, :email, :string
  end
end
