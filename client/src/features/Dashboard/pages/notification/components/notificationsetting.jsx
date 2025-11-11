import { motion } from 'framer-motion';

export default function NotificationSettings({ darkMode }) {
  const cardClass = `rounded-2xl border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  const inputClass = `w-full px-4 py-2 rounded-lg border transition-colors duration-300 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
  }`;

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`${cardClass} p-6 mb-6 overflow-hidden`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
              <span>Push Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
              <span>Email Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
              <span>Sound Alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
              <span>Desktop Notifications</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-4">Auto-cleanup</h3>
            <select className={inputClass}>
              <option>Keep all notifications</option>
              <option>Auto-delete after 30 days</option>
              <option>Auto-delete after 7 days</option>
              <option>Auto-delete read notifications</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Notification Frequency</h3>
            <select className={inputClass}>
              <option>Real-time</option>
              <option>Every 15 minutes</option>
              <option>Every hour</option>
              <option>Daily digest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-4">Category Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
            <span>System Updates</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
            <span>Security Alerts</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
            <span>Feature Updates</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
            <span>Marketing</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
            <span>Reminders</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className={`rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`} />
            <span>Priority Messages</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>Save Preferences</button>
      </div>
    </motion.div>
  );
}
