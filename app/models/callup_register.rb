class CallupRegister < ActiveRecord::Base
   before_save :calculate_next_due_date_no_save
   after_find :calculate_next_due_date
   


   # this method is to calculate the next due date if the date is in the past
   def calculate_next_due_date
      recal = false;
      while (!self.next_due_date.nil? && self.next_due_date.past?)
         recal = true;
         self.last_triggered_date = self.next_due_date;
         if (self.repeat_amount == 0 || self.repeat_amount.nil?)
            self.next_due_date = nil
         else 
            if (self.repeat_unit == "Day")
               self.next_due_date = self.last_triggered_date.days_since(self.repeat_amount)
            elsif (self.repeat_unit == "Week")
               self.next_due_date = self.last_triggered_date.weeks_since(self.repeat_amount)
            elsif (self.repeat_unit =="Month")
               self.next_due_date = self.last_triggered_date.months_since(self.repeat_amount)
            else 
               self.next_due_date = self.last_triggered_date.years_since(self.repeat_amount)
            end
         end
      end
      if recal #prevent multiple unneed save 
         self.save
      end
   end
   def calculate_next_due_date_no_save
      while (!self.next_due_date.nil? && self.next_due_date.past?) 
         self.last_triggered_date = self.next_due_date;
         if (self.repeat_amount == 0 || self.repeat_amount.nil?)
            self.next_due_date = nil
         else 
            if (self.repeat_unit == "Day")
               self.next_due_date = self.last_triggered_date.days_since(self.repeat_amount)
            elsif (self.repeat_unit == "Week")
               self.next_due_date = self.last_triggered_date.weeks_since(self.repeat_amount)
            elsif (self.repeat_unit =="Month")
               self.next_due_date = self.last_triggered_date.months_since(self.repeat_amount)
            else 
               self.next_due_date = self.last_triggered_date.years_since(self.repeat_amount)
            end
         end
      end
   end
end
