class Quote < ActiveRecord::Base
    
    serialize :snapshot, JSON
    
    has_many :quote_employees, dependent: :destroy
    has_many :employees, :through => :quote_employees
    has_many :quote_contractors,  dependent: :destroy
    has_many :sub_contractors, :through => :quote_contractors
    has_many :quote_mixes,  dependent: :destroy
    has_many :mixes, :through => :quote_mixes
    has_many :quote_others, dependent: :destroy
    has_many  :job
    
     
    validates :name, presence: true, length: { in: 0..50 }
    validates :street, length: { in: 0..50 }, :allow_blank => true, :allow_nil => true #optional
    validates :suburb, length: { in: 0..50 }, :allow_blank => true, :allow_nil => true #optional
    validates :quote_no, presence: true
    validates :distance_to_site, presence: true, :numericality => true
    validates :truck_hire, presence: true, :numericality => true
    validates :cost, presence: true, :numericality => true
    validates :charge, presence: true, :numericality => true
    validates :snapshot, presence: true
    validates :quote_type, presence: true, :numericality => true
    
    
    attr_accessor :client_name
    
    def attributes
       super.merge('client_name' => self.client_name); 
    end
    
end
