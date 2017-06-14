class QuoteContractorController < ApplicationController
   def index
      @quote_contractors = QuotContractor.all
      respond_with @quote_contractors
   end
   
   def create
      @quote_contractor = QuotContractor.create(quote_employee_params)
      render json: {success: true}
   end
   
   def quote_contractor_params
      params.require(:quote_contractor).permit(:sub_contractor_id, :quote_id, :cost, :charge, :quantity, :rate, :notes)
   end
end
