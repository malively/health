# health_api

Proof-of-concept Rails API-only application using SQLite and ActiveRecord.

## Requirements

* Ruby 3.3.0 (a `.ruby-version` file pins this for rbenv)
* Xcode command line tools (for native gem compilation)

## Setup

```sh
bundle install
bin/rails db:prepare   # creates the database and runs migrations
bin/rails db:seed      # optional: loads dummy data
```

`db:seed` is idempotent — it clears existing rows first, so re-running it
always leaves the same dummy data (4 providers, 6 clients, 12 memberships,
4 journals, with providers and clients overlapping many-to-many).

## Running the app

```sh
bin/rails server
```

Serves the API at http://localhost:3000. There are no routes or controllers
yet — this app exists for ActiveRecord querying (use `bin/rails console`).

## Schema

| Table | Columns | Notes |
|---|---|---|
| providers | name, email | |
| clients | name, email | |
| memberships | provider_id, client_id, plan_type | FKs to providers and clients; unique composite index on (provider_id, client_id) prevents duplicate provider/client pairs; `plan_type` is required and must be `basic` or `premium` (DB check constraint + model validation) |
| journals | membership_id, content | FK to memberships; freeform text |

All tables have `created_at` / `updated_at`. Providers/clients have many
memberships; memberships have many journals.
