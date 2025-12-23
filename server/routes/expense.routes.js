const express = require("express");
const router = express.Router();
const { addExpense ,getGroupExpenses ,getGroupBalances,getUserBalanceView,deleteExpense} = require("../controllers/expense.controller");
const authHeader = require("../middleware/auth.middleware");
router.post("/",authHeader ,addExpense);
router.get("/group/:groupId",authHeader, getGroupExpenses);
router.get("/group/:groupId/balance",authHeader, getGroupBalances);
router.get("/user/:userId/balance", authHeader,getUserBalanceView);
const { getGroupUserSummary } = require("../controllers/expense.controller");

// router.get("/group/:groupId/user/:userId/balance",authHeader, getGroupUserSummary);
const expenseCtrl = require("../controllers/expense.controller");

router.delete("/:expenseId", authHeader, deleteExpense);
module.exports = router;
