class AddVisitsToQuote < ActiveRecord::Migration
  def change
    add_column :quotes, :visits, :integer
  end
end
