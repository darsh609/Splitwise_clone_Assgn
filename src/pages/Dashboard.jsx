
// import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Users, Plus, TrendingUp } from "lucide-react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";


export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
const handleDeleteGroup = async (e, groupId) => {
  e.stopPropagation(); // prevent opening group

  toast.warn(
    ({ closeToast }) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">
          Delete this group?
        </p>
        <p className="text-sm">
          This will delete the group, expenses & settlements.
        </p>

        <div className="flex gap-3 mt-2">
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={async () => {
              try {
                await api.delete(`/groups/${groupId}`);
                setGroups(prev => prev.filter(g => g._id !== groupId));
                toast.success("Group deleted successfully");
              } catch (err) {
                toast.error(
                  err.response?.data?.msg || "Failed to delete group"
                );
              } finally {
                closeToast();
              }
            }}
          >
            Delete
          </button>

          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={closeToast}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};


  useEffect(() => {
    fetchGroups();
    fetchUsers();
    fetchBalance();
  }, []);

  const fetchGroups = async () => {
    const res = await api.get("/groups/my-groups");
    setGroups(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users/all-users");
    setUsers(res.data);
  };

  const fetchBalance = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
      const res = await api.get(`/expenses/user/${userId}/balance`);
      console.log("Fetched balance:", res.data);  
      setBalance(res.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;

    console.log("Creating group with:", selectedUsers);

    await api.post("/groups", {
      name: groupName,
      members: selectedUsers
    });

    setGroupName("");
    setSelectedUsers([]);
    fetchGroups();
  };

  const getTotalOwed = () => {
    if (!balance) return 0;
    return balance.youOwe.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalOwedToYou = () => {
    if (!balance) return 0;
    return balance.youAreOwed.reduce((sum, item) => sum + item.amount, 0);
  };

  const getNetBalance = () => {
    return getTotalOwedToYou() - getTotalOwed();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            GroupPay Dashboard
          </h1>
          <p className="text-slate-400">
            Manage your expense sharing groups and track balances
          </p>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Net Balance */}
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">Net Balance</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className={`text-3xl font-bold ${getNetBalance() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₹{Math.abs(getNetBalance()).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {getNetBalance() >= 0 ? 'You are owed' : 'You owe'}
            </p>
          </div>

          {/* You Owe */}
          <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">You Owe</span>
              <ArrowUpRight className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400">
              ₹{getTotalOwed().toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {balance?.youOwe?.length || 0} person(s)
            </p>
          </div>

          {/* You Are Owed */}
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">You Are Owed</span>
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">
              ₹{getTotalOwedToYou().toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {balance?.youAreOwed?.length || 0} person(s)
            </p>
          </div>
        </div>

        {/* Detailed Balance Breakdown */}
        {balance && (balance.youOwe.length > 0 || balance.youAreOwed.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* You Owe Details */}
            {balance.youOwe.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-red-400" />
                  <span>You Owe</span>
                </h3>
                <div className="space-y-3">
                  {balance.youOwe.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-300">User: {item.name}</span>
                      <span className="text-red-400 font-semibold">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* You Are Owed Details */}
            {
            balance.youAreOwed.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  <span>You Are Owed</span>
                </h3>
                <div className="space-y-3">
                  {balance.youAreOwed.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-300">User: {item.name}</span>
                      <span className="text-green-400 font-semibold">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
            }
          </div>
        )}

        {/* Create Group Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Plus className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-semibold">Create New Group</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">
                Group Name
              </label>
              <input
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                placeholder="e.g. Goa Trip, Office Lunch..."
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
            </div>

            {/* Members Select */}
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-medium">
                Add Members
              </label>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 max-h-48 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-slate-500 text-sm">No users available</p>
                ) : (
                  users.map(user => (
                    <label
                      key={user._id}
                      className="flex items-center gap-3 py-2 px-2 cursor-pointer hover:bg-slate-700/50 rounded-lg transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUser(user._id)}
                        className="w-4 h-4 accent-purple-500"
                      />
                      <span className="text-slate-200">{user.name || user.email}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <button
            onClick={createGroup}
            disabled={!groupName.trim() || selectedUsers.length === 0}
            className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
          >
            Create Group
          </button>
        </div>

        {/* Groups List */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-semibold">Your Groups</h3>
          </div>

          {groups.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center backdrop-blur-sm">
              <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">No groups created yet. Create your first group above!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {groups.map(group => (
                <div
  key={group._id}
  onClick={() => navigate(`/groups/${group._id}`)}
  className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition cursor-pointer backdrop-blur-sm group"
>
  {/* DELETE ICON */}
  <button
    onClick={(e) => handleDeleteGroup(e, group._id)}
    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-500"
    title="Delete Group"
  >
    <Trash2 className="w-5 h-5" />
  </button>

  <div className="flex items-start justify-between mb-3">
    <div className="bg-purple-500/20 p-3 rounded-xl group-hover:bg-purple-500/30 transition">
      <Users className="w-6 h-6 text-purple-400" />
    </div>
  </div>

  <h4 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition">
    {group.name}
  </h4>

  <p className="text-slate-400 text-sm">
    {group.members.length} member{group.members.length !== 1 ? "s" : ""}
  </p>
</div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}