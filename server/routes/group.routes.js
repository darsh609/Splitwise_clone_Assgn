const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const auth = require("../middleware/auth.middleware");
 const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");

router.post("/", auth, async (req, res) => {
  try {
    const { name, members = [] } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Group name required" });
    }

    // Remove duplicates + prevent spoofing
    const uniqueMembers = new Set(
      members.map(id => id.toString())
    );

    // Always include creator
    uniqueMembers.add(req.user.toString());

    const group = await Group.create({
      name,
      members: Array.from(uniqueMembers),
      createdBy: req.user
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create group" });
  }
});
// GET all groups the logged-in user is part of
router.get("/my-groups", auth, async (req, res) => {
  try {
    const userId = req.user;

    // Find groups where the logged-in user is a member
    const groups = await Group.find({ members: userId }).populate("members", "name email");
    res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch groups" });
  }
});


// GET all members of a group (including logged-in user)
router.get("/:groupId/members", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user;

    const group = await Group.findById(groupId)
      .populate("members", "name email");

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Authorization check: user must be part of group
    if (!group.members.some(m => m._id.toString() === userId.toString())) {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.status(200).json({
      groupId: group._id,
      groupName: group.name,
      members: group.members
    });
  }
   catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch group members" });
  }
});


// DELETE a group + related expenses & settlements
router.delete("/:groupId", auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { groupId } = req.params;
    const userId = req.user;

    const group = await Group.findById(groupId).session(session);

    if (!group) {
      await session.abortTransaction();
      return res.status(404).json({ msg: "Group not found" });
    }

    //  Authorization: only creator can delete
    if (group.createdBy.toString() !== userId.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ msg: "Only group creator can delete group" });
    }

    //  Delete all expenses of this group
    await Expense.deleteMany({ group: groupId }).session(session);

    //  Delete all settlements of this group
    await Settlement.deleteMany({ group: groupId }).session(session);

    //  Delete the group itself
    await Group.findByIdAndDelete(groupId).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      msg: "Group and related data deleted successfully"
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ msg: "Failed to delete group" });
  }
});



module.exports = router;
