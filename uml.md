## Model
- chains : Chains[0 .. *]
- shoppers : Shopper[0 .. *]
- admin : Admin

## Chain
- stores : Store[0 .. *]
- name : String

## Store
- id : Number
- items : Item[0 .. *]

# Receipt
id : Number
store : Store
items : Item[1 .. 0]

## Item
id : Number
name : String
price : Number

## Shopper
id : Number
unique_name : String (no spaces, max length = 20)
password : String (no spaces, max le = 20)
reciepts : Reciept[0 .. *]
shopping_list : ShoppingList

## ShoppingList
id : Number
items : Item[0 .. *]

## Admin
password : Number

