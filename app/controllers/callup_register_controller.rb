class CallupRegisterController < ApplicationController
   before_action :set_callup_register, only: [:show, :edit, :update, :destroy]
   skip_before_action :verify_authenticity_token
   @period = {}
   def index
       respond_with CallupRegister.all
   end
   
   def today

      #@callups = CallupRegister.where("last_triggered_date >= :start_of_day AND last_triggered_date <= :end_of_day", {start_of_day: DateTime.no.beginning_of_day, end_of_day: DateTime.now.end_of_day}) 
      set_date
      @callups = CallupRegister.where(last_triggered_date: @period['today'])
      puts "period #{@period}"
      render json: {success: true,data: @callups}
   end
   
   def tomorrow
      set_date
      @callups = CallupRegister.where(next_due_date: @period['tomorrow'])
   
      render json: {success: true,data:@callups}
   end
   
   def this_week
      set_date
      @callups = CallupRegister.where(next_due_date: @tomorrow..@end_of_week) + CallupRegister.where(last_triggered_date: @today)
      render json: {success: true,data:@callups}
   end
   
   def this_month
      set_date
      @callups = CallupRegister.where(next_due_date: @tomorrow..@end_of_month) + CallupRegister.where(last_triggered_date: @today)
      render json: {success: true,data:@callups}
   end
   
   def get_in_range
      set_date
      range = params[:range]
      
      puts range
      if (range == 'today')
         @callups = CallupRegister.where(last_triggered_date: @period['today'])
      elsif (range =='tomorrow')
         @callups = CallupRegister.where(next_due_date: @period['tomorrow'])
      else
         @callups = CallupRegister.where(next_due_date: @period['today']..@period[range]) + CallupRegister.where(last_triggered_date: @period['today'])
      end
      render json: {success: true,data:@callups,day: @period[range] }
   end
   
   def show
   
   end
   
   
   def update
      status = @callup_register.update(callup_register_params)
      render json: {success: status, data: @callup_register}
   end
   
   def create
      @callup_register = CallupRegister.create(callup_register_params)
      puts @callup_register.to_json
      render json: {success: true, data: @callup_register}
   end
   
   def destroy
      @status = {success: @callup_register.destroy}
      render json: @status
   end
   
   private 
      def set_date
         @period = {"today" => DateTime.current.beginning_of_day.utc,
         "tomorrow" => DateTime.current.days_since(1).beginning_of_day.utc,
         "end_of_month" => DateTime.current.end_of_month.beginning_of_day.utc,
         "end_of_week" => DateTime.current.end_of_week.beginning_of_day.utc,
         "end_of_year" => DateTime.current.end_of_year.beginning_of_day.utc,
         "seven_days" => Date.current.days_since(7).beginning_of_day.utc,
         "a_month" => Date.current.months_since(1).beginning_of_day.utc,
         "three_months" => Date.current.months_since(3).beginning_of_day.utc,
         "six_months" => Date.current.months_since(6).beginning_of_day.utc,
         "a_year" => Date.current.years_since(1).beginning_of_day.utc,
         }
      end
      
      def set_callup_register
         @callup_register = CallupRegister.find(params[:id])
      end
      
      def callup_register_params
         #params.require(:mix_materials)
         params.require(:callup_register).permit(:name, :category, :repeat_amount,:repeat_unit,:next_due_date, :note)
      end
end
