# Gold Standard Group Use Cases

---

## Use Case Structure

### Use Case: VERB NOUN
**Participating Actor:** Initiated by Actor (Shopper or Admin)
**Entry Condition:**  
- Valid  

**Exit Criteria:**  
- Valid  

**Flow of Events:**  
1. Actor requests SOMETHING VALID.  
2. Shopcomp SOMETHING VALID and refreshed display.

---

## Shopper Use Cases

### Use Case: Register Shopper
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper is not registered yet  

**Exit Condition:**  
- New shopper is registered to the database  

**Flow of Events:**  
1. Shopper requests to register.  
2. Shopcomp registers new shopper info to database and refreshes display.

---

### Use Case: Login Shopper
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper is registered  
- Shopper is not logged in  
- Shopper enters their correct credentials  

**Exit Condition:**  
- Shopper is logged into their account  

**Flow of Events:**  
1. Shopper requests to log into their account and enters their credentials.  
2. Shopcomp retrieves shopper's account info and refreshes display.

---

### Use Case: Show Account Dashboard
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper is logged into their account  

**Exit Condition:**  
- Account dashboard is shown to shopper  

**Flow of Events:**  
1. Shopper requests to see their account dashboard.  
2. Shopcomp retrieves shopper's dashboard info and refreshes display.

---

### Use Case: Review History
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper is logged into their account  

**Exit Condition:**  
- Receipt history is shown to shopper  

**Flow of Events:**  
1. Shopper requests to see their receipt history.  
2. Shopcomp retrieves shopper's receipt history and refreshes display.

---

### Use Case: Review Activity ()
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper is logged into their account  

**Exit Condition:**  
- ?  

**Flow of Events:**  
1. ?  
2. ?  

---

### Use Case: Search Recent Purchases
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper is logged into their account  
- Shopper has made at least one purchase  

**Exit Condition:**  
- Recent purchases are provided to shopper  

**Flow of Events:**  
1. Shopper requests to search through their recent purchases.  
2. Shopcomp provides shopper's target search item and refreshes display.

---

## Receipt Use Cases

### Use Case: Create Item
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper clicks button to create a new item  

**Exit Condition:**  
- A new item is added to a list of items  

**Flow of Events:**  
1. Shopper requests to create a new item.  
2. Shopcomp creates a new item and adds it to a list of items.

---

### Use Case: Add Receipt Item
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper clicks button to add a given item to the receipt  

**Exit Condition:**  
- An item is added to the receipt  

**Flow of Events:**  
1. Shopper requests to add an item to the receipt.  
2. Shopcomp adds the selected item to the receipt and refreshes the display.

---

### Use Case: Edit Receipt Item
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper clicks button to edit a given item in the receipt  

**Exit Condition:**  
- The info/properties of an item in the receipt are modified  

**Flow of Events:**  
1. Shopper requests to edit an item in the receipt.  
2. Shopcomp edits the info/properties from an item in the receipt and refreshes the display.

---

### Use Case: Remove Receipt Item
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper clicks button to remove a given item from the receipt  

**Exit Condition:**  
- An item is removed from the receipt  

**Flow of Events:**  
1. Shopper requests to remove an item from the receipt.  
2. Shopcomp removes the selected item from the receipt and refreshes the display.

---

## Use Case: Submit Receipt
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper clicks button to submit current receipt  

**Exit Condition:**  
- The receipt is submitted and stored in a list  

**Flow of Events:**  
1. Shopper requests to submit the receipt.  
2. Shopcomp submits the current receipt to a list of the Shopper's receipts and refreshes the display.

---

## Use Case: AI Analyze Receipt
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- Shopper clicks button to add an image of a receipt and uploads the image  

**Exit Condition:**  
- A new receipt identical to the uploaded image is returned  
- This receipt is added to the list of the Shopper's receipts  

**Flow of Events:**  
1. Shopper requests to upload an image of a receipt.  
2. Shopcomp uploads the image of the receipt to an AI, returns a receipt identical to the one in the uploaded image, and refreshes the display.

