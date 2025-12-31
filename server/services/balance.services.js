

exports.calculatePairwiseBalances = (expenses) => {
  const ledger = {};

  const addDebt = (from, to, amount) => {
    if (!ledger[from]) ledger[from] = {};
    ledger[from][to] = (ledger[from][to] || 0) + amount;
  };

  expenses.forEach(exp => {
    const paidBy = exp.paidBy._id.toString();

    exp.splits.forEach(split => {
      const userId = split.user._id.toString();
      if (userId === paidBy) return;
      addDebt(userId, paidBy, split.amount);
    });
  });


  return ledger;
};
exports.cancelMutualDebts = (ledger) => {
  for (const from in ledger) {
    for (const to in ledger[from]) {
      if (ledger[to] && ledger[to][from]) {
        const min = Math.min(ledger[from][to], ledger[to][from]);

        ledger[from][to] -= min;
        ledger[to][from] -= min;

        if (ledger[from][to] === 0) delete ledger[from][to];
        if (ledger[to][from] === 0) delete ledger[to][from];
      }
    }

    if (Object.keys(ledger[from]).length === 0) {
      delete ledger[from];
    }
  }

  

  return ledger;
};



exports.applySettlement = (ledger, { from, to, amount }) => {
  if (!ledger) ledger = {};

  // Case 1️: from owes to
  if (ledger[from] && ledger[from][to] !== undefined) {
    ledger[from][to] -= amount;

    // Fully settled
    if (ledger[from][to] === 0) {
      delete ledger[from][to];
      if (Object.keys(ledger[from]).length === 0) {
        delete ledger[from];
      }
      return ledger;
    }

    // Over-settled → flip direction
    if (ledger[from][to] < 0) {
      const extra = Math.abs(ledger[from][to]);

      delete ledger[from][to];
      if (Object.keys(ledger[from]).length === 0) {
        delete ledger[from];
      }

      if (!ledger[to]) ledger[to] = {};
      ledger[to][from] = (ledger[to][from] || 0) + extra;
    }

    return ledger;
  }

  // Case 2️: reverse exists (to owes from)
  if (ledger[to] && ledger[to][from] !== undefined) {
    ledger[to][from] += amount;
    return ledger;
  }

  // Case 3️: no relation exists
  if (!ledger[to]) ledger[to] = {};
  ledger[to][from] = (ledger[to][from] || 0) + amount;

  return ledger;
};



// exports.simplifyBalances = (balanceMap) => {
//   const debtors = [];
//   const creditors = [];

//   for (let userId in balanceMap) {
//     const amount = balanceMap[userId];

//     if (amount < 0) {
//       debtors.push({ userId, amount: -amount });
//     } else if (amount > 0) {
//       creditors.push({ userId, amount });
//     }
//   }

//   const settlements = [];

//   let i = 0, j = 0;

//   while (i < debtors.length && j < creditors.length) {
//     const pay = Math.min(debtors[i].amount, creditors[j].amount);

//     settlements.push({
//       from: debtors[i].userId,
//       to: creditors[j].userId,
//       amount: pay
//     });

//     debtors[i].amount -= pay;
//     creditors[j].amount -= pay;

//     if (debtors[i].amount === 0) i++;
//     if (creditors[j].amount === 0) j++;
//   }

//   return settlements;
// };

// exports.applySettlements = (balances, settlements) => {
//   settlements.forEach(s => {
//     balances[s.from] += s.amount;
//     balances[s.to] -= s.amount;
//   });

//   return balances;
// };




// // exports.calculateBalances = (expenses) => {
// //   const balance = {};

// //   expenses.forEach(exp => {
// //     exp.splits.forEach(split => {
// //       if (split.user.toString() !== exp.paidBy.toString()) {
// //         balance[split.user] = (balance[split.user] || 0) - split.amount;
// //         balance[exp.paidBy] = (balance[exp.paidBy] || 0) + split.amount;
// //       }
// //     });
// //   });

// //   return balance;
// // };
