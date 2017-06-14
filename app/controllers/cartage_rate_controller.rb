class CartageRateController < ApplicationController
   #testing purpose postman only
   skip_before_action :verify_authenticity_token
   
 
  
   def index
      respond_with CartageRate.all
   end
   
   def show
      cartage_rate = CartageRate.find(params[:id]);
      respond_with cartage_rate;
   end
   
   def create
      CartageRate.create(cartage_rate_params)
      @status = {success: true}
      render json: @status
   end
   
   def update
      cartage_rate = CartageRate.find(params[:id]);
      cartage_rate.update(cartage_rate_params)
      @status = {success: true}
      render json: @status
   end
   
   def destroy
      cartage_rate = CartageRate.find(params[:id]);
      cartage_rate.destroy!;
      @status = {success: true}
      render json: @status
   end
   
   # strong params
   private
   def cartage_rate_params
      params.require(:cartage_rate).permit(:km,:rate)
      
   end

   
  
   
end
