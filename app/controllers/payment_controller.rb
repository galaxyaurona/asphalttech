class PaymentController < ApplicationController
   def show
      @payment = Payment.find(params[:id]);
      respond_with @payment
   end
    
    def create
        @payment = Payment.new(payment_params)
        if @payment.save
         @status = {success: true}
         render json: @status
        else
         @status = {success: false}
         render json: @status
        end
    end
    
     def update
      @payment =  Payment.find(params[:id]);
      puts  @payment;
      respond_with @payment.update(payment_params)
   end
    
    private
    def payment_params
        params.require(:payment).permit(
           :reg_8,:reg_9,:reg_10,:reg_11,:reg_12,
           :night_8,:night_9,:night_10,:night_11,:night_12,
           :sat_4,:sat_5,:sat_6,:sat_7,:sat_8,
           :sun_4,:sun_5,:sun_6,:sun_7,:sun_8);
   end
end