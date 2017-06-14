class AddDurationToQuote < ActiveRecord::Migration
  def change
    add_column :quotes, :duration, :integer
  end
end
