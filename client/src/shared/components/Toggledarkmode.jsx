import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDarkMode } from './Darkmodecontext';

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition" title={darkMode ? 'Light Mode' : 'Dark Mode'}>
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}
