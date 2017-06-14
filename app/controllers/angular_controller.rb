class AngularController < ApplicationController
  def index
    render 'index'
  end
  
  def test_json
    @sample_json = {sample_json: true}
    puts "testing",@sample_json
    render json: @sample_json
  end
  
  def get_pdf
     pdf_filename = File.join(Rails.root, "report.pdf")
    send_file(pdf_filename, :filename => "your_document.pdf", :type => "application/pdf")
  end
  
  def generate_pdf
    #ref https://github.com/prawnpdf/prawn
    text = params[:content]
  
    respond_to do |format|
      format.json { render json: {status: success} }
      format.pdf do
        pdf = Prawn::Document.new(:page_size => "A4", :page_layout => :portrait)
        pdf.text text
        send_data pdf.render, filename: 'report.pdf', type: 'application/pdf'
      end
    end
  
  end
  
  def generate_csv
    @mixes = Mix.all
     respond_to do |format|
      format.json { render json: {status: success} }
      format.csv do
        send_data @mixes.to_csv, filename: "mixes-#{Date.today}.csv" 
      end
    end
  end

  
end
