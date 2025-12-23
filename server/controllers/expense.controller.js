const Expense = require("../models/Expense");
const User = require("../models/User");
const {
//   calculateGroupBalances,
//   simplifyBalances,
//   applySettlements,

calculatePairwiseBalances,
    cancelMutualDebts,
    applySettlement

} = require("../services/balance.services");
const Settlement = require("../models/Settlement");

const { validateExpense } = require("../utils/validateExpense");



exports.addExpense = async (req, res) => {
    validateExpense(req.body);
  const { amount, paidBy, splitType, splits } = req.body;

  let finalSplits = [];

  if (splitType === "EQUAL") {
    const perHead = amount / splits.length;
    finalSplits = splits.map(s => ({
      user: s.user,
      amount: perHead
    }));
  }

  if (splitType === "EXACT") {
    finalSplits = splits;
  }

  if (splitType === "PERCENTAGE") {
    finalSplits = splits.map(s => ({
      user: s.user,
      amount: (amount * s.percentage) / 100
    }));
  }

  const expense = await Expense.create({
    ...req.body,
    splits: finalSplits
  });

  res.json(expense);
};






exports.getGroupExpenses = async (req, res) => {
 
  const { groupId } = req.params;

  const expenses = await Expense.find({ group: groupId })
    .populate("paidBy", "name")
    .populate("splits.user", "name");

    

  res.json(expenses);
};

exports.getGroupBalances = async (req, res) => {
  const { groupId } = req.params;

  // 1️⃣ Fetch group expenses
  const expenses = await Expense.find({ group: groupId })
    .populate("paidBy")
    .populate("splits.user");

  // 2️⃣ Fetch group settlements
  const settlements = await Settlement.find({ group: groupId });

  // 3️⃣ Build pairwise ledger
  let ledger = calculatePairwiseBalances(expenses);

  // 4️⃣ Cancel mutual debts (CRITICAL)
  ledger = cancelMutualDebts(ledger);

  // 5️⃣ Apply settlements one by one
  settlements.forEach(s => {
    ledger = applySettlement(ledger, {
      from: s.from?.toString(),
      to: s.to?.toString(),
      amount: s.amount
    });
  });

  res.json({
    groupId,
    balances: ledger
  });
};

exports.getUserBalanceView = async (req, res) => {
  const { userId } = req.params;

  // 1️⃣ Fetch all expenses
  const expenses = await Expense.find({})
    .populate("paidBy", "name")
    .populate("splits.user", "name");

  // 2️⃣ Fetch all settlements
  const settlements = await Settlement.find({});

  // 3️⃣ Build ledger
  let ledger = calculatePairwiseBalances(expenses);
  ledger = cancelMutualDebts(ledger);

  // 4️⃣ Apply settlements
  settlements.forEach(s => {
    ledger = applySettlement(ledger, {
      from: s.from?.toString(),
      to: s.to?.toString(),
      amount: s.amount
    });
  });

  // 5️⃣ Extract user-specific view
  
const users = await User.find({}).select("_id name");

  const userMap = {};
  users.forEach(u => {
    userMap[u._id] = u.name;
  });

  const youOwe = [];
  const youAreOwed = [];

  if (ledger[userId]) {
    for (const to in ledger[userId]) {
      youOwe.push({
        userId: to,
        name: userMap[to],
        amount: ledger[userId][to]
      });
    }
  }

  for (const from in ledger) {
    if (ledger[from][userId]) {
      youAreOwed.push({
        userId: from,
        name: userMap[from],
        amount: ledger[from][userId]
      });
    }
  }

  res.json({
    userId,
    youOwe,
    youAreOwed
  });

};


exports.getGroupUserSummary = async (req, res) => {
  const { groupId, userId } = req.params;

  // 1️⃣ Fetch group expenses
  const expenses = await Expense.find({ group: groupId })
    .populate("paidBy")
    .populate("splits.user");

  // 2️⃣ Fetch group settlements
  const settlements = await Settlement.find({ group: groupId });

  // 3️⃣ Build ledger
  let ledger = calculatePairwiseBalances(expenses);
  ledger = cancelMutualDebts(ledger);

  // 4️⃣ Apply settlements
  settlements.forEach(s => {
    ledger = applySettlement(ledger, {
      from: s.from.toString(),
      to: s.to.toString(),
      amount: s.amount
    });
  });

  // 5️⃣ Extract only this user
  const youOwe = [];
  const youAreOwed = [];

  if (ledger[userId]) {
    for (const to in ledger[userId]) {
      youOwe.push({
        to,
        amount: ledger[userId][to]
      });
    }
  }

  for (const from in ledger) {
    if (ledger[from][userId]) {
      youAreOwed.push({
        from,
        amount: ledger[from][userId]
      });
    }
  }

  res.json({
    groupId,
    userId,
    youOwe,
    youAreOwed
  });
};

exports.deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  await Expense.findByIdAndDelete(expenseId);

  res.json({
    message: "Expense deleted successfully",
    expenseId
  });
};






