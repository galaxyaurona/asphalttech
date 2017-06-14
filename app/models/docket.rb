class Docket < ActiveRecord::Base
    belongs_to :job
    belongs_to :employee
    belongs_to :mix
    validates :docket_no, uniqueness: true
end
