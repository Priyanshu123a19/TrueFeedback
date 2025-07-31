import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-gray-600 mb-6">
          If you see colors and styling, Tailwind is working!
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
}
