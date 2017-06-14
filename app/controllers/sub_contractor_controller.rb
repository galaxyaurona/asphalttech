class SubContractorController < ApplicationController
   
   def index
      respond_with SubContractor.all
   end
    
    #TODO Create a method to return the employee without its ID and one to return the employee AND the payment details at once
    def show
      @contractor = SubContractor.find(params[:id]);
      respond_with @contractor
    end
   
   def create
      @contractor = SubContractor.new(sub_contractor_params)
      
      if @contractor.save
        @status = {success: true}
         render json: @status
      else
         @status = {success: false}
         render json: @status
      end
   end
   
   def update
      @contractor =  SubContractor.find(params[:id]);
      puts  @contractor;
      if @contractor.update(sub_contractor_params)
          @status = {success: true}
          render json: @status
      else
          @status = {success: false}
          render json: @status
      end
   end
   
    def destroy
      @contractor = SubContractor.find(params[:id]);
      @contractor.destroy!;
      @status = {success: true}
      render json: @status
   end
   
   private
   def sub_contractor_params
      params.require(:sub_contractor).permit(:name, :description, :contact_no, :email);
   end
end