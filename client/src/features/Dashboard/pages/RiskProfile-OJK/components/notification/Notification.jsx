
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
const Notification = ({ 
  message, 
  type = 'success', 
  duration = 3000,
  isVisible,
  onClose 
}) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
     icon: <AlertTriangle className="w-5 h-5" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5" />
    }
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`${config.bg} ${config.border} rounded-lg shadow-lg p-4 max-w-md`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <span className={`text-lg font-bold ${config.text}`}>
              {config.icon}
            </span>
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${config.text}`}>{message}</p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;