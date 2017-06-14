class DocketController < ApplicationController
   #This will probably not be needed since the job controller will be handling any creation etc of dockets - just incase we change to have a docket page instead
   def index
      respond_with Docket.all
   end
    
   
    def show
      @docket = Docket.find(params[:id]);
      respond_with @docket
    end
   
   def create
      @docket = Docket.new(docket_params)
      
      if @docket.save
        @status = {success: true}
         render json: @status
      else
         @status = {success: false}
         render json: @status
      end
   end
   
   def update
      @docket =  Docket.find(params[:id]);
      puts  @docket;
      if @docket.update(docket_params)
          @status = {success: true}
          render json: @status
      else
          @status = {success: false}
          render json: @status
      end
   end
   
    def destroy
      @docket = Docket.find(params[:id]);
      @docket.destroy!;
      @status = {success: true}
      render json: @status
   end
   
   private
   def docket_params
      params.require(:docket).permit(:docket_date, :employee_id, :mix_id, :job_id, :tonnes_delivered, :mix_name, :employee_name, :docket_no, :suburb, :street);
   end
end