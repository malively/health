class Client < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :providers, through: :memberships
  has_many :journals, through: :memberships

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
