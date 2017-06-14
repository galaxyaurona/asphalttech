class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  respond_to :json
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  
  def index 
    render body: 'Invalid route';
  end
  private 
  
  def record_not_found
    render json: {success:false,msg:"record not found"};
  end
  

end
