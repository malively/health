# Dummy data for the health_api proof of concept.
# Run with: bin/rails db:seed
# Idempotent: clears existing rows first.

Journal.delete_all
Membership.delete_all
Provider.delete_all
Client.delete_all

providers = {
  "acme"    => Provider.create!(name: "Acme Health",      email: "contact@acmehealth.dev"),
  "beacon"  => Provider.create!(name: "Beacon Medical",    email: "hello@beaconmedical.dev"),
  "cedar"   => Provider.create!(name: "Cedar Clinic",      email: "info@cedarclinic.dev"),
  "drift"   => Provider.create!(name: "Driftwood Care",    email: "team@driftwoodcare.dev"),
}

clients = {
  "ada"   => Client.create!(name: "Ada Lovelace",  email: "ada@example.com"),
  "grace" => Client.create!(name: "Grace Hopper",  email: "grace@example.com"),
  "alan"  => Client.create!(name: "Alan Turing",   email: "alan@example.com"),
  "kath"  => Client.create!(name: "Katherine Johnson", email: "katherine@example.com"),
  "linus" => Client.create!(name: "Linus Torvalds", email: "linus@example.com"),
  "marg"  => Client.create!(name: "Margaret Hamilton", email: "margaret@example.com"),
}

# (provider, client, plan_type) pairs — providers with multiple clients
# and clients with multiple providers.
membership_specs = [
  %w[acme ada premium],
  %w[acme grace basic],
  %w[acme alan premium],
  %w[beacon ada basic],
  %w[beacon grace premium],
  %w[beacon kath basic],
  %w[beacon marg premium],
  %w[cedar alan basic],
  %w[cedar kath premium],
  %w[cedar linus basic],
  %w[drift marg basic],
  %w[drift linus premium],
]

memberships = membership_specs.map do |provider_key, client_key, plan_type|
  Membership.create!(provider: providers[provider_key], client: clients[client_key], plan_type: plan_type)
end

journal_entries = {
  %w[acme ada]     => ["Morning walk complete.", "Slept 8 hours — feeling rested."],
  %w[beacon grace] => ["New medication started, no side effects so far."],
  %w[cedar kath]   => ["Weekly checkup went well."],
}

journal_entries.each do |(provider_key, client_key), contents|
  membership = Membership.find_by(
    provider: providers[provider_key],
    client: clients[client_key]
  )
  contents.each { |content| membership.journals.create!(content: content) }
end
