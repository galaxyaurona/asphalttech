class MixMaterialController < ApplicationController
   def index
      @mix_materials = MixMaterial.all
      respond_with @mix_materials
   end
   
   def create
      @mix_material = MixMaterial.create(mix_material_params)
      render json: {success: true}
   end
   
   def mix_material_params
      params.require(:mix_material).permit(:aggregate, :cost, :material_id,:mix_id, :percent)
   end
end
