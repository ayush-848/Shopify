import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, KeyRound, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    adminKey: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'role' && value !== 'admin') {
      setForm(prev => ({ ...prev, adminKey: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setMessageType(null);

    let result;
    if (activeTab === 'signup') {
      if (form.role === 'admin' && !form.adminKey.trim()) {
        setMessage('Admin Key is required for Admin registration.');
        setMessageType('error');
        return;
      }

      result = await signUp(form.username, form.email, form.password, form.role, form.adminKey.trim());
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        setActiveTab('login');
        setForm({ username: '', email: '', password: '', role: 'user', adminKey: '' });
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } else {
      result = await login(form.email, form.password);
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        navigate('/');
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200 relative">
        <div className="flex border-b mb-8">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 transition cursor-pointer
              ${activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-t-xl'
                : 'text-gray-500 hover:text-blue-600'}`}
          >
            <LogIn size={20} /> Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 transition cursor-pointer
              ${activeTab === 'signup'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50 rounded-t-xl'
                : 'text-gray-500 hover:text-green-600'}`}
          >
            <UserPlus size={20} /> Sign Up
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 text-sm text-center px-3 py-2 rounded-lg font-medium
              ${messageType === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'signup' && (
            <>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
              </div>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={18} />
              </div>
              {form.role === 'admin' && (
                <div className="relative">
                  <input
                    type="password"
                    name="adminKey"
                    placeholder="Admin Key"
                    value={form.adminKey}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    required
                  />
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" size={18} />
                </div>
              )}
            </>
          )}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              required
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              required
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 cursor-pointer
              ${activeTab === 'signup'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {activeTab === 'signup' ? <UserPlus size={18} /> : <LogIn size={18} />}
            {activeTab === 'signup' ? 'Create Account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;