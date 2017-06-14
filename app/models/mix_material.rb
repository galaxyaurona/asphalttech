class MixMaterial < ActiveRecord::Base
   belongs_to :material
   belongs_to :mix
end
