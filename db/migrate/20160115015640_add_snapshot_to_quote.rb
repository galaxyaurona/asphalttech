class AddSnapshotToQuote < ActiveRecord::Migration
  def change
    add_column :quotes, :snapshot, :blob
    add_column :quotes, :client_name, :string
    add_column :quotes, :client_id, :integer
  end
end
