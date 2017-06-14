class Job < ActiveRecord::Base
    belongs_to :quote
    has_one :invoice_detail
    has_many :dockets, dependent: :destroy
    belongs_to :client 

    
    #TODO: Fix JOB DATEEEEE
     validates :client_id, presence: true,  numericality: { only_integer: true, message: "Invalid Client ID"  }
     validates :name, presence: true, length: { maximum: 50, message: "Name cannot be greater than 50 characters" }
     validates :notes, length: {maximum: 200, message: "Notes must not be longer than 200 characters" }
     validates :job_date, presence: {message: "Job Date not selected!" }
     validates :job_type, presence: true, numericality: { only_integer: true, message: "Job outside of 0..2", in: 0..2 }
     validates :invoice_id, numericality: { only_integer: true , message: "Invoice ID Invalid" }, :allow_blank => true, :allow_nil => true
     attr_accessor :docket_list

    def attributes
       super.merge('docket_list' => self.dockets); 
    end
end
