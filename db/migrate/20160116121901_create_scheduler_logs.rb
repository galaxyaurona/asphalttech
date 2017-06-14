class CreateSchedulerLogs < ActiveRecord::Migration
  def change
    create_table :scheduler_logs do |t|
      t.datetime :timestamp
      t.string :log

      t.timestamps null: false
    end
  end
end
