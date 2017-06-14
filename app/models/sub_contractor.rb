class SubContractor < ActiveRecord::Base
    has_many :quote_contractors
    has_many :quotes, :through => :quote_contractors
    
     validates :name, presence: true, length: { in: 0..60 }
     validates :contact_no, presence: true, length: { in: 0..20 }
     validates :description, length: { maximum: 200 }
     
     attr_accessor :details
     
     def attributes
       super.merge('details' => self.details); 
     end
end
