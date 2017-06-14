class ChangeDocketDateDockets < ActiveRecord::Migration
  def change
    change_column :dockets, :docket_date, :string
  end
end
