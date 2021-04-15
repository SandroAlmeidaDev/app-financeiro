## Checkouts table columns
company_id: string
number: number
status: string

## CheckoutsSalesCoupons table columns
company_id: string
checkout_id: string
operator: number
coupon: number
status: string
sale_date: date
time_start: string
customer_id: string
customer_name: string
total_coupon: number
total_discount: number
total_addition: number

## CheckoutsTransactions table columns
company_id: string
checkout_id: string
operator: number
coupon: number
type: string
order: number
parcel: number
sale_date: date
sale_due_date: date
total: number

## CheckoutsCouponsProducts table columns
company_id: string
checkout_id: string
operator: number
coupon: number
erp_product_id: number
bar_code: number
quantity: number
unit_price: number
discount: number
total_price: number
hour: string
sale_date: date
erp_offer_id: string
is_canceled: boolean
order: number
erp_customer_id: number
erp_seller_id: number
erp_department_id: number
aliquot_icms: number
normal_price: number
type_price: number
type_taxation: string
model_doc: string
motive_discount: string
serie_nf: string
erp_promo_id: string
erp_order_id: string
bc_pis: number
bc_cofins: number




