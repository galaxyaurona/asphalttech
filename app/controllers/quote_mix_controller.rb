class QuoteMixController < ApplicationController
   def index
      @quote_mixes = QuoteMix.all
      respond_with @quote_mixes
   end
   
   def create
      @quote_mix = QuoteMix.create(quote_mix_params)
      render json: {success: true}
   end
   
   def quote_mix_params
      params.require(:quote_mix).permit(:quote_id, :mix_id, :tonnes, :thickness, :area)
   end
end
