class PurchaseController < ApplicationController
    before_action :set_purchase, only: [:show, :edit, :update, :destroy]
    def index
       respond_with Purchase.all.to_json( include: {
           purchase_items: { except: [:created_at, :updated_at, :purchase_id]},
           job: { except: [:created_at, :updated_at]}

       }, except: [:created_at, :updated_at]  )
    end
    
    def create
        purchase_items = params[:purchase_items]
        
        @purchase = Purchase.create(purchase_params)
        if !purchase_items.nil?
            purchase_items.each do |item|
               purchase_item =  PurchaseItem.create(item.permit(:item_name,:estimate,:actual,:note,:invoice_number))
               @purchase.purchase_items << purchase_item
            end
        end
        puts @purchase.to_json
        render json: {success: true, data: expand_association(@purchase)}
    end
    
    def update
        status = @purchase.update(purchase_params);
        purchase_items = params[:purchase_items];
        if purchase_items.nil? # empty case, just clear all
            @purchase.purchase_items.clear
        else #with some purchase item
      
            @purchase.purchase_items.each do |purchase_item| 
                index = purchase_items.find_index { |item| item[:id] == purchase_item[:id] } #find existing purchase item
                if !index.nil?
                   purchase_item.update(purchase_items[index].permit(:item_name,:estimate,:actual,:note,:invoice_number)) #update 
                   purchase_items.delete_at(index) # remove from the list to avoid duplication
                else
                   purchase_item.destroy! #remove from the original list
                end
            end
            puts " purchase_items #{purchase_items.to_json}"
            purchase_items.each do |purchase_item|
                new_purchase_item =  PurchaseItem.create(purchase_item.permit(:item_name,:estimate,:actual,:note,:invoice_number))
                @purchase.purchase_items << new_purchase_item
            end
        end
        @purchase.reload #newest version
        render json: {success: status,data: expand_association(@purchase)}
    end
    
    def get_in_range
        @from = params[:start_date]
        @to = params[:end_date];
  
        @purchases = Purchase.where(date_ordered: @from..@to)
        render json: {success: true, data: expand_association(@purchases)}
    end
    
    def destroy
     @status = {success: @purchase.destroy}
     render json: @status
    end
    
    private
    def set_purchase
        @purchase = Purchase.find(params[:id])    
    end
    
    def expand_association(purchase)
       JSON.parse(purchase.to_json( include: {
           purchase_items: { except: [:created_at, :updated_at, :purchase_id]},
           job: { except: [:created_at, :updated_at]}

       }, except: [:created_at, :updated_at]  ))
    end
    
    def purchase_params
       #params.require(:purchase_items)
       params.require(:purchase).permit(:order_by, :date_ordered, :supplier,:date_of_work, :order_type,:job_id, :note)
    end
    
end
