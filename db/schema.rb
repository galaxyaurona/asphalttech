# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160301071347) do

  create_table "callup_registers", force: :cascade do |t|
    t.string   "name"
    t.string   "category"
    t.datetime "last_triggered_date"
    t.datetime "next_due_date"
    t.integer  "repeat_amount"
    t.string   "repeat_unit"
    t.text     "note"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "cartage_rates", force: :cascade do |t|
    t.integer  "km"
    t.float    "rate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "clients", force: :cascade do |t|
    t.string   "name"
    t.string   "postal_address"
    t.string   "email"
    t.decimal  "credit_limit"
    t.integer  "payment_term"
    t.string   "client_type"
    t.text     "note"
    t.decimal  "credit_status"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "contact_people", force: :cascade do |t|
    t.string   "name"
    t.string   "role"
    t.string   "email"
    t.string   "office_contact"
    t.string   "mobile_contact"
    t.integer  "client_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "dockets", force: :cascade do |t|
    t.string   "docket_date"
    t.integer  "employee_id"
    t.integer  "mix_id"
    t.integer  "job_id"
    t.float    "tonnes_delivered"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "mix_name"
    t.string   "employee_name"
    t.string   "docket_no"
    t.string   "suburb"
    t.string   "street"
  end

  create_table "employees", force: :cascade do |t|
    t.integer  "payment_id"
    t.string   "given_names"
    t.string   "last_name"
    t.string   "contact_no"
    t.text     "notes"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "employees", ["payment_id"], name: "index_employees_on_payment_id"

  create_table "invoice_details", force: :cascade do |t|
    t.integer  "job_id"
    t.integer  "invoice_no"
    t.float    "total_charge"
    t.float    "gst"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "jobs", force: :cascade do |t|
    t.string   "name"
    t.text     "notes"
    t.integer  "client_id"
    t.integer  "invoice_id"
    t.float    "amount_payed"
    t.float    "date_due"
    t.integer  "quote_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "job_type"
    t.string   "client_name"
    t.string   "job_date"
  end

  create_table "materials", force: :cascade do |t|
    t.string   "name"
    t.float    "losses"
    t.float    "price_per_tonne"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "mix_materials", force: :cascade do |t|
    t.integer  "mix_id"
    t.integer  "material_id"
    t.float    "aggregate"
    t.float    "percent"
    t.float    "cost"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "mixes", force: :cascade do |t|
    t.float    "price_per_tonne"
    t.text     "note"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "name"
    t.boolean  "corrupted"
  end

  create_table "payments", force: :cascade do |t|
    t.float    "reg_8"
    t.float    "reg_9"
    t.float    "reg_10"
    t.float    "reg_11"
    t.float    "reg_12"
    t.float    "night_8"
    t.float    "night_9"
    t.float    "night_10"
    t.float    "night_11"
    t.float    "night_12"
    t.float    "sat_4"
    t.float    "sat_5"
    t.float    "sat_6"
    t.float    "sat_7"
    t.float    "sat_8"
    t.float    "sun_4"
    t.float    "sun_5"
    t.float    "sun_6"
    t.float    "sun_7"
    t.float    "sun_8"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "purchase_items", force: :cascade do |t|
    t.string   "item_name"
    t.float    "estimate"
    t.float    "actual"
    t.text     "note"
    t.string   "invoice_number"
    t.integer  "purchase_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "purchase_items", ["purchase_id"], name: "index_purchase_items_on_purchase_id"

  create_table "purchases", force: :cascade do |t|
    t.string   "order_by"
    t.string   "supplier"
    t.date     "date_ordered"
    t.string   "order_type"
    t.date     "date_of_work"
    t.integer  "job_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.text     "note"
  end

  add_index "purchases", ["job_id"], name: "index_purchases_on_job_id"

  create_table "quote_contractors", force: :cascade do |t|
    t.integer  "sub_contractor_id"
    t.integer  "quote_id"
    t.string   "role"
    t.float    "cost"
    t.float    "margin"
    t.float    "charge"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.integer  "contractor_type"
    t.float    "quantity"
    t.float    "rate"
    t.text     "notes"
    t.string   "unit_type"
    t.string   "comments"
    t.string   "description"
  end

  create_table "quote_employees", force: :cascade do |t|
    t.integer  "employee_id"
    t.integer  "quote_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.float    "cost"
    t.float    "charge"
    t.float    "margin"
    t.integer  "days"
    t.integer  "nights"
    t.integer  "saturdays"
    t.integer  "sundays"
  end

  create_table "quote_mixes", force: :cascade do |t|
    t.integer  "quote_id"
    t.integer  "mix_id"
    t.float    "thickness"
    t.float    "area"
    t.float    "tonnes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "quote_others", force: :cascade do |t|
    t.string   "name"
    t.integer  "quote_id"
    t.float    "cost"
    t.float    "charge"
    t.integer  "other_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text     "notes"
    t.string   "comments"
    t.string   "unit_type"
    t.float    "rate"
    t.float    "quantity"
  end

  create_table "quotes", force: :cascade do |t|
    t.string   "quote_no"
    t.text     "notes"
    t.float    "distance_to_site"
    t.float    "truck_hire"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.float    "cost"
    t.float    "charge"
    t.string   "name"
    t.string   "state"
    t.binary   "snapshot"
    t.integer  "client_id"
    t.integer  "quote_type"
    t.integer  "duration"
    t.string   "street"
    t.string   "suburb"
    t.integer  "visits"
    t.string   "description"
  end

  create_table "scheduler_logs", force: :cascade do |t|
    t.datetime "timestamp"
    t.string   "log"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sub_contractors", force: :cascade do |t|
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "name"
    t.string   "description"
    t.string   "contact_no"
    t.string   "email"
  end

end
