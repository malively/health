# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_09_30_051008) do
  create_table "clients", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "journals", force: :cascade do |t|
    t.integer "membership_id", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["membership_id"], name: "index_journals_on_membership_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.integer "provider_id", null: false
    t.integer "client_id", null: false
    t.string "plan_type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_memberships_on_client_id"
    t.index ["provider_id", "client_id"], name: "index_memberships_on_provider_id_and_client_id", unique: true
    t.check_constraint "plan_type IN ('basic', 'premium')", name: "plan_type_allowed_values"
  end

  create_table "providers", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "journals", "memberships"
  add_foreign_key "memberships", "clients"
  add_foreign_key "memberships", "providers"
end
