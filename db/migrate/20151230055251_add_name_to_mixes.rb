class AddNameToMixes < ActiveRecord::Migration
  def change
    add_column :mixes, :name, :string
  end
end
