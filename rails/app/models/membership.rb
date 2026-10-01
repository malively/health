class Membership < ApplicationRecord
  PLAN_TYPES = %w[basic premium].freeze

  belongs_to :provider
  belongs_to :client
  has_many :journals, dependent: :destroy

  validates :plan_type, presence: true, inclusion: { in: PLAN_TYPES }
end
