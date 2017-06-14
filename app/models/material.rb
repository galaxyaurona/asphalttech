class Material < ActiveRecord::Base
   
   before_destroy :flag_mix
   
   has_many :mix_materials, :dependent => :destroy
   has_many :mixes, :through => :mix_materials
   
   validates :name , presence: true , uniqueness: true
   validates  :losses, numericality: true, presence: true 
   validates :price_per_tonne, numericality: true, presence: true
   
   private
      def flag_mix
         self.mixes.each do | mix | 
            # all relavant mix is corrupted
            mix[:corrupted] = true;
            mix.save!;
         end
      end
   
end
