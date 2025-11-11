# Gold Standard Group Use Cases

## Shopper Use Cases
### Use Case: Register Shopper
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**
 - Shopper is not registered yet

**Exit Condition:**
 - New shopper is registered to the database

**Flow of Events:**
1. Shopper requests to register.
2. ShopComp app registers new shopper info to database and refreshes display.

### Use Case: Login Shopper
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**
 - Shopper is registered
 - Shopper is not logged in
 - Shopper enters their correct credentials

**Exit condition:**
 - Shopper is logged into their account

**Flow of Events:**
1. Shopper requests to log into their account and enters their credentials.
2. ShopComp app retrieves shopper's account info and refreshes display.

### Use Case: Show Account Dashboard
**Participating Actor:** Initiated by Shopper
**Entry Condition:**
 - Shopper is logged into their account

**Exit Condition:**
 - Account dashboard is shown to shopper

**Flow of Events:**
1. Shopper requests to see their account dashboard.
2. ShopComp app retrieves shopper's dashboard info and refreshes display.

### Use Case: Review History
**Participating Actor:** Initiated by Shopper
**Entry Condition:**
 - Shopper is logged into their account

**Exit Condition:**
 - Receipt history is shown to shopper

**Flow of Events:**
1. Shopper requests to see their receipt history.
2. ShopComp app retrieves shopper's receipt history and refreshes display.

### Use Case: Reveiw Activity
**Participating Actor:** Initiated by Shopper
**Entry Condition:**
 - Shopper is logged into their account

**Exit Condition:**
 - ?

**Flow of Events:**
1. ?
2. ?

### Use Case: Search Recent Purchases
**Participating Actor:** Initiated by Shopper
**Entry Condition:**
 - Shopper is logged into their account
 - Shopper has made at least one purchase

**Exit Condition:**
 - Recent purchases are provided to shopper

**Flow of Events:**
1. Shopper requests to search through their recent purchases.
2. ShopComp app provides shopper's target search item and refreshes display.



# Receipt Use Cases 
- Create Item
- Add Item to Receipt
- Remove Item from Receipt
- Edit Item on Receipt
- Submit Receipt
- Analyze Receipt Image (AI)


# Shopping List Use Cases for Shopper
- Create Shopping List
### Use Case: Create List
Participating Actor: Initiated by Shopper  
Entry Condition: "Create Shopping List" button is clicked  
Exit Criteria: An empty shopping list is created and the display updated  
Flow of Events 
1. Shopper requests to create a shopping list 
2. ShopComp app creates empty shopping list and refreshes display  

- Add Item to Shopping List
### Use Case: Add Grocery  
Participating Actor: Initiated by Shopper  
Entry Condition: "Add Item" button is clicked  
Exit Criteria: An item is added to the shopping list and the display updated  
Flow of Events  
1. Shopper requests to add an item a shopping list 
2. ShopComp app adds an item to the shopping list and refreshes display

- Remove Item From Shopping List
### Use Case: Remove Grocery  
Participating Actor: Initiated by Shopper  
Entry Condition: "Remove Item" button is clicked  
Exit Criteria: An item is removed from the shopping list and the display updated  
Flow of Events  
1. Shopper requests to remove an item a shopping list 
2. ShopComp app removes the item from the shopping list and refreshes display

- Report Options for Shopping List // what does this even mean
### Use Case: Remove Grocery  
Participating Actor: Initiated by Shopper  
Entry Condition: "Report Options" button is clicked  
Exit Criteria:   
Flow of Events  
1. Shopper requests to 
2. ShopComp app 


# Store Use Cases for Shopper
## Use Case: List Chains
- Participating Actor: Shopper
- Entry Condition
    - Shopper is logged in
- Exit Condition
    - store chains are displayed
- Flow of events
    1. Shopper Requests to see store chains
    2. ShopComp displays chains and refreshes page

## Use Case: Add Chain
- Participating Actor: Shopper
- Entry Condition
    - Shopper is logged in
- Exit Condition
    - chain has been added to app
- Flow of events
    1. Shopper Requests to add chain
    2. ShopComp adds chain and refreshes page

## Add Store To Chain
- Participating Actor: Shopper
- Entry Condition
    - Shopper is logged in
    - chain exists
- Exit Condition
    - store has been added to chain
- Flow of events
    1. Shopper Requests to add store to chain
    2. ShopComp adds store to chain and refreshes page

# Admin Use Cases
## Use Case: Login Administrator
- Participating Actor: Admin
- Entry Condition
    - Admin is not logged in
- Exit Condition
    - Admin is logged in
- Flow of events
    1. Admin inputs Shoppername and password
    2. Shopcomp updates page
    3. Admin requests to login
    4. ShopComp authenticates credentials and refreshes display

## Use Case: Show Admin Dash
- Participating Actor: Admin
- Entry Condition
    - Admin is logged in as administrator
- Exit Condition
    - Admin dash is displayed
- Flow of events
    1. Admin requests to see admin dash
    2. ShopComp displays dash and refreshes page

## Use Case: Remove Chain
- Participating Actor: Admin
- Entry Condition
    - Admin is logged in as administrator
    - Chain exists
- Exit Condition
    - Chain removed from store chains
    - All stores in chain removed
- Flow of events
    1. Admin requests to see remove chain from chains
    2. ShopComp removes chain and all stores inside chain and refreshes page

## Use Case: Remove Store
- Participating Actor: Admin
- Entry Condition
    - Admin is logged in as administrator
    - Store exists
- Exit Condition
    - Store has been removed from chain [NOTE: CHAIN MAY OR MAY NOT BE NECESSARY]
- Flow of events
    1. Admin requests to remove store
    2. ShopComp removes store from its chain and refreshes page


# Use Case Structure
## Use case: VERB NOUN
- Participating Actor: Initiated by Shopper
- Entry Condition: 
    - Valid
- Exit Criteria:
    - Valid
- Flow of events
    1. Shopper requests SOMETHING VALID
    2. ShopComp app SOMETHING VALID and refreshed display


## Notes
- Store is always inside of chain
Chains can be empty
- can a store belong to multiple chains?
    - probably not i think
- should the participating actor for admin stuff be Shopper or admin?
