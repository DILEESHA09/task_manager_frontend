import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({ status: 'all' });
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchTasks();
    } else {
      navigate('/login');
    }
  }, [filters, search, navigate]);

  const isAuthenticated = () => {
    const token = localStorage.getItem('access');
    return !!token;
  };

  const fetchTasks = async () => {
    let url = 'http://127.0.0.1:8000/tasks/';
    const params = new URLSearchParams();

    if (filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (search) {
      params.append('search', search);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const token = localStorage.getItem('access');
      axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
      const response = await axios.get(url);
      setTasks(response.data.results);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleCreateTask = async () => {
    try {
      const token = localStorage.getItem('access');
      axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
      await axios.post('http://127.0.0.1:8000/create-task/', newTask);
      setNewTask({ title: '', description: '' });
      setShowCreateModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEditTask = async (id) => {
    try {
      const token = localStorage.getItem('access');
      axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
      await axios.put(`http://127.0.0.1:8000/tasks/${id}/`, editTask);
      setEditTask(null);
      setShowEditModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem('access');
      axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
      await axios.delete(`http://127.0.0.1:8000/tasks/${id}/`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const token = localStorage.getItem('access');
      axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
      await axios.put(`http://127.0.0.1:8000/tasks/${task.id}/`, {
        status: !task.status,
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  const handleTaskClick = async (id) => {
    try {
      const token = localStorage.getItem('access');
      axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
      const response = await axios.get(`http://127.0.0.1:8000/tasks/${id}/`);
      setSelectedTask(response.data);
    } catch (error) {
      console.error('Failed to fetch task details:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center">Task Manager</h1>


      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Task
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded w-1/2 p-2 mb-4 shadow-md"
        />
      </div>

      <div className="flex justify-center mb-6 space-x-2">
        <button
          className={`px-4 py-2 rounded ${filters.status === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'} shadow-md hover:bg-blue-400 transition`}
          onClick={() => setFilters({ status: 'all' })}
        >
          All Tasks
        </button>
        <button
          className={`px-4 py-2 rounded ${filters.status === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'} shadow-md hover:bg-blue-400 transition`}
          onClick={() => setFilters({ status: 'pending' })}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded ${filters.status === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'} shadow-md hover:bg-blue-400 transition`}
          onClick={() => setFilters({ status: 'completed' })}
        >
          Completed
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-4/5">
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-700 mb-4">{task.description}</p>
            <div className="mb-4">
              <button
                className={`px-4 py-2 rounded ${task.status ? 'bg-green-500' : 'bg-red-500'} text-white shadow-md hover:bg-opacity-90 transition`}
                onClick={() => toggleTaskStatus(task)}
              >
                {task.status ? 'Completed' : 'Pending'}
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 transition"
                onClick={() => {
                  setEditTask(task);
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
                onClick={() => handleTaskClick(task.id)}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <input
              type="text"
              value={editTask.title}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              className="border border-gray-300 rounded w-full p-2 mb-4 shadow-md"
            />
            <textarea
              value={editTask.description}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              className="border border-gray-300 rounded w-full p-2 mb-4 shadow-md"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 shadow-md hover:bg-blue-600 transition"
              onClick={() => handleEditTask(editTask.id)}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Create Task</h2>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Title"
              className="border border-gray-300 rounded w-full p-2 mb-4 shadow-md"
            />
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Description"
              className="border border-gray-300 rounded w-full p-2 mb-4 shadow-md"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 shadow-md hover:bg-blue-600 transition"
              onClick={handleCreateTask}
            >
              Create Task
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Task Details</h2>
            <p className="mb-4"><strong>Title:</strong> {selectedTask.title}</p>
            <p className="mb-4"><strong>Description:</strong> {selectedTask.description}</p>
            <p className="mb-4"><strong>Status:</strong> {selectedTask.status ? 'Completed' : 'Pending'}</p>
            <p className="mb-4"><strong>Created At:</strong> {selectedTask.created_at}</p>
            <p className="mb-4"><strong>Updated At:</strong> {selectedTask.updated_at}</p>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition"
              onClick={() => setSelectedTask(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
