class QuoteMix < ActiveRecord::Base
    belongs_to :mix
    belongs_to :quote
end
