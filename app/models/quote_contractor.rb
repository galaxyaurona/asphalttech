class QuoteContractor < ActiveRecord::Base
    belongs_to :quote
    belongs_to :sub_contractor
    
    validates :notes, length: { maximum: 200 }
end
