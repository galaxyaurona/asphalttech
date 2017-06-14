class QuoteOther < ActiveRecord::Base
    belongs_to :quote
    
    validates :notes, length: { maximum: 200 }, :allow_blank => true, :allow_nil => true #optional
    validates :name, presence: true
    validates :quote_id, presence: true
    validates :cost, presence: true, :numericality => true
    validates :charge, presence: true, :numericality => true
    validates :other_type, presence: true, :numericality => true
    validates :comments, :allow_blank => true, :allow_nil => true ,length: { maximum: 200 } #optional 
    validates :unit_type, :numericality => true , :allow_blank => true, :allow_nil => true #optional
    validates :rate,:numericality => true, :allow_blank => true, :allow_nil => true #optional
    validates :quantity, :allow_blank => true, :numericality => true, :allow_nil => true #optional
end
