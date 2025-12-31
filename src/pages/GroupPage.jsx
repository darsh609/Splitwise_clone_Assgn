
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Users, Plus, X, DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { Trash2 } from "lucide-react";
export default function GroupPage() {
  const { groupId } = useParams();
  const [selectedSplitUsers, setSelectedSplitUsers] = useState([]);
  const [splitValues, setSplitValues] = useState({});
const [groupName, setGroupName] = useState("");

  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState("EQUAL");


const handleDeleteExpense = (expenseId) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="font-medium">Delete this expense?</p>
        <div className="flex gap-3 mt-2">
          <button
            className="text-sm text-gray-600"
            onClick={closeToast}
          >
            Cancel
          </button>
          <button
            className="text-sm text-red-600"
            onClick={async () => {
              try {
                await api.delete(`/expenses/${expenseId}`);
                setExpenses(prev => prev.filter(e => e._id !== expenseId));
                closeToast();
              } catch {
                alert("Failed to delete expense");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};


  const toggleSplitUser = (userId) => {
    // Prevent unchecking if user is the payer
    if (paidBy && userId === paidBy && selectedSplitUsers.includes(userId)) {
      toast.error("Cannot remove the person who paid from split!");
      return;
    }

    setSelectedSplitUsers(
      prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );

    // Clear split value if user is removed
    if (selectedSplitUsers.includes(userId))
       {
      setSplitValues(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }
  };

  // Auto-select paidBy user in split between
  useEffect(() => {
    if (paidBy && !selectedSplitUsers.includes(paidBy)) {
      setSelectedSplitUsers(prev => [...prev, paidBy]);
    }
  }, [paidBy]);

  const handleSplitValueChange = (userId, value) => {
    setSplitValues(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  useEffect(() => {
    fetchMembers();
    fetchExpenses();
  }, []);

 const fetchMembers = async () => {
  try {
    const res = await api.get(`/groups/${groupId}/members`);
    setMembers(res.data.members);
    setGroupName(res.data.groupName); // 🔥 ADD THIS
  } catch (error) {
    toast.error("Failed to fetch members");
  }
};


  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses/group/${groupId}`);
      setExpenses(res.data);
    } catch (error) {
      toast.error("Failed to fetch expenses");
    }
  };

  const addExpense = async () => {
    // Validation
    if (!description) {
      toast.error("Please enter a description");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!paidBy) {
      toast.error("Please select who paid");
      return;
    }
    if (selectedSplitUsers.length === 0) {
      toast.error("Please select at least one person to split between");
      return;
    }

    let splits = [];

    // Build splits based on type
    if (splitType === "EQUAL") {
      splits = selectedSplitUsers.map(userId => ({
        user: userId
      }));
    }

    if (splitType === "EXACT") {
      // Validate all users have exact amounts
      for (let userId of selectedSplitUsers) {
        if (!splitValues[userId] || Number(splitValues[userId]) < 0) {
          toast.error("Please enter exact amounts for all selected users");
          return;
        }
      }

      // Validate total equals amount
      const total = selectedSplitUsers.reduce((sum, userId) => 
        sum + Number(splitValues[userId] || 0), 0
      );
      
      if (Math.abs(total - Number(amount)) > 0.01) {
        toast.error(`Exact amounts must add up to ₹${amount}. Current total: ₹${total.toFixed(2)}`);
        return;
      }

      splits = selectedSplitUsers.map(userId => ({
        user: userId,
        amount: Number(splitValues[userId])
      }));
    }

    if (splitType === "PERCENTAGE") {
      // Validate all users have percentages
      for (let userId of selectedSplitUsers) {
        if (!splitValues[userId] || Number(splitValues[userId]) < 0) {
          toast.error("Please enter percentages for all selected users");
          return;
        }
      }

      // Validate total equals 100%
      const total = selectedSplitUsers.reduce((sum, userId) => 
        sum + Number(splitValues[userId] || 0), 0
      );
      
      if (Math.abs(total - 100) > 0.01) {
        toast.error(`Percentages must add up to 100%. Current total: ${total.toFixed(2)}%`);
        return;
      }

      splits = selectedSplitUsers.map(userId => ({
        user: userId,
        percentage: Number(splitValues[userId])
      }));
    }

    try {
      await api.post("/expenses", {
        description,
        amount: Number(amount),
        paidBy,
        group: groupId,
        splitType,
        splits
      });

      toast.success("Expense added successfully!");

      // Reset form
      setDescription("");
      setAmount("");
      setPaidBy("");
      setSplitType("EQUAL");
      setSelectedSplitUsers([]);
      setSplitValues({});
      setShowForm(false);

      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add expense");
    }
  };
  const navigate = useNavigate();


  return (
  <div className="min-h-screen bg-slate-950 from-gray-900 via-slate-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with gradient */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
             <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
  {groupName || "Loading..."}
</h2>

              <p className="text-gray-400 text-sm">Track expenses with your group</p>
            </div>
          </div>
        </div>

        {/* Members Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Group Members</h3>
            <span className="ml-auto bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
              {members.length} members
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {members.map(m => (
              <div
                key={m._id}
                className="group px-4 py-2.5 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-purple-500/20 hover:to-pink-500/20 border border-slate-600/50 hover:border-purple-500/50 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 group-hover:bg-purple-400 transition-colors"></div>
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? "Cancel" : "Add Expense"}
          </button>

          <button
             onClick={() => navigate(`/groups/${groupId}/balances`)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50"
          >
            <TrendingUp className="w-5 h-5" />
            View Balances
          </button>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-purple-400" />
              New Expense
            </h3>
            
            <div className="space-y-4">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  placeholder="e.g., Agra Fort Entry Tickets"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-gray-500"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-gray-500"
                />
              </div>

              {/* Paid By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Paid By</label>
                <select
                  value={paidBy}
                  onChange={e => setPaidBy(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors cursor-pointer"
                >
                  <option value="">Select member</option>
                  {members.map(m => (
                    <option key={m._id} value={m._id}>
                      {m.name || m.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Split Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Split Type</label>
                <select
                  value={splitType}
                  onChange={e => {
                    setSplitType(e.target.value);
                    setSplitValues({});
                  }}
                  className="w-full bg-slate-900/70 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors cursor-pointer"
                >
                  <option value="EQUAL">Equal Split</option>
                  <option value="EXACT">Exact Amount</option>
                  <option value="PERCENTAGE">Percentage</option>
                </select>
              </div>

              {/* Split Between */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Split Between</label>
                <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {members.map(m => (
                      <div key={m._id}>
                        <label className="flex items-center gap-3 py-2.5 px-3 cursor-pointer hover:bg-slate-800/50 rounded-lg transition-colors group">
                          <input
                            type="checkbox"
                            checked={selectedSplitUsers.includes(m._id)}
                            onChange={() => toggleSplitUser(m._id)}
                            disabled={paidBy === m._id && selectedSplitUsers.includes(m._id)}
                            className="w-5 h-5 accent-purple-500 cursor-pointer"
                          />
                          <span className="flex-1 font-medium group-hover:text-purple-300 transition-colors">
                            {m.name || m.email}
                            {paidBy === m._id && selectedSplitUsers.includes(m._id) && (
                              <span className="text-xs text-purple-400 ml-2 font-normal">(Payer)</span>
                            )}
                          </span>
                          
                          {selectedSplitUsers.includes(m._id) && (splitType === "EXACT" || splitType === "PERCENTAGE") && (
                            <input
                              type="number"
                              placeholder={splitType === "EXACT" ? "₹" : "%"}
                              value={splitValues[m._id] || ""}
                              onChange={(e) => handleSplitValueChange(m._id, e.target.value)}
                              className="bg-slate-800 border border-slate-600 focus:border-purple-500 rounded-lg px-3 py-1.5 w-24 text-sm outline-none transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={addExpense}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-3.5 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/50"
              >
                Save Expense
              </button>
            </div>
          </div>
        )}

        {/* Expense List */}
        <div>
          <h3 className="text-2xl font-semibold mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
           Recent Expenses 
          </h3>

          {expenses.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400">No expenses yet</p>
              <p className="text-sm text-gray-500 mt-1">Add your first expense to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...expenses].reverse().map(exp => (
                <div
                  key={exp._id}
                  className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-800/70 hover:to-slate-900/70 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/50 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:scale-[1.01]"
                >
              
                  <div className="flex items-start justify-between mb-3">
  <div>
    <p className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
      ₹{exp.amount.toLocaleString()}
    </p>
    <p className="text-gray-300 font-medium mt-1">
      {exp.description}
    </p>
  </div>

  <div className="flex items-center gap-3">
    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
      {exp.splitType}
    </span>

    {/* Delete Icon */}
    <button
      onClick={() => handleDeleteExpense(exp._id)}
      className="opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-500"
      title="Delete Expense"
    >
      <Trash2 size={18} />
    </button>
  </div>
</div>

                  
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xs font-bold">
                      {exp.paidBy.name.charAt(0)}
                    </div>
                    <p className="text-sm text-gray-400">
                      Paid by <span className="text-green-400 font-medium">{exp.paidBy.name}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    {exp.splits
                      .filter(s => s.user._id !== exp.paidBy._id)
                      .map(s => (
                        <div
                          key={s.user._id}
                          className="flex items-center justify-between py-2 px-3 bg-slate-800/30 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold">
                              {s.user.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-300">{s.user.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-orange-400">owes ₹{s.amount}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}