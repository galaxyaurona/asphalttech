class DeleteMixDictionarys < ActiveRecord::Migration
  def change
      drop_table :mix_dictionarys
  end
end
