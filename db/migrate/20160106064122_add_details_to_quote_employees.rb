class AddDetailsToQuoteEmployees < ActiveRecord::Migration
  def change
     add_column :quote_employees, :cost, :float
     add_column :quote_employees, :charge, :float
     add_column :quote_employees, :margin, :float
  end
end
