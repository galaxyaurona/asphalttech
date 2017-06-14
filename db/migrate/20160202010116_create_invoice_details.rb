class CreateInvoiceDetails < ActiveRecord::Migration
  def change
    create_table :invoice_details do |t|
      t.integer :job_id
      t.integer :invoice_no
      t.float :total_charge
      t.float :gst
      
      t.timestamps null: false
    end
  end
end
