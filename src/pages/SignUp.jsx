import React from "react";
import { motion } from "framer-motion";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
      <Header />
      <div className="flex items-center justify-center flex-1">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <motion.div whileHover={{ rotate: 10 }} className="bg-indigo-100 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 11c0-.942.658-1.743 1.555-1.94l4.274-.949a2 2 0 012.349 2.26l-.42 3.362A7.97 7.97 0 0112 20a7.97 7.97 0 01-7.758-6.267l-.42-3.362a2 2 0 012.349-2.26l4.274.949C11.342 9.257 12 10.058 12 11z" />
            </svg>
          </motion.div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Create Account</h1>
        <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">
          Sign up to get started with SecureApp
        </p>

        {/* Form */}
        <form className="space-y-4">
          <input type="text" placeholder="Full name"
                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
          <input type="email" placeholder="Email address"
                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
          <input type="password" placeholder="Password"
                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
          <input type="password" placeholder="Confirm password"
                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Sign Up
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-sm text-gray-500">Or sign up with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social SignUp */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
          <motion.button whileHover={{ scale: 1.05 }}
            className="flex-1 border rounded-lg py-2 flex items-center justify-center hover:bg-gray-50 transition">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg"
                 alt="Google" className="w-5 h-5 mr-2" />
            Google
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }}
            className="flex-1 border rounded-lg py-2 flex items-center justify-center hover:bg-gray-50 transition">
            <img src="https://www.svgrepo.com/show/475654/github-color.svg"
                 alt="GitHub" className="w-5 h-5 mr-2" />
            GitHub
          </motion.button>
        </div>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/user-login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </a>
        </p>
      </motion.div>
      </div>
      <Footer />
    </div>
  );
}
