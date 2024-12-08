# Booky
A user-friendly app for tracking business expenses and revenue, designed to simplify financial management for entrepreneurs and small business owners.

## How to use it locally
1. Clone the project 
2. In the backend folder run this command:
```./pocketbase serve``` You may need to change the file in the backend folder if you are using MacOS or Windows, see the [`Pocketbase doc`](https://pocketbase.io/docs/).
3. Run ```npm install``` in the app folder
4. Create a .env file in the app folder
5. ```npm run dev```

## Deployment

## To-do list
- [x] Login, registration, reset password, logout
- [x] Light/Dark theme
- [x] Edit user profile
***
Release v0.1
***
### Transactions
- [x] Display
- [x] Create
- [x] Edit
- [x] Delete
- [x] Upload document
- [x] Download document
- [x] Date filter
### Transaction label
- [X] Create
- [X] Edit
- [X] Delete (default to general label)
- [X] Assign
### Dashboard
- [X] Display revenues/expenses
- [X] Display latest transactions
- [X] Date filter
- [X] Expense/Revenu chart filtered by label
***
Release v1
***
This project was created to assist developers who want to start a business but don't have the budget for accounting software. This app can serve as a valuable starting point for organizing your expenses and revenue. Additionally, you can add more functionalities as needed.

We offer a solution with more functionality at [meetbooky.com](https://meetbooky.com), featuring both a one-time payment option and a pay-as-you-go product. While many solutions today rely on subscription-based plans, we’ve chosen a different approach to ensure that our product scales with your needs.

## Pro Functionality
- Export transactions to Excel format
- Pre-fill fields on PDF imports
- Include administration code on labels for tax reports
- Automatically import your Stripe transactions with one click
- Import invoices from Gmail or Outlook
- Create tax presets based on your country and/or state
- Capture photos of receipts