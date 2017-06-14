class AddQuoteCommentToOther < ActiveRecord::Migration
  def change
    add_column :quote_others, :comments, :string
  end
end
