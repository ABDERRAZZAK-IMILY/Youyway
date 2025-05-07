import React, { useState } from 'react';
import { axiosClient } from '../../api/axios';
import { FaSave, FaCog, FaBell, FaEnvelope, FaLock, FaDatabase } from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    siteName: 'YouWay',
    siteDescription: 'Mentorship Platform',
    emailNotifications: true,
    systemNotifications: true,
    sessionReminders: true,
    sessionBeforeHours: 24,
    maxSessionsPerDay: 5,
    allowSessionRescheduling: true,
    minDaysBeforeReschedule: 1,
    maxSessionLength: 120,
    minSessionLength: 30
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-700" htmlFor="emailNotifications">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="systemNotifications"
                  name="systemNotifications"
                  checked={formData.systemNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-700" htmlFor="systemNotifications">
                  System Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sessionReminders"
                  name="sessionReminders"
                  checked={formData.sessionReminders}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-700" htmlFor="sessionReminders">
                  Session Reminders
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Before Session for Reminder
                </label>
                <input
                  type="number"
                  name="sessionBeforeHours"
                  min="1"
                  max="48"
                  value={formData.sessionBeforeHours}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Session Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Sessions Per Day
                </label>
                <input
                  type="number"
                  name="maxSessionsPerDay"
                  min="1"
                  max="10"
                  value={formData.maxSessionsPerDay}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowSessionRescheduling"
                  name="allowSessionRescheduling"
                  checked={formData.allowSessionRescheduling}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-700" htmlFor="allowSessionRescheduling">
                  Allow Session Rescheduling
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Days Before Reschedule
                </label>
                <input
                  type="number"
                  name="minDaysBeforeReschedule"
                  min="0"
                  max="7"
                  value={formData.minDaysBeforeReschedule}
                  onChange={handleNumberChange}
                  disabled={!formData.allowSessionRescheduling}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Session Length (minutes)
                </label>
                <input
                  type="number"
                  name="maxSessionLength"
                  min="30"
                  max="240"
                  step="15"
                  value={formData.maxSessionLength}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Session Length (minutes)
                </label>
                <input
                  type="number"
                  name="minSessionLength"
                  min="15"
                  max="60"
                  step="15"
                  value={formData.minSessionLength}
                  onChange={handleNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-64 bg-gray-50 md:border-r border-gray-200">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                      activeTab === 'general'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('general')}
                  >
                    <FaCog className="mr-3" />
                    General
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                      activeTab === 'notifications'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <FaBell className="mr-3" />
                    Notifications
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                      activeTab === 'sessions'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('sessions')}
                  >
                    <FaCalendarAlt className="mr-3" />
                    Sessions
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 flex-1">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {saveSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-5" role="alert">
                <p className="font-bold">Success</p>
                <p>Settings saved successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {renderTabContent()}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
