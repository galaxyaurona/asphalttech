class AddDateToJob < ActiveRecord::Migration
  def change
    add_column :jobs, :job_date, :string
  end
end
