class AddNoToDocket < ActiveRecord::Migration
  def change
    add_column :dockets, :mix_name, :string
    add_column :dockets, :employee_name, :string
    add_column :dockets, :docket_no, :string,  :unique => true
  end
end
