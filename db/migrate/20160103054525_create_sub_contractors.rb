class CreateSubContractors < ActiveRecord::Migration
  def change
    create_table :sub_contractors do |t|
      t.timestamps null: false
    end
  end
end
