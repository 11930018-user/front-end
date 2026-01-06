import React from "react";
// NOTE: Ensure your burger image path is correct:
import burger from "../assets/img/burger.png"; 

// This component accepts a function prop, onSwitchToLogin, to allow the parent
// (the Auth Page container) to switch the view back to the Login form.
const SignUp = ({ onSwitchToLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      {/* Main Card Container */}
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-2xl rounded-xl overflow-hidden">
        
        {/* 1. Left Section - Visual/Branding (Deep Red/Maroon) */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center p-8 bg-red-800 text-white relative">
          <h1 className="text-4xl font-extrabold mb-4 tracking-wider">
            Welcome, New Taster!
          </h1>
          <p className="text-center text-lg mb-8 opacity-90">
            Join the community! Sign up to get exclusive deals and express checkout.
          </p>
          <img 
            src={burger} 
            alt="Delicious Food Combo" 
            className="w-full max-w-xs object-cover rounded-lg shadow-xl"
          />
        </div>

        {/* 2. Right Section - Sign Up Form */}
        <div className="flex-1 flex justify-center items-center p-8 sm:p-12">
          <div className="w-full max-w-sm">
            
            {/* Header */}
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h2>
            <p className="text-gray-600 mb-8">
              Start ordering your favorites today!
            </p>

            {/* Form Inputs */}
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long.</p>
              </div>

            </form>

            {/* Sign Up Button */}
            <button className="w-full p-3 bg-red-700 rounded-lg text-white font-semibold shadow-md hover:bg-red-800 transition duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 mb-4">
              Create Account
            </button>
            
            {/* Login Link (Switching back to Login) */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <a 
                href="#" 
                className="text-red-700 font-medium hover:text-red-900 transition duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToLogin(); // Call the function passed from the parent container
                }}
              >
                Log In
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;