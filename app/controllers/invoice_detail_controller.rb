class InvoiceDetailController < ApplicationController
   
   def index
      respond_with InvoiceDetail.all
   end
    
    #TODO Create a method to return the employee without its ID and one to return the employee AND the payment details at once
    def show
      invoice = Invoice.find(params[:id]);
      invoice.docket_list = dockets;
    
      respond_with invoice
    end
   
   def create
      @invoice = InvoiceDetail.new(invoice_params)
      
      if @invoice.save
        @status = {success: true}
         render json: @status
      else
         @status = {success: false}
         render json: @status
      end
   end
   
   def update
      @invoice =  InvoiceDetail.find(params[:id]);
      
      puts  @invoice;
      if @invoice.update(invoice_params)
          @status = {success: true}
          render json: @status
      else
          @status = {success: false}
          render json: @status
      end
   end
   
    def destroy
      @invoice = InvoiceDetail.find(params[:id]);
      @invoice.destroy!;
      @status = {success: true}
      render json: @status
   end
   
   private
   def invoice_params
      params.require(:invoice).permit(:invoice_no, :total_charge, :gst);
   end
   
end