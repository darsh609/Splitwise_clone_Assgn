

# 💸 Group_Pay – Splitwise-Style Expense Sharing Backend

CredResolve is a **backend-oriented expense sharing system** inspired by Splitwise.
It allows users to create groups, add shared expenses, settle balances, and track who owes whom — all via clean, well-structured REST APIs.

The frontend is only a consumer of these APIs.
The **core of this project is the backend architecture and API design**.

---

## 🚀 Live Deployment

* **Backend API Base URL**

  ```
  https://splitwise-clone-assgn-1.onrender.com/api
  
  ```
* **Frontend URL**
  ```
   https://splitwise-clone-assgn.vercel.app/
  
  ```
  

---

## 🧠 What This Project Demonstrates

* RESTful API design
* JWT-based authentication
* Group-scoped data isolation
* Expense splitting (equal, exact, percentage)
* Settlement tracking
* Balance computation after expenses + settlements
* Real-world backend flows (delete cascades, auth checks)

---

## 📁 Tech Stack (Backend)

* **Node.js**
* **Express**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **bcrypt** for password hashing
* **nodemon** for development

---

## ⚙️ Running the Backend Locally

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd server
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

Create a `.env` file in the `server` folder with the following keys:

```env
MONGODB_URL=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_secret_key>
```

> ⚠️ Values are intentionally not included.
> Use your own MongoDB Atlas / local MongoDB instance.

---

### 4️⃣ Start the backend

```bash
npm run dev
```

Server will run on:

```
http://localhost:5000/api
```

---

## 🔐 Authentication Flow (Start Here)

All protected APIs require a JWT token.

### 1️⃣ Register a user

```
POST /users/register
```

### 2️⃣ Login

```
POST /users/login
```

* Response includes a JWT token
* Use this token for all future requests:

```
Authorization: Bearer <token>
```

---

## 👥 Group APIs (Second Step)

### Create a Group

```
POST /groups
```

* Logged-in user is automatically added
* Additional members can be passed in request body

---

### Get My Groups

```
GET /groups/my-groups
```

Returns only groups where the logged-in user is a member.

---

### Get Group Members

```
GET /groups/:groupId/members
```

Used by frontend to:

* Show members
* Add expenses
* Create settlements

---

### Delete Group

```
DELETE /groups/:groupId
```

> This also deletes:

* All expenses of the group
* All settlements of the group

---

## 💰 Expense APIs (Core Feature)

### Add Expense

```
POST /expenses
```

Supported split types:

* `EQUAL`
* `EXACT`
* `PERCENTAGE`

The backend validates:

* Amount consistency
* Split totals
* Group membership

---

### Get Group Expenses

```
GET /expenses/group/:groupId
```

Returns:

* Expense details
* Who paid
* Who owes how much

---

### Delete Expense

```
DELETE /expenses/:expenseId
```

Used when an expense was added incorrectly.

---

## 📊 Balance APIs (Computation Layer)

### Get Group Balances

```
GET /expenses/group/:groupId/balances
```

Returns:

* Final pairwise balances
* After cancelling mutual debts
* After applying settlements

---

### Get Logged-in User Balance (Across All Groups)

```
GET /expenses/user/:userId/balance
```

Returns:

* `youOwe`
* `youAreOwed`

---

### Get User Balance in a Specific Group

```
GET /expenses/group/:groupId/user/:userId
```

---

## 🤝 Settlement APIs

### Add Settlement

```
POST /settlements
```

Used when one user pays another to settle dues.

---

### Get My Settlements

```
GET /settlements/my-settlements
```

Returns:

* Settlements where user is sender or receiver
* Group information included

---

### Delete Settlement

```
DELETE /settlements/:settlementId
```

---

## 🧪 How to Test the APIs

Recommended tools:

* **Postman**
* **Thunder Client**
* **cURL**

Suggested testing order:

1. Register & Login
2. Create Group
3. Add Expense
4. View Group Expenses
5. Check Balances
6. Add Settlement
7. Re-check Balances

---

## 🔗 Frontend Integration

Frontend connects via:

```env
REACT_APP_BASE_URL=<backend_api_url>
```

All requests:

* Use Axios
* Attach JWT token
* Consume backend responses directly

---

## 🧩 Project Philosophy

This project is designed to:

* Be backend-first
* Work independently of frontend
* Scale to mobile or other clients
* Reflect real-world expense workflows

---

## 👨‍💻 Author

**Darsh Kumar**
Final Year B.Tech
NIT Warangal

> Built as a backend-focused assignment to demonstrate API design, authentication, and data consistency in real applications.