---

## Shopping List Use Cases for Shopper

### Use Case: Create Shopping List
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- "Create Shopping List" button is clicked  

**Exit Criteria:**  
- An empty shopping list is created and the display updated  

**Flow of Events:**  
1. Shopper requests to create a shopping list.  
2. Shopcomp creates an empty shopping list and refreshes display.

---

### Use Case: Add To List
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- "Add Item" button is clicked  

**Exit Criteria:**  
- An item is added to the shopping list and the display updated  

**Flow of Events:**  
1. Shopper requests to add an item to a shopping list.  
2. Shopcomp adds an item to the shopping list and refreshes display.

---

### Use Case: Remove From List
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- "Remove Item" button is clicked  

**Exit Criteria:**  
- An item is removed from the shopping list and the display updated  

**Flow of Events:**  
1. Shopper requests to remove an item from a shopping list.  
2. Shopcomp removes the item from the shopping list and refreshes display.

---

### Use Case: Report Options (all options of where to buy for a given item)
**Participating Actor:** Initiated by Shopper  
**Entry Condition:**  
- "Report Options" button is clicked  

**Exit Criteria:**  
- ?  

**Flow of Events:**  
1. Shopper requests to  
2. Shopcomp  

---

## Store Use Cases for Shopper

### Use Case: List Chains
**Participating Actor:** Shopper  
**Entry Condition:**  
- Shopper is logged in  

**Exit Condition:**  
- Store chains are displayed  

**Flow of Events:**  
1. Shopper requests to see store chains.  
2. ShopComp displays chains and refreshes page.

---

### Use Case: Add Chain
**Participating Actor:** Shopper  
**Entry Condition:**  
- Shopper is logged in  

**Exit Condition:**  
- Chain has been added to app  

**Flow of Events:**  
1. Shopper requests to add chain.  
2. ShopComp adds chain and refreshes page.

---

### Use Case: Add Store To Chain
**Participating Actor:** Shopper  
**Entry Condition:**  
- Shopper is logged in  
- Chain exists  

**Exit Condition:**  
- Store has been added to chain  

**Flow of Events:**  
1. Shopper requests to add store to chain.  
2. ShopComp adds store to chain and refreshes page.

---

## Admin Use Cases

### Use Case: Login Administrator
**Participating Actor:** Admin  
**Entry Condition:**  
- Admin is not logged in  

**Exit Condition:**  
- Admin is logged in  

**Flow of Events:**  
1. Admin inputs Shoppername and password.  
2. ShopComp updates page.  
3. Admin requests to login.  
4. ShopComp authenticates credentials and refreshes display.

---

### Use Case: Show Admin Dash
**Participating Actor:** Admin  
**Entry Condition:**  
- Admin is logged in as administrator  

**Exit Condition:**  
- Number of shoppers, total stores, and dollar amount of sales is displayed  

**Flow of Events:**  
1. Admin requests to see admin dash.  
2. ShopComp displays dash and refreshes page.

---

### Use Case: Remove Chain
**Participating Actor:** Admin  
**Entry Condition:**  
- Admin is logged in as administrator  
- Chain exists  

**Exit Condition:**  
- Chain removed from store chains  
- All stores in chain removed  

**Flow of Events:**  
1. Admin requests to remove chain from chains.  
2. ShopComp removes chain and all stores inside chain and refreshes page.

---

### Use Case: Report Chain Sales
**Participating Actor:** Admin  
**Entry Condition:**  
- Admin is logged in as administrator  
- Chain exists

**Exit Condition:**  
- Chain sales are displayed
- Sales of each store in chain are displayed

**Flow of Events:**  
1. Admin requests to report chain sales
2. ShopComp creates report and refreshes page.

---

### Use Case: Remove Store
**Participating Actor:** Admin  
**Entry Condition:**  
- Admin is logged in as administrator  
- Store exists  

**Exit Condition:**  
- Store has been removed from chain

**Flow of Events:**  
1. Admin requests to remove store.  
2. ShopComp removes store from its chain and refreshes page.

---
