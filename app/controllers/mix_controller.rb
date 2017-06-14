class MixController < ApplicationController
  before_action :set_mix, only: [:show, :edit, :update, :destroy, :uncorrupted]
  skip_before_action :verify_authenticity_token

  def index
    @mixes = Mix.all;
    
    @mixes.each do | mix |
      recalculateCost(mix)
    end
    
    respond_with @mixes.to_json( include: {
      mix_materials: { include: { material: { except: [:created_at,:updated_at] } }, except: [:created_at, :updated_at, :mix_id,:material_id] }
    }, except: [:created_at, :updated_at]  )
  end
  
  # handle the user mark something as uncorrupted
  def uncorrupted
    @mix.corrupted = false;
    render json: { success: @mix.save!}
  end

  def show
    recalculateCost(@mix)
    respond_with expand_association(@mix)
  end

  def create
    mix_materials = params[:mix_materials];
    @mix = Mix.create(mix_params)
    @mix[:corrupted] = false;
    if !mix_materials.nil? 
      mix_materials.each do |mix_material|
        mix_material[:material_id] = mix_material[:material][:id]
        new_mix_material = MixMaterial.create(mix_material.permit(:aggregate, :cost, :material_id,:mix_id, :percent));
        @mix.mix_materials << new_mix_material
      end
    end
    @status = {success: !@mix.errors.any?,msg: @mix.errors, data: expand_association(@mix)}
    render json: @status

  end

  def update

    sub_status = true
    mix_materials = params[:mix_materials];
    status = @mix.update(mix_params)
    if mix_materials.nil? # empty case, just clear all
      @mix.mix_materials.clear
    else #with some materials
      
      @mix.mix_materials.each do |mix_material|
        index = mix_materials.find_index { |item| item[:material][:id] == mix_material[:material_id] }
        if index.nil?
          mix_material.destroy
        else
          new_mix_material = mix_materials[index];
        
          mix_material.cost = new_mix_material[:cost];
          mix_material.aggregate = new_mix_material[:aggregate];
          mix_material.percent = new_mix_material[:percent];
          sub_status = sub_status & mix_material.save!
          # destroy to remove duplicate
          mix_materials.delete_at(index)
        end
      end
    
      # create new mix_material
 
      mix_materials.each do |mix_material|
        mix_material[:material_id] = mix_material[:material][:id]
        new_mix_material = MixMaterial.create(mix_material.permit(:aggregate, :cost, :material_id,:mix_id, :percent));
        @mix.mix_materials << new_mix_material
      end
  end
    @mix.reload # to reflect change
    @status = {success: status & sub_status, data: expand_association(@mix)}
    render json: @status
  end

  def destroy
    @status = {success: @mix.destroy}
    render json: @status
  end

  private
    
    def recalculateCost(mix)
      mix.price_per_tonne = 0;
      mix.mix_materials.each do | mix_material |

        mix_material.cost = mix_material.percent/100 * mix_material.material.price_per_tonne * (mix_material.material.losses/100 + 1 )
        mix.price_per_tonne += mix_material.cost;
      end
    end
  
    # Use callbacks to share common setup or constraints between actions.
    
    def expand_association(mix)
      JSON.parse(mix.to_json( include: {
          mix_materials: { include: { material: { except: [:created_at,:updated_at] } }, except: [:created_at, :updated_at, :mix_id,:material_id] }
        }, except: [:created_at, :updated_at]  ))
    end
    
    def set_mix
      @mix = Mix.find(params[:id])
    end

    def mix_params
      #params.require(:mix_materials)
      params.require(:mix).permit(:name, :price_per_tonne, :note,:mix_materials)
    end
end
