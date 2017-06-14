class Payment < ActiveRecord::Base
    has_one :employee
    
    validates :reg_8 , presence: true
    validates :reg_9 , presence: true
    validates :reg_10 , presence: true
    validates :reg_11 , presence: true
    validates :reg_12 , presence: true
    
    validates :night_8 , presence: true
    validates :night_9 , presence: true
    validates :night_10 , presence: true
    validates :night_11 , presence: true
    validates :night_12 , presence: true
    
    validates :sat_4 , presence: true
    validates :sat_5 , presence: true
    validates :sat_6 , presence: true
    validates :sat_7 , presence: true
    validates :sat_8 , presence: true
    
    validates :sun_4 , presence: true
    validates :sun_5 , presence: true
    validates :sun_6 , presence: true
    validates :sun_7 , presence: true
    validates :sun_8 , presence: true
end
