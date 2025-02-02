import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { database, ref, get } from '../firebase';  // استيراد Firebase

const Card = ({ label, count, bg }) => {
    return (
        <Link to='/allTask'>
         <div className="w-full md:w-64 h-60 bg-white p-5 shadow-md rounded-md flex flex-col justify-between cursor-pointer">


                <div className="h-full flex flex-1 flex-col justify-between">
                    <p className="text-base text-gray-600">{label}</p>
                    <span className="text-2xl font-semibold">{count}</span>
                    <span className="text-sm text-gray-400">{"110 last month"}</span>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${bg}`}>
                    {label.charAt(0)}
                </div>
            </div>
        </Link>
    );
};

Card.propTypes = {
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    bg: PropTypes.string.isRequired,
};

const Dashboard = () => {
    const [stats, setStats] = useState([
        {
            label: "TOTAL TASK",
            total: 0,
            bg: "bg-[#1d4ed8]",
        },
        {
            label: "COMPLETED TASK",
            total: 0,
            bg: "bg-[#0f766e]",
        },
        {
            label: "TASK IN PROGRESS",
            total: 0,
            bg: "bg-[#f59e0b]",
        },
        {
            label: "PENDING",
            total: 0,
            bg: "bg-[#be185d]",
        },
        {
            label: "DEPLOYED",
            total: 0,
            bg: "bg-[#f59e0b]",
        },
        {
            label: "DEFERRED",
            total: 0,
            bg: "bg-[#0f766e]",
        },
    ]);

    useEffect(() => {
        // جلب جميع المهام من Firebase
        const tasksRef = ref(database, "tasks");
        get(tasksRef).then(snapshot => {
            const tasksData = snapshot.val();
            if (tasksData) {
                const totalTasks = Object.values(tasksData).length;
                const completedTasks = Object.values(tasksData).filter(task => task.status === 'Completed').length;
                const inProgressTasks = Object.values(tasksData).filter(task => task.status === 'In Progress').length;
                const pendingTasks = Object.values(tasksData).filter(task => task.status === 'Pending').length;

                setStats(prevStats => [
                    { ...prevStats[0], total: totalTasks },  // إجمالي المهام
                    { ...prevStats[1], total: completedTasks },  // المهام المكتملة
                    { ...prevStats[2], total: inProgressTasks },  // المهام الجارية
                    { ...prevStats[3], total: pendingTasks },  // المهام المعلقة
                    { ...prevStats[4], total: 10 },  // عدد المهام الموزعة (قيمة افتراضية هنا)
                    { ...prevStats[5], total: 5 },  // عدد المهام المؤجلة (قيمة افتراضية هنا)
                ]);
            }
        });
    }, []);

    return (
        <div className="mx-full w-[80%]">
            <div className="flex flex-col w-full justify-between" >
                <h1 className="sm:text-2xl text-3xl font-bold my-8 text-center">Tasks</h1>
                <div className="h-auto w-80% mx-auto py-4 px-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4  place-items-center mt-4">
                        {stats.map(({ label, total, bg }, index) => (
                            <Card key={index} bg={bg} label={label} count={total} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
