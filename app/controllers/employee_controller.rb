class EmployeeController < ApplicationController
   
   def index
      respond_with Employee.all
   end
    
    #TODO Create a method to return the employee without its ID and one to return the employee AND the payment details at once
    def show
      @employee = Employee.find(params[:id]);
      @employee.payment = Payment.find(@employee[:payment_id]);
      respond_with @employee.to_json;
    end
   
   def create
      @employee = Employee.new(employee_params)
      @payment = @employee.create_payment(payment_params)
      
      if @employee.save && @payment.save
        @status = {success: true}
         render json: @status
      else
         @status = {success: false}
         render json: @status
      end
   end
   
   def update
      @employee =  Employee.find(params[:id]);
      @payment = Payment.find(params[:payment_id])
      puts  @employee;
      if @employee.update(employee_params) && @payment.update(payment_params)
          @status = {success: true}
          render json: @status
      else
          @status = {success: false}
          render json: @status
      end
   end
   
    def destroy
      @employee = Employee.find(params[:id]);
      @employee.destroy!;
      @status = {success: true}
      render json: @status
   end
   
   private
   def employee_params
      params.require(:employee).permit(:given_names, :last_name, :contact_no, :notes);
   end
   
   def payment_params
        params.require(:payment).permit(
           :reg_8,:reg_9,:reg_10,:reg_11,:reg_12,
           :night_8,:night_9,:night_10,:night_11,:night_12,
           :sat_4,:sat_5,:sat_6,:sat_7,:sat_8,
           :sun_4,:sun_5,:sun_6,:sun_7,:sun_8);
   end
end