class MaterialController < ApplicationController
    #testing purpose postman only
   skip_before_action :verify_authenticity_token
   def index
      respond_with Material.all
   end
   
   def show
      material = Material.find(params[:id]);
   end
   
   def create
      
      newMaterial = Material.create(material_params)
      @status = {success: !newMaterial.errors.any?,msg: newMaterial.errors, data: newMaterial}
      render json: @status
   end
   
   def update
 
      material = Material.find(params[:id]);

      result = material.update(material_params)
      puts material.errors
      if result
         @status = {success: true,msg: "success" }
      else
         @status = {success:false,msg: material.errors}
      end
      render json: @status
   end
   
   def destroy
      material = Material.find(params[:id]);
      material.destroy!;
      @status = {success: true}
      render json: @status
   end
   
   # strong params
   private
   def material_params
      params.require(:material).permit(:name,:losses,:price_per_tonne)
      
   end
end
