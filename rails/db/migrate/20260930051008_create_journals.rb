class CreateJournals < ActiveRecord::Migration[8.0]
  def change
    create_table :journals do |t|
      t.references :membership, null: false, foreign_key: true
      t.text :content

      t.timestamps
    end
  end
end
