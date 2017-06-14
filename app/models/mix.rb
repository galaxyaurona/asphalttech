class Mix < ActiveRecord::Base
   has_many :mix_materials, :dependent => :destroy
   has_many :materials, :through => :mix_materials
   has_many :quote_mixes
   has_many :quotes, :through => :quote_mixes
   
   def self.to_csv
      attributes = %w{id name note price_per_tonne}
      
      CSV.generate(headers: true) do |csv|
         csv << attributes
         
         all.each do |mix|
            csv << attributes.map{ |attr| mix.send(attr) }
         end
         
      end
   end
   
   attr_accessor :details
     
     def attributes
       super.merge('details' => self.details); 
     end
   
end
