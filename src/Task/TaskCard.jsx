
import React, { useState, useEffect } from 'react';
import { ref, get, set, update } from '../firebase'; 
import axios from 'axios';
import { database ,onValue, auth} from '../firebase';

const TaskCard = ({
    id,
    title = 'No title provided', 
    description = 'No description available', 
    startDate = 'No start date', 
    endDate = 'No end date', 
    status = 'No status', 
    assignee = 'N/A', 
    priority = 'Normal', 
    
}) => {
    const [complete, setComplete] = useState(status && status.toLowerCase() === "completed");
    const [assignedUsersCount, setAssignedUsersCount] = useState(0);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showUserList, setShowUserList] = useState(false);
    const [userId, setUserId] = useState(null);
    // إضافة الحالة لعرض قائمة الاختيارات للـ status
    const [showStatusSelect, setShowStatusSelect] = useState(false);
    const [newStatus, setNewStatus] = useState(status);

    // حالة القيم الجديدة للتحديث
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [updatedDescription, setUpdatedDescription] = useState(description);
    const [updatedPriority, setUpdatedPriority] = useState(priority);
    
    const [showAddUserForm, setShowAddUserForm] = useState(false);  // إضافة هذا السطر لتعريف الحالة
    


    const [role, setRole] = useState(null); // لتخزين الدور
    const [isManager, setIsManager] = useState(false); 



    const getDate = (dateString) => {
        const dateObject = new Date(dateString);
        return dateObject.toLocaleDateString();
    };

    const startDatee = getDate(startDate);
    const endDatee = getDate(endDate);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "in progress":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "deferred":
                return "bg-gray-100 text-gray-800";
            case "deployed":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleToggleCompleted = async () => {
        const newStatus = complete ? "Pending" : "Completed";
        try {
            await axios.patch(`${FIREBASE_URL}/${id}.json`, { status: newStatus });
            setComplete(!complete);
        } catch (error) {
            console.error("❌ Error updating task:", error);
        }
    };

    const fetchAssignedUsers = async () => {
        try {
            const assignedUsersRef = ref(database, `tasks/${id}/assignedUsers`);
            const snapshot = await get(assignedUsersRef);
            const assignedUsersData = snapshot.val() || {};

            const usersRef = ref(database, 'users');
            const usersSnapshot = await get(usersRef);
            const usersData = usersSnapshot.val() || {};

            const usersList = Object.keys(assignedUsersData).map(userId => usersData[userId].email);
            setAssignedUsers(usersList);
            setAssignedUsersCount(usersList.length);
        } catch (error) {
            console.error('Error fetching assigned users:', error);
        }
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserId(user.uid);
        }
    }, []);

    useEffect(() => {
        if (!userId) return;
    
        const roleRef = ref(database, `users/${userId}/role`);
        const unsubscribe = onValue(roleRef, (snapshot) => {
            const role = snapshot.val();
            setIsManager(role === 'manager');
        });
    
        fetchAssignedUsers();
    
        return () => unsubscribe();
    }, [id, userId]);
    

    const handleAddUser = async () => {
        try {
            const usersRef = ref(database, 'users');
            const snapshot = await get(usersRef);
            const users = snapshot.val();

            let userExists = false;
            for (const userId in users) {
                if (users[userId].email === userEmail) {
                    userExists = true;
                    break;
                }
            }

            if (userExists) {
                const userIdToAdd = Object.keys(users).find(userId => users[userId].email === userEmail);
                const taskRef = ref(database, `tasks/${id}/assignedUsers/${userIdToAdd}`);
                await set(taskRef, true);

                const userTasksRef = ref(database, `users/${userIdToAdd}/tasks/${id}`);
                await set(userTasksRef, true);

                await fetchAssignedUsers();

                alert('User added to the task successfully!');
                setUserEmail('');
            } else {
                alert('User not found! Please make sure the user is registered.');
            }
        } catch (error) {
            console.error('Error adding user to task:', error);
        }
    };

    const handleUpdateTask = async () => {
        try {
            const taskRef = ref(database, `tasks/${id}`);
            await update(taskRef, {
                title: updatedTitle,
                description: updatedDescription,
                priority: updatedPriority,
                status: newStatus // تحديث الحالة هنا
            });
            setShowUpdateForm(false);
            alert('Task updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleSoftDelete = async () => {
        try {
            const taskRef = ref(database, `tasks/${id}`);
            await update(taskRef, { isDeleted: true });
            alert('Task marked as deleted!');
        } catch (error) {
            console.error('Error marking task as deleted:', error);
        }
    };

    // التعامل مع تغيير الحالة
    const handleStatusChange = async (e) => {
        const selectedStatus = e.target.value;
        setNewStatus(selectedStatus); // تحديث الحالة في المكون المحلي
        try {
            const taskRef = ref(database, `tasks/${id}`);
            await update(taskRef, { status: selectedStatus }); // تحديث الحالة في قاعدة البيانات
            setShowStatusSelect(false); // إغلاق القائمة بعد التحديث
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };





    return (
        <div className="flex flex-col rounded-2xl bg-white w-80 min-h-[420px] shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
          {/* Header Section with Status and Priority */}
          <div className={`relative mt-6 mx-6 rounded-xl ${getStatusColor(status)} shadow-md`}>
            <div className="absolute top-3 right-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
              <h1 className="absolute left-3 top-0  text-sm font-medium text-gray-600 tracking-wide">
                {/* <h1 className="absolute left-3  top-0  right-0 m-2 bottom-8 text-sm font-medium text-gray-600 tracking-wide bg-white px-2 py-1 rounded-md shadow"> */}
                {priority}</h1>
            </div>
            <h1 className="font-bold text-center text-xl pt-8 pb-6 px-4 text-gray-800">{title}</h1>
          </div>
    
          {/* Description Section */}
          <div className="px-6 pt-6">
            <p className="text-sm text-gray-600 leading-relaxed text-center">{description}</p>
            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-2">Start Date</p>
                  <p className="text-gray-700 font-medium">{startDatee}</p>
                </div>
                <div className="h-8 w-px bg-gray-200 mx-4"></div>
                <div className="flex flex-col items-center flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-2">End Date</p>
                  <p className="text-gray-700 font-medium">{endDatee}</p>
                </div>
              </div>
            </div>
          </div>
    
          {/* Status Button Section */}
          <div className="px-6 pt-6">
            <button
              onClick={() => setShowStatusSelect(!showStatusSelect)}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-md ${getStatusColor(status)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {newStatus}
            </button>
          </div>
    
          {/* Status Select Dropdown */}
          {showStatusSelect && (
            <div className="px-6 pt-3">
              <select
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                id="status"
                name="status"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Deployed">Deployed</option>
                <option value="Deferred">Deferred</option>
              </select>
            </div>
          )}
    
          {/* Users Section */}
          <div className="px-6 pt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-gray-600">{assignee}</p>
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <p className="text-sm font-medium text-gray-600">{assignedUsersCount} Users</p>
              </div>
            </div>
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-300"
            >
              {showUserList ? 'Hide Users' : 'Show Users'}
            </button>
          </div>
    
          {/* User List */}
          {showUserList && (
            <div className="px-6 pt-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Assigned Users</h3>
                <ul className="space-y-2">
                  {assignedUsers.map((email, index) => (
                    <li 
                      key={index} 
                      className="py-2 px-3 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                    >
                      {email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )} {/* Buttons */}
    {isManager && (
         
          <div className="mt-4 px-6 py-3 space-x-4 flex justify-between">
            <button
              onClick={() => setShowAddUserForm(true)}
              className="bg-green-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-green-600 transition-all duration-300 shadow-sm"
            >
              Add User
            </button>
            <button
                onClick={() => setShowUpdateForm(true)}
                className="flex-1 bg-yellow-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-yellow-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Update
              </button>
            <button
              onClick={handleSoftDelete}
              className="bg-red-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-red-600 transition-all duration-300 shadow-sm"
            >
              Delete
            </button>
          </div>
    )}
           {/* Update Task Form */}
           {showUpdateForm && (
            <div className="px-6 py-4 bg-white shadow-md rounded-xl mt-4">
              <div className="space-y-4">
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  placeholder="Updated title"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  placeholder="Updated description"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={updatedPriority}
                  onChange={(e) => setUpdatedPriority(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div className="flex justify-between">
                  <button
                    onClick={handleUpdateTask}
                    className="bg-blue-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowUpdateForm(false)}
                    className="bg-gray-400 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-gray-500 transition-all duration-300 shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
           {/* Add User Form */}
           {showAddUserForm && (
            <div className="px-6 py-4 bg-white shadow-md rounded-xl mt-4">
              <div className="space-y-4">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter user email"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between">
                  <button
                    onClick={handleAddUser}
                    className="bg-blue-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 shadow-sm"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => setShowAddUserForm(false)}
                    className="bg-gray-400 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-gray-500 transition-all duration-300 shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    );
};

export default TaskCard;
