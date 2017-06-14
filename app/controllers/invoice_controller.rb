class InvoiceController < ApplicationController
  require "prawn/measurement_extensions"
  

  
  require "open-uri"
    skip_before_action :verify_authenticity_token
    
    def preview
    @top_margin = 50;
        Prawn::Document.generate("report.pdf",:margin => [0,0,0,0] ) do |pdf|
          initialize_pdf pdf
          header pdf
          meta_inf_preview pdf
          footer pdf
          pdf.start_new_page
          pdf.start_new_page
          pdf.repeat :all do 
            header pdf
            meta_inf_preview pdf
            footer pdf
          end
        end
        
        respond_to do |format|
          format.json { render json: {status: success} }
          format.pdf do
            pdf = Prawn::Document.new(:page_size => "A4", :page_layout => :portrait, :margin => [0,0,0,0] )
            client = JSON.pretty_generate(params[:client])
            #pdf.stroke_axis
            #pdf.stroke_axis(:at => [0, 0], :height => 1000, :step_length => 50,
                #:negative_axes_length => 5, :color => '0000FF')

    
            initialize_pdf pdf
            #puts text
            header pdf
            meta_inf_preview pdf
            footer pdf
            pdf.repeat :all do 
              header pdf
              meta_inf_preview pdf
              footer pdf
            end
            draw_table pdf
            send_data pdf.render, filename: 'report.pdf', type: 'application/pdf'
          end
        end
    end
    
    def initialize_pdf(pdf)
      pdf.stroke_axis
    end
    
    def meta_inf_preview (pdf)
     
      date_generate = DateTime.parse(params[:date_generate]).in_time_zone
      client = params[:client]
      
      pdf.bounding_box([25, 540 + @top_margin], :width => 300, :height => 200) do
          pdf.text "<b>#{date_generate.to_date.to_formatted_s(:long_ordinal) }</b>", inline_format: true, size: 9
          pdf.move_down 2.mm
          pdf.text "<b>Invoice No:       TBD</b>", inline_format: true, size: 9
          pdf.move_down 2.mm
          pdf.text "<b>Client:               #{client[:name]}</b>", inline_format: true, size: 9
          pdf.draw_text "#{client[:postal_address]}", inline_format: true, size: 9, at: [68,148]
          pdf.move_down 6.mm
          pdf.text "<b>Attention:         #{params[:attention]}</b>", inline_format: true, size: 9
      end
    end
    
    def draw_table pdf
      columns = ['Date'] 
      extra_columns = params[:columns]
      if params[:job_type] == 1
           @description_width = 50;
        columns += ['Docket No','Address','Suburb','Waiting time','Km']
        if !extra_columns.nil?
          columns += extra_columns.map { |column| column[:name] }
        end
        columns += ['Unit','Qty','Rate','Cartage','Total']
      else
          @description_width = 250; 
        columns += ['Description']
        if !extra_columns.nil?
          columns += extra_columns.map { |column| column[:name] }
        end
        columns += ['Unit','Qty','Rate','Total'];
      end
     puts "width #{@description_width}"
 
      
      columns += []
      items = [columns];
      raw_items = params[:items];
      rows_with_attachment = [];
      job_type = params[:job_type];
      processed_items = raw_items.each_with_index.map do |item, index|
         
        if (item[:type] == 'header' || item[:type] == 'mix')
          [{:content => "<b>#{item[:name]}</b>", :colspan => columns.length, inline_format: true, }]
        elsif (item[:type] == 'item')
            #mark next row as attachment
            if item[:has_attachment]
                rows_with_attachment <<  index
            end
            
            if (!item[:item_date].nil?)
              row = ["#{DateTime.parse(item[:item_date]).in_time_zone.to_date.to_formatted_s(:short)}"] 
            else
              row = [""]
            end
            # docket no and address and surburb
            if (params[:job_type] == 1)
              row += [item[:docket_no],item[:street],item[:suburb],item[:waiting_time],item[:km]]
            else
              row += [item[:description]]
            end
            if !extra_columns.nil?
              extra_columns.each do |column|
                  if (column.add_to_total)
                      row += [item[column[:name]]]
                  end
              end
            end
            row += [item[:unit],item[:qty],"$ #{item[:rate]}"]
            if (params[:job_type] == 1)
              row += ["$ #{item[:cartage_rate]}"]
            end
            row += ["$ #{item[:total].round(2)}"]
        else
            row = ["",item[:name]]
            (columns.length-2).times do
                row << " "
            end
            row
        end
      end
      
      items += processed_items;
      if params[:job_type] == 1
        row = ["",{:content => '<b>Total waiting time</b>', :colspan =>  3, inline_format: true},params[:total_waiting_time].round(2),"","hr"]
        (columns.length - 10).times do
           row << ""
        end
         row.push("$ #{params[:waiting_time_rate].round(2)}","","$ #{(params[:waiting_time_rate]*params[:total_waiting_time]).round(2)}")
         puts row
         items += [row]
      end
      items += [[{:content => 'SUBTOTAL', :colspan => columns.length - 1},"$ #{params[:subtotal].round(2)}"]]
      items += [[{:content => 'GST', :colspan => columns.length - 1},"$ #{params[:gst].round(2)}"]]
      items += [[{:content => 'TOTAL (GST INCLUDED)', :colspan => columns.length - 1},"$ #{params[:total].round(2)}"]] 
      pdf.bounding_box([25, 460 + @top_margin], :width => 530, :height => 470) do
        pdf.table(items, header: true, :cell_style => { size: 10 - columns.length/4, padding: [2,3,2,3] } ,width: 530) do 
          
          #bold heade
          row(0).font_style = :bold;
          row(0).size = 10 - columns.length/4
          row(0).padding = 3;
          row(0).align = :center;
        
          # bold total, subtotal, align right
          row(row_length-3..row_length-1).font_style = :bold;
          row(row_length-3..row_length-1).align = :right;
          rows_with_attachment.each do |index|
            row(index+1).borders = [:top,:left,:right];
            row(index+2).borders = [:bottom,:left,:right];
          end
          if (job_type == 1)
            column(1).width = 50;
            column(2).width = 75;
            column(3).width = 75;
            column(4).width = 50;
          else
            column(1).width = 225;
          end
          column(0).width = 35;
          column(column_length-1).font_style = :bold;
          column(column_length-1).align = :right;
          
        end
      end

    end
    
    def footer(pdf)
       pdf.bounding_box([5, 15 ], :width => 250, :height => 25) do
        pdf.text "<b>Asphaltech (Vic) Pty Lt, BSB:</b> 066-167 <b>ACCT:</b> 10198088", inline_format: true, size: 8
       end
       client = params[:client]
       if (client[:client_type] == 'government')
        pdf.bounding_box([450, 15], :width => 250, :height => 25) do
            pdf.text "<b>Payment appreciated #{client[:payment_term]} days nett</b>", inline_format: true, size: 8
        end 
       end
    end
    
    def header(pdf)
    
      #left component
      pdf.bounding_box([125, 625 + @top_margin], :width => 150, :height => 30) do
          pdf.text "<i><b>138 Freight Drive</b></i>" , :size => 10 ,inline_format: true 
          pdf.text "<i><b>Somerton Vic 3062</b></i>", :size => 10, inline_format: true
        
      end
      
      #logo andd ABN
      pdf.bounding_box([225, 650 +@top_margin], :width => 225, :height => 200) do

          pdf.image "#{Rails.root}/asphaltech.jpg", :at => [-9,265] , :fit => [200,200]
          pdf.move_down 2.mm
          pdf.text "<b>(Vic) Pty Ltd ABN 42 105 883 154</b>", inline_format: true, size: 11
      end
      #phone and fax
      pdf.bounding_box([395, 625 +@top_margin], :width => 150, :height => 30) do
          pdf.text "<i><b>Phone: 03 9303 7833</b></i>" , :size => 10 ,inline_format: true 
          pdf.text "<i><b>Fax: 03 9303 7844</b></i>", :size => 10, inline_format: true
  
      end
      #email and TAX INVOICE
      pdf.bounding_box([200, 590 +@top_margin], :width => 200, :height => 200) do
          pdf.text "<i><b>Email: daniel@asphaltech.com.au</b></i>", inline_format: true, size: 10, align: :center
          pdf.move_down 3.mm
          pdf.text "<b>TAX INVOICE</b>", inline_format: true, size: 13, align: :center
      end
      
    end
    
end
