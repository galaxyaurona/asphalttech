class QuoteEmployeeController < ApplicationController
   def index
      @quote_employee = QuoteEmployee.all
      respond_with @quote_employee
   end
   
   def create
      @quote_employee = QuoteEmployee.create(quote_employee_params)
      render json: {success: true}
   end
   
   def destroy
      @employee = QuoteEmployee.find(params[:id]);
      @employee.destroy!;
      @status = {success: true}
      render json: @status
    end
   
   private
   def quote_employee_params
      params.require(:quote_employee).permit(:charge, :cost, :quote_id,:employee_id, :margin)
   end
end
