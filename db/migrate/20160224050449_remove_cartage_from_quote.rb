class RemoveCartageFromQuote < ActiveRecord::Migration
  def change
      remove_column :quotes, :cartage
  end
end
