import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { database, ref, push, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AddTask = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: null,
        status: 'Pending',
        assignee: '',
        priority: 'P0'
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [user, setUser] = useState(null); // Store the current authenticated user

    useEffect(() => {
        // Check the user's authentication status when the component mounts
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Set user if authenticated
            } else {
                setUser(null); // Set user to null if not authenticated
            }
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEndDateChange = (date) => {
        setFormData({
            ...formData,
            endDate: date
        });
    };

    const handleStartDateChange = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            setFormData({
                ...formData,
                startDate: date
            });
        }
    };
 
    



    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            setError('You need to be logged in to add a task!');
            return;
        }

        if (!formData.title) {
            setError('Title is required!');
            return;
        }

        if (formData.endDate && formData.startDate > formData.endDate) {
            setError('End date cannot be before start date!');
            return;
        }

        setError('');

        const serializableFormData = {
            ...formData,
            startDate: formData.startDate.toISOString(),
            endDate: formData.endDate ? formData.endDate.toISOString() : null,
            userId: user.uid // Store the userId with the task data
        };

        const newTaskRef = ref(database, 'tasks');
        push(newTaskRef, serializableFormData)
            .then(() => {
                setSuccessMessage('Task added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setFormData({
                    title: '',
                    description: '',
                    startDate: new Date(),
                    endDate: null,
                    status: 'Pending',
                    assignee: '',
                    priority: 'P0'
                });
            })
            .catch((error) => {
                setError('Error adding task: ' + error.message);
            });
    };

    return (
        <div className="w-[70%] mx-auto">
            <div className=''>
                <h1 className="text-3xl font-bold my-8 text-center">Add New Task</h1>
                <div className='grid place-items-center'>
                    <form className="w-full mt-12 sm:mt-0 max-w-lg" onSubmit={handleSubmit}>
                        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
                        {successMessage && <div className="text-green-600 mb-4 text-center">{successMessage}</div>}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                                    id="title"
                                    type="text"
                                    placeholder="Task Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                                    id="description"
                                    placeholder="Task Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="startDate">
                                    Start Date
                                </label>
                                <DatePicker
                                    selected={formData.startDate}
                                    onChange={handleStartDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="endDate">
                                    End Date
                                </label>
                                <DatePicker
                                    selected={formData.endDate}
                                    onChange={handleEndDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="status">
                                    Status
                                </label>
                                <select
                                    className="block appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Deployed">Deployed</option>
                                    <option value="Deferred">Deferred</option>
                                </select>
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="priority">
                                    Priority
                                </label>
                                <select
                                    className="block appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="P0">P0</option>
                                    <option value="P1">P1</option>
                                    <option value="P2">P2</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-8 w-full p-3 bg-indigo-500 rounded-lg text-center text-white hover:bg-indigo-600 transition duration-300"
                        >
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTask;

