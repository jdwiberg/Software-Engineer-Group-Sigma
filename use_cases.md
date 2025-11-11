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

Use Case: Login Shopper
Participating Actor: Initiated by Shopper
Entry Condition:
 - Shopper is registered
 - Shopper is not logged in
 - Shopper enters their correct credentials
Exit condition
 - Shopper is logged into their account
Flow of Events:
1. Shopper requests to log into their account and enters their credentials.
2. ShopComp app retrieves shopper's account info and refreshes display.

Use Case: Show Account Dashboard
Participating Actor: Initiated by Shopper
Entry Condition:
 - Shopper is logged into their account
Exit Condition:
 - Account dashboard is shown to shopper
Flow of Events:
1. Shopper requests to see their account dashboard.
2. ShopComp app retrieves shopper's dashboard info and refreshes display.

Use Case: Review History
Participating Actor: Initiated by Shopper
Entry Condition:
 - Shopper is logged into their account
Exit Condition:
 - Receipt history is shown to shopper
Flow of Events:
1. Shopper requests to see their receipt history.
2. ShopComp app retrieves shopper's receipt history and refreshes display.

Use Case: Reveiw Activity
Participating Actor: Initiated by Shopper
Entry Condition:
 - Shopper is logged into their account
Exit Condition:
 - 
Flow of Events:
1. 
2. 

Use Case: Search Recent Purchases
Participating Actor: Initiated by Shopper
Entry Condition:
 - Shopper is logged into their account
 - Shopper has made at least one purchase
Exit Condition:
 - Recent purchases are provided to shopper
Flow of Events:
1. Shopper requests to search through their recent purchases.
2. ShopComp app provides shopper's target search item and refreshes display.



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
- List Store Chains
- Add Chain
- Add Store To Chain

## Admin Use Cases
- Login Administrator
- Show Admin Dash
- Remove Store Chain
- Remove Store


## Use Case Structure
Use case: VERB NOUN
Participating Actor: Initiated by user
Entry Condition: 
 - Valid
Exit Criteria:
 - Valid
Flow of events
 1. User requests SOMETHING VALID
 2. ShopComp app SOMETHING VALID and refreshed display