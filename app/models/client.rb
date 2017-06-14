class Client < ActiveRecord::Base
    has_many :contact_people, dependent: :destroy, inverse_of: :client
    has_many :jobs, dependent: :destroy
    has_many :quotes, dependent: :destroy
end
