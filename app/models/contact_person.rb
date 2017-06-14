class ContactPerson < ActiveRecord::Base
    belongs_to :client, inverse_of: :contact_people
end
