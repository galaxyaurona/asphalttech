class ClientController < ApplicationController
    before_action :set_client, only: [:show, :edit, :update, :destroy]
    def index
      @clients = Client.all;
      respond_with @clients.to_json( include: {
           contact_people: { except: [:created_at, :updated_at, :client_id]}
         }, except: [:created_at, :updated_at]  )
    end
   
    def create
      contact_people = params[:contact_people]
      @client = Client.create(client_params);
      if !contact_people.nil?
        contact_people.each do |contact_person|
          new_contact_person = ContactPerson.create(contact_person.permit(:name,:role,:email,:office_contact,:mobile_contact))
          @client.contact_people << new_contact_person
        end
      end
      @status = {success: !@client.errors.any?,msg: @client.errors, data: expand_association(@client)}
      render json: @status
        
    end
    
    def show
      @client = Client.find(params[:id]);
      respond_with @client.to_json(except:[:created_at, :updated_at]);
    end
    
    def destroy

      @status = {success: @client.destroy,msg: @client.errors}
      render json: @status
    end
    
    def get_client_job
      client_name = params[:client_name]
      job_name = params[:job_name]
      #@result = Client.joins(:jobs).uniq.where("clients.name LIKE ? AND jobs.name LIKE ?","%#{client_name}%", "%#{job_name}%").distinct
      # this is for location, constraint is every job has to has a quote
      #@result = Quote.joins(job: :client).select("jobs.id,clients.name as client_name,jobs.name,quotes.location").where("clients.name LIKE ?","%#{client_name}%")
      @result = Client.joins(:jobs).select("jobs.id,clients.name as client_name,jobs.name").where("clients.name LIKE ? AND jobs.name LIKE ?","%#{client_name}%","%#{job_name}%")
      puts @result
      render json: {success: true, data: @result}
    end
    
    def update
      sub_status = true
      contact_people = params[:contact_people];
      status = @client.update(client_params);
      if contact_people.nil? # empty case, just clear all
          @client.contact_people.clear
      else #with some contact perspn
          @client.contact_people.each do |contact_person|
            index = contact_people.find_index { |item| item[:id] == contact_person[:id] }
            if index.nil? # if it doesn't exist in new list
              contact_person.destroy
            else
              new_contact_person = contact_people[index]
              contact_person.name = new_contact_person[:name]
              contact_person.role = new_contact_person[:role]
              contact_person.email = new_contact_person[:email]
              contact_person.office_contact = new_contact_person[:office_contact]
              contact_person.mobile_contact = new_contact_person[:mobile_contact]
              sub_status = sub_status & contact_person.save! # one fail everything fail
              contact_people.delete_at(index) # remove from the list
            end
          end
          contact_people.each do |contact_person| # adding new contact person which is not removed from the list
            new_contact_person = ContactPerson.create(contact_person.permit(:name,:role,:email,:office_contact,:mobile_contact))
             @client.contact_people << new_contact_person
          end
      end
      @client.reload # to reflect change
      @status = {success: status & sub_status, data: expand_association(@client)}
      render json: @status
    end
   
    private 
    
    def expand_association(client)
       JSON.parse(client.to_json( include: {
           contact_people: { except: [:created_at, :updated_at, :client_id]}
         }, except: [:created_at, :updated_at]  ))
    end
    
    def expand_association_with_job(client)
       JSON.parse(client.to_json( include: {
           contact_people: { except: [:created_at, :updated_at, :client_id]
             
           } , jobs: { except: [:created_at, :updated_at, :client_id] } 
       } ,except: [:created_at, :updated_at]  ))
    end
    
    
    def set_client
       @client = Client.find(params[:id])
    end
    
    def client_params
       #params.require(:mix_materials)
       params.require(:client).permit(:name, :email, :postal_address,:client_type, :credit_limit,:payment_term,:credit_status,:note)
    end
   
end
