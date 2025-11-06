import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          🚀 Employee Task Management System
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-10">
          A powerful and intuitive platform that helps{' '}
          <span className="text-emerald-400 font-semibold">Admins</span> assign
          tasks and{' '}
          <span className="text-emerald-400 font-semibold">Employees</span>{' '}
          manage them efficiently — built using{' '}
          <b>Node.js, Express, MongoDB, and React</b>.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300">
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto border border-emerald-500 hover:bg-emerald-600 hover:text-white text-emerald-400 px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300">
            Register
          </button>
        </div>
      </motion.div>

      {/* Footer / Info */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 text-center text-gray-500 text-sm">
        <p>
          Built with 💚 by{' '}
          <a
            href="https://princebhatt03.github.io/Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline">
            Prince Bhatt
          </a>
        </p>
      </motion.footer>
    </div>
  );
};

export default Home;
