class InvoiceDetail < ActiveRecord::Base
    belongs_to :job
    
    validates :invoice_no, uniqueness: true
end
