class Employee < ActiveRecord::Base
    belongs_to :payment, dependent: :destroy
    has_many :quote_employees
    has_many :quotes, :through => :quote_employees
    
    validates :given_names, presence: true, length: { in: 0..60 }
    validates :last_name, presence: true, length: { in: 0..50 }
    validates :contact_no, presence: true, length: { in: 0..20 }
    validates :notes, length: { maximum: 200 }
    
    attr_accessor :details, :payment
    
    def attributes
       super.merge('details' => self.details,"payment" => self.payment); 
    end
    
end
