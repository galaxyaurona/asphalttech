class AddCorruptedToMix < ActiveRecord::Migration
  def change
    add_column :mixes, :corrupted, :boolean
  end
end
