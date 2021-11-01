from pyteal import Bytes

version = Bytes("v")
published = Bytes("p")
creator = Bytes("c")
created_at = Bytes("cat")
name = Bytes("n")
asset_id = Bytes("aid")
reg_starts_at = Bytes("rsat")
reg_ends_at = Bytes("reat")
sale_starts_at = Bytes("ssat")
sale_ends_at = Bytes("seat")
claim_after = Bytes("ca")
total_allocation = Bytes("ta")
remaining_allocation = Bytes("ra")
min_allocation = Bytes("mia")
max_allocation = Bytes("mxa")
swap_ratio = Bytes("sr")
no_of_registrations = Bytes("nor")
no_of_investors = Bytes("noi")
no_of_claims = Bytes("noc")
no_of_withdrawls = Bytes("now")
escrow = Bytes("e")
funds_claimed = Bytes("fc")
funds_withdrawn = Bytes("fw")
company_details = Bytes("cd")
remaining_assets_claimed = Bytes("rac")
target_reached = Bytes("tr")
platform_app_id = Bytes("pai")
platform_escrow = Bytes('pe')
platform_publish_fee = Bytes('ppf')
platform_success_fee = Bytes('psf')
