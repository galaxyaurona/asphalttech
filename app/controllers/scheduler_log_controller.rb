class SchedulerLogController < ApplicationController
   def index
      @scheduler_logs = SchedulerLog.all;
      render json: {success: true, data: @scheduler_logs}
   end
end
