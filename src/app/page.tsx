"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { toast } from 'react-toastify';

export default function Home() {
  
  const showSuccessToast = () => {
    toast.success('🎉 Success! Toast is working perfectly!');
  };

  const showErrorToast = () => {
    toast.error('❌ Error toast is working!');
  };

  const showInfoToast = () => {
    toast.info('ℹ️ Info toast is working!');
  };

  const showWarningToast = () => {
    toast.warning('⚠️ Warning toast is working!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-gray-600 mb-6">
          If you see colors and styling, Tailwind is working!
        </p>
        
        {/* Original button */}
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors mb-4 w-full">
          Test Button
        </button>

        {/* Toast test buttons */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Test Toasts:</h2>
          
          <button 
            onClick={showSuccessToast}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors w-full"
          >
            🎉 Show Success Toast
          </button>
          
          <button 
            onClick={showErrorToast}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors w-full"
          >
            ❌ Show Error Toast
          </button>
          
          <button 
            onClick={showInfoToast}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors w-full"
          >
            ℹ️ Show Info Toast
          </button>
          
          <button 
            onClick={showWarningToast}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors w-full"
          >
            ⚠️ Show Warning Toast
          </button>
        </div>
      </div>
    </div>
  );
}