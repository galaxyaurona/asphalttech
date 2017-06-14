class AddDayDetailsToQuoteEmployee < ActiveRecord::Migration
  def change
    add_column :quote_employees, :days, :integer
    add_column :quote_employees, :nights, :integer
    add_column :quote_employees, :saturdays, :integer
    add_column :quote_employees, :sundays, :integer
  end
end
