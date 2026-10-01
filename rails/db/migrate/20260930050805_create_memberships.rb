class CreateMemberships < ActiveRecord::Migration[8.0]
  def change
    create_table :memberships do |t|
      # provider_id is indexed as the leading column of the composite
      # unique index below, so no separate single-column index is needed.
      t.references :provider, null: false, foreign_key: true, index: false
      t.references :client, null: false, foreign_key: true
      t.string :plan_type, null: false

      t.timestamps
    end

    # Prevent duplicate (provider, client) combinations and speed up
    # lookups by provider or by provider + client.
    add_index :memberships, [:provider_id, :client_id], unique: true

    add_check_constraint :memberships, "plan_type IN ('basic', 'premium')", name: "plan_type_allowed_values"
  end
end
