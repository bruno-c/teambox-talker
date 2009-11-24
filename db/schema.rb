# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20091124052749) do

  create_table "accounts", :force => true do |t|
    t.string   "subdomain"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "accounts", ["subdomain"], :name => "index_accounts_on_subdomain", :unique => true

  create_table "attachments", :force => true do |t|
    t.integer  "room_id"
    t.integer  "user_id"
    t.string   "upload_file_name"
    t.string   "upload_content_type"
    t.integer  "upload_file_size"
    t.datetime "upload_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "connections", :force => true do |t|
    t.integer  "room_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "state",      :limit => 15
  end

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.string   "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", :force => true do |t|
    t.string   "uuid",       :limit => 32, :null => false
    t.integer  "room_id"
    t.text     "content"
    t.string   "type",       :limit => 15
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "payload"
  end

  add_index "events", ["uuid"], :name => "index_events_on_uuid", :unique => true

  create_table "feeds", :force => true do |t|
    t.integer  "room_id"
    t.integer  "account_id"
    t.string   "url"
    t.string   "user_name"
    t.string   "encrypted_password"
    t.datetime "last_modified_at"
    t.string   "etag"
    t.string   "locked_by"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "last_error"
    t.datetime "run_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pastes", :force => true do |t|
    t.text     "content"
    t.string   "permalink"
    t.string   "syntax"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "pastes", ["permalink"], :name => "index_pastes_on_permalink", :unique => true

  create_table "plugin_installations", :force => true do |t|
    t.integer  "account_id"
    t.integer  "plugin_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "plugins", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.text     "source"
    t.integer  "author_id"
    t.integer  "account_id"
    t.boolean  "shared",      :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rooms", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "account_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "public_token"
    t.datetime "opened_at"
  end

  create_table "users", :force => true do |t|
    t.string   "name",             :limit => 100, :default => ""
    t.string   "email",            :limit => 100
    t.string   "crypted_password", :limit => 40
    t.string   "salt",             :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token",   :limit => 40
    t.integer  "account_id"
    t.string   "talker_token"
    t.string   "perishable_token"
    t.boolean  "admin",                           :default => false
    t.string   "state",                           :default => "pending"
    t.datetime "deleted_at"
    t.datetime "activated_at"
    t.string   "time_zone"
    t.boolean  "staff",                           :default => false
    t.boolean  "guest",                           :default => false
    t.integer  "room_id"
  end

  add_index "users", ["email"], :name => "index_users_on_email"

end
