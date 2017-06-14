namespace :scheduler do
  desc "TODO"

  task recalculate_call_ups: :environment do
    CallupRegister.all # find will make it automatically recalculat
    log = SchedulerLog.create(timestamp: DateTime.current,log: 'Update call ups ');
    puts "Updated#{log.to_json}";
  end

end
