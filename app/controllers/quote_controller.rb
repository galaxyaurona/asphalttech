class QuoteController < ApplicationController
   
   def index
      @quotes = Quote.all
      if !@quotes.nil?
          @quotes.each do |q|
            q.client_name = q.snapshot['quote']['client_name'];
          end
      end
      respond_with @quotes.to_json(except: [:updated_at,
      :notes, :distance_to_site, :truck_hire, :charge, :cost, :snapshot, :client_id,:visits,:description])
   end
    
    #TODO Create a method to return the employee without its ID and one to return the employee AND the payment details at once
    def show
      quote = Quote.find(params[:id]);
      quote_employees = QuoteEmployee.where(quote_id: params[:id]);
      quote_contractors = QuoteContractor.where(quote_id: params[:id]);
      quote_mixes = QuoteMix.where(quote_id: params[:id]);
      quote_others = QuoteOther.where(quote_id: params[:id]);
      mixes = [];
      contractors = [];
      employees = [];
      others = [];
      if !quote_employees.nil?
          quote_employees.each do |quote_employee|
              found_employee = Employee.find(quote_employee[:employee_id]);
              found_employee.details = quote_employee.as_json(except: [:created_at, :updated_at, :employee_id]);
            employees << found_employee
        end
      end
      if !quote_contractors.nil?
          quote_contractors.each do |contractor|
              found_contractor = SubContractor.find(contractor[:sub_contractor_id]);
              found_contractor.details = contractor.as_json(except: [:created_at, :updated_at]);
             contractors << found_contractor;
          end
      end
      if !quote_mixes.nil?
          quote_mixes.each do |mix|
              found_mix = Mix.find(mix[:mix_id]);
              found_mix.details = mix.as_json(except: [:created_at, :updated_at]);
             mixes << found_mix;
          end
      end
      if !quote_others.nil?
          quote_others.each do |other|
             others << other;
          end
      end
      respond_with 'quote' => quote, 'employees' => employees, 'contractors' => contractors, 'mixes' => mixes, 'others' => others
    end
    
   
   def create
        quote_employees = params[:quote_employees];
        quote_contractors = params[:quote_contractors];
        quote_mixes = params[:quote_mixes];
        quote_others = params[:quote_others];
        
        quote = Quote.new(quote_params);
        quote.snapshot = params[:snapshot].as_json;
        quote.save;
        if !quote_employees.nil?
          quote_employees.each do |quote_employee|
            new_quote_employee = QuoteEmployee.create(quote_employee.permit(:charge, :cost, :quote_id, :employee_id, :margin, :days, :nights, :saturdays, :sundays));
            quote.quote_employees << new_quote_employee
            end
        end
        if !quote_contractors.nil?
            quote_contractors.each do |quote_contractor|
                new_quote_contractor = QuoteContractor.create(quote_contractor.permit(:sub_contractor_id, :quote_id, :cost, :charge,:contractor_type, :quantity, :rate, :notes,:unit_type,:comments,:description));
                quote.quote_contractors << new_quote_contractor
         end
        end
        if !quote_mixes.nil?
            quote_mixes.each do |quote_mix|
                new_quote_mix = QuoteMix.create(quote_mix.permit(:quote_id, :mix_id, :tonnes, :thickness, :area));
                quote.quote_mixes << new_quote_mix
            end
        end
        if !quote_others.nil?
            quote_others.each do |other|
                new_other = QuoteOther.create(other.permit(:name, :description, :other_type, :cost, :charge, :notes,:rate,:unit_type,:quantity,:comments));
                quote.quote_others << new_other
            end
        end
        @status = {success: !quote.errors.any?,msg: quote.errors}
        render json: @status
   end
   
   def update
        quote_employees = params[:quote_employees];
        quote_contractors = params[:quote_contractors];
        quote_mixes = params[:quote_mixes];
        quote_others = params[:quote_others];
        
        delete_employees = params[:quote_delete_employees];
        delete_contractors = params[:quote_delete_contractors];
        delete_mixes = params[:quote_delete_mixes];
        delete_others = params[:quote_delete_others];
        
      @quote =  Quote.find(params[:id]);
      @quote.snapshot = params[:snapshot].as_json;
      @quote.update(quote_params);
      #update methods
      if !quote_employees.nil?
        quote_employees.each do |quote_employee|
            if QuoteEmployee.exists?(quote_employee[:id])
                found_quote_employee = QuoteEmployee.find(quote_employee[:id]);
                found_quote_employee.update(quote_employee.permit(:charge, :cost, :quote_id, :employee_id, :margin, :days, :nights, :saturdays, :sundays));
            else
                #TODO: make sure this checks if the employee exists, if it doesnt this should not be made
                new_quote_employee = QuoteEmployee.create(quote_employee.permit(:charge, :cost, :quote_id, :employee_id, :margin, :days, :nights, :saturdays, :sundays));
                @quote.quote_employees << new_quote_employee
            end
        end
      end
      if !quote_contractors.nil?
          quote_contractors.each do |contractor|
              if QuoteContractor.exists?(contractor[:id])
                 found_quote_contractor = QuoteContractor.find(contractor[:id]);
                 found_quote_contractor.update(contractor.permit(:sub_contractor_id, :quote_id, :cost, :charge,:contractor_type, :quantity, :rate, :notes,:unit_type,:comments,:description));
             else
                @quote.quote_contractors << QuoteContractor.create(contractor.permit(:sub_contractor_id, :quote_id, :cost, :charge,:contractor_type, :quantity, :rate, :notes,:unit_type,:comments,:description)); 
              end
          end
      end
      if !quote_mixes.nil?
          quote_mixes.each do |mix|
              if QuoteMix.exists?(mix[:id])
                found_quote_mix = QuoteMix.find(mix[:id]);
                found_quote_mix.update(mix.permit(:quote_id, :mix_id, :tonnes, :thickness, :area));
            else
                @quote.quote_mixes << QuoteMix.create(mix.permit(:quote_id, :mix_id, :tonnes, :thickness, :area));
            end
          end
      end
      if !quote_others.nil?
          quote_others.each do |other|
              if QuoteOther.exists?(other[:id])
                  found_quote_other = QuoteOther.find(other[:id]);
                  found_quote_other.update(other.permit(:name, :description, :other_type, :cost, :charge, :notes,:rate,:unit_type,:quantity,:comments));
              else
                  @quote.quote_others << QuoteOther.create(other.permit(:name, :description, :other_type, :cost, :charge, :notes,:rate,:unit_type,:quantity,:comments));
              end
          end
      end
      if !delete_employees.nil?
          delete_employees.each do |del|
              @found = QuoteEmployee.where(employee_id: del[:id]).take;
              @found.destroy;
          end
      end
      if !delete_contractors.nil?
          delete_contractors.each do |del|
              @found = QuoteContractor.where(sub_contractor_id: del[:id]).take;
              @found.destroy;
          end
      end
      if !delete_mixes.nil?
          delete_mixes.each do |del|
              @found = QuoteMix.where(mix_id: del[:id]).take;
              @found.destroy;
          end
      end
      if !delete_others.nil?
          delete_others.each do |del|
              @found = QuoteOther.where(id: del[:id]).take;
              @found.destroy;
          end
      end
      
      @status = {success: !@quote.errors.any?,msg: @quote.errors}
        render json: @status
   end
   
    def destroy
      @quote = Quote.find(params[:id]);
      @quote.destroy!;
      @status = {success: true}
      render json: @status
    end
   
   def duplicate_quote
      quote = Quote.find(params[:id]);
      quote_employees = QuoteEmployee.where(quote_id: params[:id]);
      quote_contractors = QuoteContractor.where(quote_id: params[:id]);
      quote_mixes = QuoteMix.where(quote_id: params[:id]);
      quote_others = QuoteOther.where(quote_id: params[:id]);
      
      new_quote = quote.dup;
      new_quote.name = new_quote.name + ' (d)';
      new_quote.save;
      if !quote_employees.nil?
          quote_employees.each do |qe|
            new_qe = qe.dup;
            new_quote.quote_employees << new_qe;
          end
      end
      if !quote_contractors.nil?
          quote_contractors.each do |qc|
            new_qc = qc.dup;
            new_quote.quote_contractors << new_qc;
          end
      end
      if !quote_mixes.nil?
          quote_mixes.each do |qm|
            new_qm = qm.dup;
            new_quote.quote_mixes << new_qm;
          end
      end
      if !quote_others.nil?
          quote_others.each do |qo|
            new_qo = qo.dup;
            new_quote.quote_others << new_qo;
          end
      end
      
      @status = {success: !new_quote.errors.any?,msg: new_quote.errors}
        render json: @status
   end
   
   def generate_quote
    #ref https://github.com/prawnpdf/prawn
    order_list = params[:order_list];
    found_quote = Quote.find(params[:id]);
    quote_employees = found_quote.quote_employees;
    quote_contractors = found_quote.quote_contractors
    quote_mixes = found_quote.quote_mixes;
    found_mixes = QuoteMix.where(quote_id: params[:id]);
    quote_others = found_quote.quote_others;
    
    
    respond_to do |format|
      format.json { render json: {success: true} }
      #Could just have the user send back what they got in order to generate the quote but its more stable to do it server side
      
      format.pdf do
        pdf = Prawn::Document.new(:page_size => "A4", :page_layout => :portrait)
        pdf.font "Times-Roman"
        #pdf.stroke_axis
        #pdf.stroke_axis(:at => [0, 0], :height => 1000, :step_length => 50,
            #:negative_axes_length => 5, :color => '0000FF')
        pdf.bounding_box([0, 725], :width => 150, :height => 30) do
            pdf.text "138 Freight Drive" , :size => 11, :font => :Helvetica
            pdf.text "Somerton Vic 3062", :size => 11, :font => :Courier
            #pdf.stroke_bounds
        end
        pdf.bounding_box([150, 800], :width => 225, :height => 65) do
            #filename = "#{Rails.root}/asphaltech.jpg"
            #pdf.image filename, :at => [150,750]
            #pdf.stroke_bounds
            pdf.text "Image here", :align => :center
        end
         pdf.bounding_box([150, 725], :width => 225, :height => 30) do
            
        end
        pdf.bounding_box([375, 725], :width => 150, :height => 30) do
            pdf.text "Phone: 03 9303 7833", :align => :right, :size => 11
            pdf.text "Fax: 03 9303 7844""", :align => :right, :size => 11
            #pdf.stroke_bounds
        end
        pdf.stroke_horizontal_rule
        pdf.move_down 10
        pdf.text "QUOTATION", :align => :center, :size => 20
        pdf.move_down 5
        pdf.text "Quote Number: " + "Param here", :size => 14
        
        pdf.bounding_box([0,630], :width => 50, :height => 30) do
            pdf.text "To:", :size => 11
            pdf.text "Attention:", :size => 11
            #pdf.stroke_bounds
        end
        pdf.bounding_box([50,630], :width => 250, :height => 30) do
            pdf.text found_quote.snapshot['quote']['client_name'], :size => 11
            pdf.text params[:attention], :size => 11
            #pdf.stroke_bounds
        end
        pdf.bounding_box([310,630], :width => 40, :height => 30) do
            pdf.text "Date:", :size => 11
            pdf.text "Fax No:", :size => 11
            #pdf.stroke_bounds
        end
        pdf.bounding_box([340, 630], :width => 180 , :height => 30) do
            pdf.text params[:pdf_date], :align => :right, :size => 11
            pdf.text "03 9303 7844", :align => :right, :size => 11
            #pdf.stroke_bounds
        end
        pdf.stroke_horizontal_rule
         pdf.bounding_box([0, 580], :width => 300 , :height => 20) do
            pdf.text "We have the pleasure in submitting our price as follows:", :size => 11
            #pdf.stroke_bounds
        end
        pdf.bounding_box([20, 560], :width => 300 , :height => 15) do
            pdf.text "Job Description: ", :size => 11
            #pdf.stroke_bounds
        end
        if !found_quote.notes.nil?
            pdf.bounding_box([180, 560], :width => 345 , :height => 15) do
                pdf.text found_quote.notes, :size => 11
                #pdf.stroke_bounds
            end
        end
        pdf.bounding_box([20, 545], :width => 300 , :height => 15) do
            pdf.text "Location: ", :size => 11
            #pdf.stroke_bounds
        end
        pdf.bounding_box([180, 545], :width => 300 , :height => 15) do
            if !found_quote.street.nil? && !found_quote.suburb.nil?
                pdf.text found_quote.street + " " + found_quote.suburb, :size => 11
            elsif !found_quote.street.nil? && found_quote.suburb.nil?
                 pdf.text found_quote.street, :size => 11
            elsif found_quote.street.nil? && !found_quote.suburb.nil?
                 pdf.text found_quote.suburb, :size => 11
            end
            #pdf.stroke_bounds
        end
        pdf.bounding_box([20, 530], :width => 300 , :height => 15) do
            pdf.text "No of visits for asphalt: ", :size => 11
            #pdf.stroke_bounds
        end
        pdf.bounding_box([180, 530], :width => 300 , :height => 15) do
            pdf.text "#{found_quote.visits}", :size => 11
            #pdf.stroke_bounds
        end
        pdf.bounding_box([20, 515], :width => 300 , :height => 15) do
            pdf.text "Quote type: ", :size => 11
            #pdf.stroke_bounds
        end
        pdf.bounding_box([180, 515], :width => 300 , :height => 15) do
            if found_quote.quote_type == 0
                 pdf.text "Supply & Lay", :size => 11
            elsif found_quote.quote_type == 1
                pdf.text "Supply & Deliver", :size => 11
            else
                pdf.text "Supply", :size => 11
            end
            #pdf.stroke_bounds
        end
        pdf.stroke_horizontal_rule
        
        #Now we only display based on the type of quote
        if params[:quote_pdf_type] == 1 #If the user chose a "per mix" quote to be generated
            puts "generating material pdf";
            #Initial categories
            pdf.bounding_box([0,490], :width => 80, :height => 15) do
                pdf.text "Product", :size => 11, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([100,490], :width => 100, :height => 15) do
                #pdf.stroke_bounds
            end
            pdf.bounding_box([200,490], :width => 50, :height => 15) do
                pdf.text "Thickness", :size => 11, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([250,490], :width => 40, :height => 15) do
                pdf.text "Qty", :size => 11, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([290,490], :width => 50, :height => 15) do
                pdf.text "Unit", :size => 11, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([340,490], :width => 75, :height => 15) do
                pdf.text "Unit Rate", :size => 11, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([340,480], :width => 75, :height => 15) do
                pdf.text "(GST Excl)", :size => 8, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([415,490], :width => 110, :height => 15) do
                pdf.text "Comments", :size => 11, :style => :bold
                #pdf.stroke_bounds
            end
            # End initial categories
            
            # Calculating the relevant costs for the mixes to be displayed
            if !quote_mixes.nil?
                y_axis = 460;
                mix_index = 0;
                mix_list = found_quote.snapshot['mixes'];
                total_tonnes = 0;
                individual_others = [];
                individual_contractors = [];
                additional_tonnage_charge = 0;
                additional_total_charge = 0;
                additional_tonnage_cost = 0;
                additional_total_cost = 0;
                labor_charge = (found_quote.snapshot['quote']['costing']['employee_charge']);
                labor_cost = (found_quote.snapshot['quote']['costing']['employee_cost']);
                
                #get the total tonnage
                 quote_mixes.each do |mix|
                     total_tonnes += mix.tonnes;
                 end
                 
                 #add contractors to their apropriate $ location
                 if !quote_contractors.nil?
                     quote_contractors.each do |con|
                        if con.contractor_type == 0
                            individual_contractors << con;
                        elsif con.contractor_type == 1
                            additional_tonnage_charge += con.charge;
                            additional_tonnage_cost += con.cost;
                        elsif con.contractor_type == 2
                            labor_charge += con.charge;
                            labor_cost += con.cost;
                        end
                     end
                 end
                #add others to their apropriate $ location
                if !quote_others.nil?
                     quote_others.each do |other|
                        if other.other_type == 0
                            individual_others << other;
                        elsif other.other_type ==1
                            additional_tonnage_charge += other.charge;
                            additional_tonnage_cost += other.cost;
                        else
                            labor_cost += other.cost;
                        end
                     end
                end
                 
                 temp_total = 0;
                 
                 # Once the initial calulations are done we can add the relevant values to each of the mixes, we copy some of the information to keep the original
                quote_mixes.each do |mix|
                    mix_list[mix_index]['pdf_charge'] = deep_copy(mix_list[mix_index]['charge']/mix.tonnes);
                    mix_list[mix_index]['pdf_charge'] += additional_tonnage_charge/total_tonnes + labor_charge/total_tonnes + found_quote.snapshot['quote']['costing']['cartage'] 
                    + ((found_quote.truck_hire * found_quote.visits)/total_tonnes);
                    
                    mix_list[mix_index]['pdf_cost'] = deep_copy(mix_list[mix_index]['cost']/mix.tonnes);
                    mix_list[mix_index]['pdf_cost'] += additional_tonnage_charge/total_tonnes + labor_charge/total_tonnes + found_quote.snapshot['quote']['costing']['cartage'] 
                    + ((found_quote.truck_hire * found_quote.visits)/total_tonnes);
                    
                    mix_list[mix_index]['details'] = deep_copy(found_mixes[mix_index]); #adding the actual saved mix details since we need this, not ideal but at this stage neither is re-coding half the quote
                    temp_total += mix_list[mix_index]['pdf_charge'] * mix.tonnes;
                    mix_index += 1;
                    
                end
                #end calculations
                
                
                #Displaying of the actual quote content
                if !order_list.nil? && order_list.length > 0
                    order_list.each do |order|
                        if order[:item_type] == 0 #then it is a mix
                            found_item = mix_list.find {|m| m['details']['id'] == order[:id]};
                        elsif order[:item_type] == 1 # contractor
                            found_item = quote_contractors.find {|c| c.id == order[:id]}
                            temp_total += found_item.charge;
                        elsif order[:item_type] == 2 # other
                            found_item = quote_others.find {|o| o.id == order[:id]}
                            temp_total += found_item.charge;
                        else
                            found_item = order;
                        end
                        
                        if found_item == nil
                           #then the user has not saved their changes and this item will simply not appear on the quote
                           #It would be good to send the client back something to alert the user of this but currently that is impossible
                        else
                            #all green
                            if y_axis < 50 
                                pdf.start_new_page;
                                pdf.bounding_box([0, 725], :width => 150, :height => 30) do
                                    pdf.text "138 Freight Drive" , :size => 11, :font => :Helvetica
                                    pdf.text "Somerton Vic 3062", :size => 11, :font => :Courier
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([150, 800], :width => 225, :height => 65) do
                                    #filename = "#{Rails.root}/asphaltech.jpg"
                                    #pdf.image filename, :at => [150,750]
                                    #pdf.stroke_bounds
                                    pdf.text "Image here", :align => :center
                                end
                                 pdf.bounding_box([150, 725], :width => 225, :height => 30) do
                                    
                                end
                                pdf.stroke_horizontal_rule
                                #additional page title content
                                pdf.bounding_box([0, 725], :width => 150, :height => 30) do
                                    pdf.text "138 Freight Drive" , :size => 11, :font => :Helvetica
                                    pdf.text "Somerton Vic 3062", :size => 11, :font => :Courier
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([150, 800], :width => 225, :height => 65) do
                                    #filename = "#{Rails.root}/asphaltech.jpg"
                                    #pdf.image filename, :at => [150,750]
                                    #pdf.stroke_bounds
                                    pdf.text "Image here", :align => :center
                                end
                                 pdf.bounding_box([150, 725], :width => 225, :height => 30) do
                                    
                                end
                                pdf.bounding_box([375, 725], :width => 150, :height => 30) do
                                    pdf.text "Phone: 03 9303 7833", :align => :right, :size => 11
                                    pdf.text "Fax: 03 9303 7844""", :align => :right, :size => 11
                                    #pdf.stroke_bounds
                                end
                                pdf.stroke_horizontal_rule
        
                                #Additional page Initial categories
                                pdf.bounding_box([0,680], :width => 80, :height => 15) do
                                    pdf.text "Product", :size => 11, :style => :bold
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([100,680], :width => 100, :height => 15) do
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([200,680], :width => 50, :height => 15) do
                                    pdf.text "Thickness", :size => 11, :align => :center, :style => :bold
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([250,680], :width => 40, :height => 15) do
                                    pdf.text "Qty", :size => 11, :align => :center, :style => :bold
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([290,680], :width => 50, :height => 15) do
                                    pdf.text "Unit", :size => 11, :align => :center, :style => :bold
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([340,680], :width => 75, :height => 15) do
                                    pdf.text "Unit Rate", :size => 11, :align => :center, :style => :bold
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([340,670], :width => 75, :height => 15) do
                                    pdf.text "(GST Excl)", :size => 8, :align => :center, :style => :bold
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([415,680], :width => 110, :height => 15) do
                                    pdf.text "Comments", :size => 11, :style => :bold
                                    #pdf.stroke_bounds
                                end
                                # End Additional initial categories
                                y_axis = 660;
                            end
                            if order[:item_type] == 0 #display a mix
                            temp_mix = Mix.find(found_item['mix_id']);
                                pdf.bounding_box([10,y_axis], :width => 100, :height => 15) do
                                    pdf.text "Asphalt", :size => 11
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([100,y_axis], :width => 100, :height => 15) do
                                    pdf.text temp_mix.name, :size => 11
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([200,y_axis], :width => 50, :height => 15) do
                                    pdf.text "#{ found_item['details'].thickness.round(2)}", :size => 11, :align => :center
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([250,y_axis], :width => 40, :height => 15) do
                                    pdf.text "#{ found_item['details'].tonnes.round(2)}", :size => 11, :align => :center
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([290,y_axis], :width => 50, :height => 15) do
                                    pdf.text "t", :size => 11, :align => :center
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([340,y_axis], :width => 75, :height => 15) do
                                   
                                    pdf.text "$" + "#{found_item['pdf_charge'].round(2).to_json}", :size => 11, :align => :center
                                    #pdf.stroke_bounds
                                end
                                 y_axis -= 20;
                                
                                 #end mix display
                            elsif order[:item_type] == 3 #Then display a comment
                                #calculate the needed lines in order to not go over other content, this is 100% corret but issues only occur if someone goes and spams 150 capital letters
                                #would like to redo this to work in a way that doesnt require such a shoddy sollution
                                comment_lines = (found_item[:name].length/90.00).ceil;
                                pdf.bounding_box([10,y_axis], :width => 515, :height => (comment_lines * 15)) do
                                    pdf.text found_item[:name], :size => 11, :style => :italic
                                    #pdf.stroke_bounds
                                end
                                y_axis -= (comment_lines * 15) + 10;
                            else #display the contractor/other item_type
                                if order[:item_type] == 1
                                    pdf.bounding_box([10,y_axis], :width => 180, :height => 15) do
                                        pdf.text found_item['description'], :size => 11
                                        #pdf.stroke_bounds
                                    end
                                else
                                    pdf.bounding_box([10,y_axis], :width => 180, :height => 15) do
                                        pdf.text found_item['name'], :size => 11
                                        #pdf.stroke_bounds
                                    end
                                end
                                pdf.bounding_box([180,y_axis], :width => 70, :height => 15) do
                                    pdf.text "", :size => 11, :align => :center
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([250,y_axis], :width => 40, :height => 15) do
                                    pdf.text "#{found_item.quantity}", :size => 11, :align => :center
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([290,y_axis], :width => 50, :height => 15) do
                                    pdf.text found_item.unit_type, :size => 11, :align => :center
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([340,y_axis], :width => 75, :height => 15) do
                                   
                                    pdf.text "$" + "#{found_item.rate}", :size => 11, :align => :center
                                    #pdf.stroke_bounds
                                end
                                pdf.bounding_box([415,y_axis], :width => 115, :height => 15) do
                                    pdf.text found_item.comments, :size => 11
                                    #pdf.stroke_bounds
                                end
                                y_axis -= 20;
                            end
                        end
                    end
                end #End order if order list not null
                
            else
                #Then this quote is a service quote or none were added, this should be a seperate case and thus is in error
                respond_with json: {success: false,message:"An error has occured"}
            end #end if quote mixes null statement
            pdf.pad(10) { pdf.stroke_horizontal_rule }
            
            pdf.pad(10) {pdf.text "Thank you for your enquiry and we trust we can be of service.", :size => 11}
            
             pdf.pad(10) {pdf.text "Regards", :size => 11}
            pdf.text "Daniel Ajzner", :style => :bold, :size => 11
            pdf.text "GENERAL MANAGER", :style => :bold, :size => 12
            pdf.text "Mobile: 0428 283 817"
            pdf.text "Email: daniel@asphaltech.com.au"
             pdf.pad(30){
            pdf.text "DEBUG Comes to: $" + "#{temp_total}"
             }
             
            
            #now we add the relevant data to the existing mix list and save it, this is used in the invoice generation in order to give the user some default values when they add an existing mix to it
            found_quote.snapshot['mixes'] = mix_list;
            found_quote.save();
        end#end if quote type == 1
        if params[:quote_pdf_type] == 2 #Single cost + other items in the "single charge" type that have a negative value
            pdf.pad(10) { pdf.stroke_horizontal_rule }
            
            pdf.pad(10) {pdf.text "Thank you for your enquiry and we trust we can be of service.", :size => 11}
            
             pdf.pad(10) {pdf.text "Regards", :size => 11}
            pdf.text "Daniel Ajzner", :style => :bold, :size => 11
            pdf.text "GENERAL MANAGER", :style => :bold, :size => 12
            pdf.text "Mobile: 0428 283 817"
            pdf.text "Email: daniel@asphaltech.com.au"
             pdf.pad(30){
            pdf.text "DEBUG Comes to: $" + "#{temp_total}"
             }
        end
        if params[:quote_pdf_type] == 3 #Survice quote
            temp_total = 0; #running total for debug purposes, will be used for totals later
            y_axis = 460;
            puts "generating service pdf";
            #Initial categories
            pdf.bounding_box([0,490], :width => 80, :height => 15) do
                pdf.text "Product", :size => 11, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([100,490], :width => 100, :height => 15) do
                #pdf.stroke_bounds
            end
            pdf.bounding_box([200,490], :width => 50, :height => 15) do
                pdf.text "Qty", :size => 11, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([250,490], :width => 40, :height => 15) do
                pdf.text "Unit", :size => 11, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([290,490], :width => 50, :height => 15) do
                pdf.text "Unit Rate", :size => 11, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([290,480], :width => 60, :height => 15) do
                pdf.text "(GST Excl)", :size => 8, :align => :center, :style => :bold
                #pdf.stroke_bounds
            end
            pdf.bounding_box([350,490], :width => 110, :height => 15) do
                pdf.text "Comments", :size => 11, :style => :bold
                #pdf.stroke_bounds
            end
            # End initial categories
            
            if !order_list.nil? && order_list.length > 0
                order_list.each do |order|
                    if order[:item_type] == 0 #then it is a mix
                        #It shouldnt exist, if it does do nothing with it
                    elsif order[:item_type] == 1 # contractor
                        found_item = quote_contractors.find {|c| c.id == order[:id]}
                        temp_total += found_item.charge;
                    elsif order[:item_type] == 2 # other
                        found_item = quote_others.find {|o| o.id == order[:id]}
                        temp_total += found_item.charge;
                    else
                        found_item = order;
                    end
                    
                    if found_item == nil
                       #then the user has not saved their changes and this item will simply not appear on the quote
                       #It would be good to send the client back something to alert the user of this but currently that is impossible
                    else
                        #all green
                        if y_axis < 50 
                            pdf.start_new_page;
                            #additional page title content
                            pdf.bounding_box([0, 725], :width => 150, :height => 30) do
                                pdf.text "138 Freight Drive" , :size => 11, :font => :Helvetica
                                pdf.text "Somerton Vic 3062", :size => 11, :font => :Courier
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([150, 800], :width => 225, :height => 65) do
                                #filename = "#{Rails.root}/asphaltech.jpg"
                                #pdf.image filename, :at => [150,750]
                                #pdf.stroke_bounds
                                pdf.text "Image here", :align => :center
                            end
                             pdf.bounding_box([150, 725], :width => 225, :height => 30) do
                                
                            end
                            pdf.bounding_box([375, 725], :width => 150, :height => 30) do
                                pdf.text "Phone: 03 9303 7833", :align => :right, :size => 11
                                pdf.text "Fax: 03 9303 7844""", :align => :right, :size => 11
                                #pdf.stroke_bounds
                            end
                            pdf.stroke_horizontal_rule
    
                            #Additional page Initial categories
                            pdf.bounding_box([0,690], :width => 80, :height => 15) do
                                pdf.text "Product", :size => 11, :style => :bold
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([100,685], :width => 100, :height => 15) do
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([200,685], :width => 50, :height => 15) do
                                pdf.text "Qty", :size => 11, :align => :center, :style => :bold
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([250,685], :width => 40, :height => 15) do
                                pdf.text "Unit", :size => 11, :align => :center, :style => :bold
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([290,685], :width => 50, :height => 15) do
                                pdf.text "Unit Rate", :size => 11, :align => :center, :style => :bold
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([290,675], :width => 50, :height => 15) do
                                pdf.text "(GST Excl)", :size => 8, :align => :center, :style => :bold
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([350,685], :width => 110, :height => 15) do
                                pdf.text "Comments", :size => 11, :style => :bold
                                #pdf.stroke_bounds
                            end
                            # End Additional initial categories
                            y_axis = 660;
                        end
                        if order[:item_type] == 0 #display a mix
                            #Then again, this should not exist
                        elsif order[:item_type] == 3 #Then display a comment
                            #calculate the needed lines in order to not go over other content, this is 100% corret but issues only occur if someone goes and spams 150 capital letters
                            #would like to redo this to work in a way that doesnt require such a shoddy sollution
                            comment_lines = (found_item[:name].length/90.00).ceil;
                            pdf.bounding_box([10,y_axis], :width => 515, :height => (comment_lines * 15)) do
                                pdf.text found_item[:name], :size => 11, :style => :italic
                                #pdf.stroke_bounds
                            end
                            y_axis -= (comment_lines * 15) + 10;
                        else #display the contractor/other item_type
                            if order[:item_type] == 1
                                pdf.bounding_box([10,y_axis], :width => 180, :height => 15) do
                                    pdf.text found_item['description'], :size => 11
                                    #pdf.stroke_bounds
                                end
                            else
                                pdf.bounding_box([10,y_axis], :width => 180, :height => 15) do
                                    pdf.text found_item['name'], :size => 11
                                    #pdf.stroke_bounds
                                end
                            end
                            pdf.bounding_box([180,y_axis], :width => 70, :height => 15) do
                                pdf.text "", :size => 11, :align => :center
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([250,y_axis], :width => 40, :height => 15) do
                                pdf.text "#{found_item.quantity}", :size => 11, :align => :center
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([290,y_axis], :width => 50, :height => 15) do
                                pdf.text found_item.unit_type, :size => 11, :align => :center
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([340,y_axis], :width => 75, :height => 15) do
                               
                                pdf.text "$" + "#{found_item.rate}", :size => 11, :align => :center
                                #pdf.stroke_bounds
                            end
                            pdf.bounding_box([415,y_axis], :width => 115, :height => 15) do
                                pdf.text found_item.comments, :size => 11
                                #pdf.stroke_bounds
                            end
                            y_axis -= 20;
                        end
                    end
                end
            end #End order if order list not null
            pdf.pad(10) { pdf.stroke_horizontal_rule }
            
            pdf.pad(10) {pdf.text "Thank you for your enquiry and we trust we can be of service.", :size => 11}
            
             pdf.pad(10) {pdf.text "Regards", :size => 11}
            pdf.text "Daniel Ajzner", :style => :bold, :size => 11
            pdf.text "GENERAL MANAGER", :style => :bold, :size => 12
            pdf.text "Mobile: 0428 283 817"
            pdf.text "Email: daniel@asphaltech.com.au"
             pdf.pad(30){
            pdf.text "DEBUG Comes to: $" + "#{temp_total}"
             }
        end
        #now we do the last information page
         pdf.start_new_page;
            pdf.bounding_box([0, 725], :width => 150, :height => 30) do
                pdf.text "138 Freight Drive" , :size => 11, :font => :Helvetica
                pdf.text "Somerton Vic 3062", :size => 11, :font => :Courier
                #pdf.stroke_bounds
            end
            pdf.bounding_box([150, 800], :width => 225, :height => 65) do
                #filename = "#{Rails.root}/asphaltech.jpg"
                #pdf.image filename, :at => [150,750]
                #pdf.stroke_bounds
                pdf.text "Image here", :align => :center
            end
             pdf.bounding_box([150, 725], :width => 225, :height => 30) do
                
            end
            pdf.bounding_box([375, 725], :width => 150, :height => 30) do
                pdf.text "Phone: 03 9303 7833", :align => :right, :size => 11
                pdf.text "Fax: 03 9303 7844""", :align => :right, :size => 11
                #pdf.stroke_bounds
            end
            pdf.stroke_horizontal_rule
            pdf.move_down 10
            pdf.text "QUOTATION", :align => :center, :size => 20
            pdf.move_down 5
            pdf.text "Quote Number: " + "Param here", :size => 14
            
            pdf.bounding_box([0,630], :width => 50, :height => 30) do
                pdf.text "To:", :size => 11
                pdf.text "Attention:", :size => 11
                #pdf.stroke_bounds
            end
            pdf.bounding_box([50,630], :width => 250, :height => 30) do
                pdf.text found_quote.snapshot['quote']['client_name'], :size => 11
                pdf.text params[:attention], :size => 11
                #pdf.stroke_bounds
            end
            pdf.bounding_box([310,630], :width => 40, :height => 30) do
                pdf.text "Date:", :size => 11
                pdf.text "Fax No:", :size => 11
                #pdf.stroke_bounds
            end
            pdf.bounding_box([340, 630], :width => 180 , :height => 30) do
                pdf.text params[:pdf_date], :align => :right, :size => 11
                pdf.text "03 9303 7844", :align => :right, :size => 11
                #pdf.stroke_bounds
            end
            pdf.stroke_horizontal_rule
            pdf.pad(10) do
              pdf.text "Conditions", :size => 14
            end
            pdf.bounding_box([10, 570], :width => 20 , :height => 30) do
                pdf.text "1", :size => 11
            end
            pdf.bounding_box([30, 570], :width => 470 , :height => 40) do
                pdf.text "Unit rates apply to work being undertaken during business hours Monday to Friday. Surcharge of 30% over and above quoted rate to apply if client directs Asphaltech Pty Ltd to undertake works other than other than business hours Monday to Friday.", :size => 10
            end
            pdf.bounding_box([10, 530], :width => 20 , :height => 30) do
                pdf.text "2", :size => 11
            end
            pdf.bounding_box([30, 530], :width => 470 , :height => 40) do
                pdf.text "The number of site establishment(s) included in the unit rate are shown on page 1 of the quote; Subsequent establishment(s) will incur a charge of $1000 (GST Excl)", :size => 10
            end
            pdf.bounding_box([10, 500], :width => 20 , :height => 30) do
                pdf.text "3", :size => 11
            end
            pdf.bounding_box([30, 500], :width => 470 , :height => 40) do
                pdf.text "A contiguous and continuous area to be available to Asphaltech Pty Ltd or nominated subcontractor prior to establishing onsite. Areas less than this shall incur smaller quantity surcharge based on area made available.", :size => 10
            end
            pdf.bounding_box([10, 470], :width => 20 , :height => 30) do
                pdf.text "4", :size => 11
            end
            pdf.bounding_box([30, 470], :width => 470 , :height => 40) do
                pdf.text "Unit rates are not inclusive of traffic management. In the event traffic management is required, Asphaltech Pty Ltd will charge client market rate plus 10% administration fee.", :size => 10
            end
            pdf.bounding_box([10, 440], :width => 20 , :height => 30) do
                pdf.text "5", :size => 11
            end
            pdf.bounding_box([30, 440], :width => 470 , :height => 40) do
                pdf.text "Unit rates are not inclusive of cold planing. In the event cold planing is required, Asphaltech Pty Ltd will charge client market rate plus 10% administration fee.", :size => 10
            end
            pdf.bounding_box([10, 410], :width => 20 , :height => 30) do
                pdf.text "6", :size => 11
            end
            pdf.bounding_box([30, 410], :width => 470 , :height => 40) do
                pdf.text "Pavement cleansing requiring more than one pass with a rotary broom shall be the responsibility of the client.", :size => 10
            end
            pdf.bounding_box([10, 390], :width => 20 , :height => 30) do
                pdf.text "7", :size => 11
            end
            pdf.bounding_box([30, 390], :width => 470 , :height => 40) do
                pdf.text "Site to facilitate ingress/egress of a tandem tipper. Where delivery by tandem tipper is not possible additional charges to apply for alternate means of loading paver.", :size => 10
            end
            pdf.bounding_box([10, 360], :width => 20 , :height => 30) do
                pdf.text "8", :size => 11
            end
            pdf.bounding_box([30, 360], :width => 470 , :height => 40) do
                pdf.text "Unit rates not inclusive of linemarking. In the event it is required Asphaltech Pty Ltd will charge client market rate plus 10% administration fee.", :size => 10
            end
            pdf.bounding_box([10, 330], :width => 20 , :height => 30) do
                pdf.text "9", :size => 11
            end
            pdf.bounding_box([30, 330], :width => 470 , :height => 40) do
                pdf.text "Unit rates not inclusive of Handwork. In the event handwork is required an additional $75/tonne surcharge to apply.", :size => 10
            end
            pdf.bounding_box([10, 310], :width => 20 , :height => 30) do
                pdf.text "10", :size => 11
            end
            pdf.bounding_box([30, 310], :width => 470 , :height => 40) do
                pdf.text "Unit rates have no provision for the raising/lowering of manhole/valve covers. In the event such adjustments are required Asphaltech Pty Ltd will charge client market rate plus 10% administration fee.", :size => 10
            end
            pdf.bounding_box([10, 280], :width => 20 , :height => 30) do
                pdf.text "11", :size => 11
            end
            pdf.bounding_box([30, 280], :width => 470 , :height => 40) do
                pdf.text "Unit rates not inclusive of site allowance, in the event site allowance applies Asphaltech Pty Ltd to charge client total man hours worked by site allowance hourly rate.", :size => 10
            end
            pdf.bounding_box([10, 250], :width => 20 , :height => 30) do
                pdf.text "12", :size => 11
            end
            pdf.bounding_box([30, 250], :width => 470 , :height => 40) do
                pdf.text "Unit rates subject to rise and fall. Calculation of rise and fall to be in accordance with Vic Roads standard specification section 199 \"Provision for Adjustment of Contract Sum\".", :size => 10
            end
            pdf.bounding_box([10, 220], :width => 20 , :height => 30) do
                pdf.text "13", :size => 11
            end
            pdf.bounding_box([30, 220], :width => 470 , :height => 40) do
                pdf.text "Payment terms - 30 calendar days from date of invoice.", :size => 10
            end
            pdf.bounding_box([10, 200], :width => 20 , :height => 30) do
                pdf.text "14", :size => 11
            end
            pdf.bounding_box([30, 200], :width => 470 , :height => 40) do
                pdf.text "Quotation is valid for 30 days.", :size => 10
            end
            pdf.bounding_box([10, 180], :width => 20 , :height => 30) do
                pdf.text "15", :size => 11
            end
            pdf.bounding_box([30, 180], :width => 470 , :height => 40) do
                pdf.text "Rates are not inclusive of post sweeping", :size => 10
            end
            
            pdf.number_pages "page <page> of <total>",
            {
                :start_count_at => 1,
                :at => [pdf.bounds.right - 100,0],
                :align => :right,
                :size => 12
            }
        send_data pdf.render, filename: 'quote.pdf', type: 'application/pdf'
      end
    end
   end
  
    def deep_copy(o)
        Marshal.load(Marshal.dump(o))
    end

   private
   def quote_params
      params.require(:quote).permit(:quote_no, :street, :suburb, :name, :notes, :distance_to_site, :truck_hire, :charge, :cost, :state, :client_id, :quote_type, :duration, :visits, :description);
   end
end