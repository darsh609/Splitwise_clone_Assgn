const Settlement = require("../models/Settlement");

exports.settleUp = async (req, res) => {
  const { from, to, amount, group } = req.body;
  if (amount <= 0) {
  throw new Error("Settlement amount must be positive");
}
  const settlement = await Settlement.create({
    from:req.user,
    to,
    amount,
    group
  });

  res.json(settlement);
};
// GET all settlements involving logged-in user
exports.getMySettlements = async (req, res) => {
  const userId = req.user;
console.log(userId);
  const settlements = await Settlement.find(
    {
    $or: [{ from: userId }, { to: userId }]
  }
) .populate("from", "name")
    .populate("to", "name")
    .populate("group", "name");

console.log(settlements);
  res.json(settlements);
};
// DELETE settlement
exports.deleteSettlement = async (req, res) => {
  const { settlementId } = req.params;

  const settlement = await Settlement.findById(settlementId);

  if (!settlement) {
    return res.status(404).json({ msg: "Settlement not found" });
  }


  if (settlement.from.toString() !== req.user.toString()) {
    return res.status(403).json({ msg: "Not authorized to delete this settlement" });
  }

  await settlement.deleteOne();

  res.json({ msg: "Settlement deleted successfully" });
};
