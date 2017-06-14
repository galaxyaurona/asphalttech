class JobController < ApplicationController
   require 'roo'
   require 'tempfile'
   
   def index
      respond_with Job.all
   end
    
    #TODO Create a method to return the employee without its ID and one to return the employee AND the payment details at once
    def show
      job = Job.find(params[:id]);
      dockets = Docket.where(job_id: job[:id]);
      job.docket_list = dockets;
    
      respond_with job
    end
    
   def full
    puts "in full id #{params[:id]}"
    @job = Job.find(params[:id]);
    render json: {success: true, data: expand_association(@job)}
   end
   
   def create
      @job = Job.new(job_params)
      
      if @job.save
        @status = {success: true}
         render json: @status
      else
         @status = {success: false}
         render json: @status
      end
   end
   
   def update
      @job =  Job.find(params[:id]);
      dockets = params[:docket_list];
      remove_dockets = params[:remove_dockets];
      
      if !dockets.nil?
          dockets.each do |docket|
              if Docket.exists?(docket[:id])
                  found_docket = Docket.find(docket[:id]);
                  found_docket.update(docket.permit(:employee_id,:mix_id,:docket_date,:docket_no,:tonnes_delivered,:employee_name,:mix_name,:street,:suburb));
              else
                 new_docket = Docket.create(docket.permit(:employee_id,:mix_id,:docket_date,:docket_no,:tonnes_delivered,:employee_name,:mix_name,:street,:suburb));
                 @job.dockets << new_docket;
              end
          end
      end
      if !remove_dockets.nil?
          remove_dockets.each do |docket|
            @found = Docket.find(docket[:id]);
            @found.destroy!;
          end
      end
    
      puts  @job;
      if @job.update(job_params)
          @status = {success: true}
          render json: @status
      else
          @status = {success: false}
          render json: @status
      end
   end
   
    def upload_docket
        @job = Job.find(params[:id]);
        total_errors = [];
        docket_file = Tempfile.new("temp_data");
        docket_file.write params[:upload_docket];
        docket_file.rewind
        docket_csv = Roo::Spreadsheet.open(docket_file, extension: :csv);
        #puts docket_csv.info;
        
        column_length = docket_csv.sheet(0).last_column
        #If the header is set first then it will (for some reason) set the last_row to = 0
        headers = docket_csv.sheet(0).row(1)
        #get the number of rows aside from the header and for each, do.
        (2..(docket_csv.sheet(0).last_row - 1)).each do |i|
            data = docket_csv.sheet(0).row(i);
            tester = Hash[headers.zip(data)];
            new_docket = Docket.new();
            new_docket.docket_date = tester['Date'];
            new_docket.docket_no = tester['Docket No'];
            new_docket.tonnes_delivered = tester['Tonnes'];
            new_docket.mix_name = tester['Product'];
           
            found_mix = Mix.where('lower(name) = ?', tester['Product'].downcase);
            if found_mix.any?
                new_docket.mix_id = found_mix[0].id;
                new_docket.save
                if new_docket.errors.any?
                    temp = {error:new_docket.errors.to_json, number:tester['Docket No']};
                    total_errors << temp
                else
                    @job.dockets << new_docket
                end
            
            else
                temp = {error:(" Mix not found in database: " + tester['Product']),number:tester['Docket No']};
                total_errors << temp;
            end
            
            
        end
        @status = {success:!total_errors.any?,errors:total_errors}
        render json: @status
    end
   
    def destroy
      @job = Job.find(params[:id]);
      @job.destroy!;
      @status = {success: true}
      render json: @status
   end
   
   private
   def job_params
      params.require(:job).permit(:name,:notes,:client_id,:invoice_id,:quote_id,:amount_payed,:due_date, :job_type,:client_name,:job_date);
   end
   
    def expand_association(job)
       JSON.parse(job.to_json( include: {
           dockets: { include: [ :mix , :employee] ,
                except: [:created_at, :updated_at, :job_id]},
           client: {  include: [ :contact_people ],
                except: [:created_at, :updated_at]},
           quote: { except: [:created_at, :updated_at]}

       }, except: [:created_at, :updated_at]  ))
    end
   
end