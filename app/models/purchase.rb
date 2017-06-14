class Purchase < ActiveRecord::Base
  belongs_to :job
  has_many :purchase_items
end
