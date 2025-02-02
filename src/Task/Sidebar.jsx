import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDashboard, MdOutlineTaskAlt, MdAddTask, MdPendingActions, MdCloudDone, MdOutlineAccessTimeFilled, MdQueryStats } from "react-icons/md";
import { GrTask, GrInProgress } from "react-icons/gr";

const Sidebar = () => {
    const [taskStats, setTaskStats] = useState({
        pending: 0,
        inProgress: 0,
        completed: 0,
        deployed: 0,
        deferred: 0,
    });

    useEffect(() => {
        const fetchTaskStats = async () => {
            try {
                const response = await axios.get("https://reactprojectteam-default-rtdb.firebaseio.com/tasks.json");
                
                if (response.data) {
                    const data = response.data;
                    const tasksArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key],
                    }));

                    const stats = {
                        pending: tasksArray.filter(task => task.status === 'Pending').length,
                        inProgress: tasksArray.filter(task => task.status === 'In Progress').length,
                        completed: tasksArray.filter(task => task.status === 'Completed').length,
                        deployed: tasksArray.filter(task => task.status === 'Deployed').length,
                        deferred: tasksArray.filter(task => task.status === 'Deferred').length,
                    };

                    setTaskStats(stats);
                }
            } catch (error) {
                console.error("❌ Error fetching task stats:", error);
            }
        };

        fetchTaskStats();
    }, []);

    return (
        <div className="bg-indigo-600 min-h-[100vh] sm:min-h-screen w-[5rem] sm:w-[19rem] flex flex-col gap-4 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-2 justify-center h-20 text-white text-2xl font-bold mt-6">
                <GrTask className="text-3xl" />
                <span className='sm:block hidden font-semibold'>
                    Task Manager
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 px-4">
                <Link to='/Dashboard' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdDashboard className="text-2xl" />
                    <span className='sm:block hidden'> Dashboard </span>
                </Link>
                <Link to='/statsTask' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdQueryStats className="text-2xl" />
                    <span className='sm:block hidden'> Task Stats </span>
                </Link>
                <Link to='/addTask' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdAddTask className="text-2xl" />
                    <span className='sm:block hidden'> Add New Tasks </span>
                </Link>
                <Link to='/completeTask' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdOutlineTaskAlt className="text-2xl" />
                    <span className='sm:block hidden'> Completed Tasks ({taskStats.completed}) </span>
                </Link>
                <Link to='/pendingTask' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdPendingActions className="text-2xl" />
                    <span className='sm:block hidden'> Pending Tasks ({taskStats.pending}) </span>
                </Link>
                <Link to='/inProgressTask' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <GrInProgress className="text-2xl" />
                    <span className='sm:block hidden'> In Progress Tasks ({taskStats.inProgress}) </span>
                </Link>
                <Link to='/deployedTask' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdCloudDone className="text-2xl" />
                    <span className='sm:block hidden'> Deployed Tasks ({taskStats.deployed}) </span>
                </Link>
                <Link to='/deferredTask' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdOutlineAccessTimeFilled className="text-2xl" />
                    <span className='sm:block hidden'> Deferred Tasks ({taskStats.deferred}) </span>
                </Link>
                <Link to='/addTask' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdAddTask className="text-2xl" />
                    <span className='sm:block hidden'> Add New Tasks </span>
                </Link>
                <Link to='/' className="px-4 py-3 font-semibold text-lg text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-3">
                    <MdAddTask className="text-2xl" />
                    <span className='sm:block hidden'> Back To Home </span>
                </Link>
               
            </nav>
        </div>
    );
};

export default Sidebar;
