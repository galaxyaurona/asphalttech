class CartageRate < ActiveRecord::Base
   validates :km, numericality: { only_integer:true }, presence:true , uniqueness: true
   validates  :rate, numericality: true
end
