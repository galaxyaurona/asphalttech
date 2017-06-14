class AddCategoryToJob < ActiveRecord::Migration
  def change
    add_column :jobs, :job_type, :integer
  end
end
