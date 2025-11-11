## Shopper Use Cases
Use Case: Register Shopper
- Login Shopper
- Show Account Dashboard
- Review History
- Reveiw Activity
- Search Recent Purchases


## Receipt Use Cases 
- Create Item
- Add Item to Receipt
- Remove Item from Receipt
- Edit Item on Receipt
- Submit Receipt
- Analyze Receipt Image (AI)


## Shopping List Use Cases for Shopper
- Create Shopping List
- Add Item to Shopping List
- Remove Item From Shopping List
- Report Options for Shopping List


## Store Use Cases for Shopper
# Use Case: List Chains
- Participating Actor: User
- Entry Condition
    - user is logged in
- Exit Condition
    - store chains are displayed
- Flow of events
    1. User Requests to see store chains
    2. ShopComp displays chains and refreshes page

# Use Case: Add Chain
- Participating Actor: User
- Entry Condition
    - user is logged in
- Exit Condition
    - chain has been added to app
- Flow of events
    1. User Requests to add chain
    2. ShopComp adds chain and refreshes page

# Add Store To Chain
- Participating Actor: User
- Entry Condition
    - user is logged in
    - chain exists
- Exit Condition
    - store has been added to chain
- Flow of events
    1. User Requests to add store to chain
    2. ShopComp adds store to chain and refreshes page

## Admin Use Cases
# Use Case: Login Administrator
- Participating Actor: Admin
- Entry Condition
    - Admin is not logged in
- Exit Condition
    - Admin is logged in
- Flow of events
    1. Admin inputs username and password
    2. Shopcomp updates page
    3. Admin requests to login
    4. ShopComp authenticates credentials and refreshes display

# Use Case: Show Admin Dash
- Participating Actor: Admin
- Entry Condition
    - Admin is logged in as administrator
- Exit Condition
    - Admin dash is displayed
- Flow of events
    1. Admin requests to see admin dash
    2. ShopComp displays dash and refreshes page

# Use Case: Remove Chain
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

# Use Case: Remove Store
- Participating Actor: Admin
- Entry Condition
    - Admin is logged in as administrator
    - Store exists
- Exit Condition
    - Store has been removed from chain [NOTE: CHAIN MAY OR MAY NOT BE NECESSARY]
- Flow of events
    1. Admin requests to remove store
    2. ShopComp removes store from its chain and refreshes page


## Use Case Structure
# Use case: VERB NOUN
- Participating Actor: Initiated by user
- Entry Condition: 
    - Valid
- Exit Criteria:
    - Valid
- Flow of events
    1. User requests SOMETHING VALID
    2. ShopComp app SOMETHING VALID and refreshed display


## Notes
- is a store always inside of a chain?
    - standalones could be standalone or chains with one store
    - could be name = chain name and id = unique id
    - or name = name, id = unique id, boolean chain = T or F, map to chian = link
- can chains be empty?
    - probably
- can a store belong to multiple chains?
    - probably not i think
- should the participating actor for admin stuff be user or admin?