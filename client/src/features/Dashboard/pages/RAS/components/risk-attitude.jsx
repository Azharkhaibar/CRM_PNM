import React from 'react';
// import { RISK_ATTITUDE_INFO } from '../utils/rasConstant.js';
import { RISK_ATTITUDE_INFO } from '../utils/ras-constant';

export default function RiskAttitude() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {RISK_ATTITUDE_INFO.map((info, idx) => (
        <div
          key={idx}
          className={`
              rounded-xl p-5 border-t-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300
              ${info.label === 'Tidak Toleran' ? 'border-red-500' : info.label === 'Konservatif' ? 'border-yellow-500' : info.label === 'Moderat' ? 'border-blue-500' : 'border-green-500'}
            `}
        >
          <h3
            className={`text-lg font-bold mb-3 
              ${info.label === 'Tidak Toleran' ? 'text-red-700' : info.label === 'Konservatif' ? 'text-yellow-700' : info.label === 'Moderat' ? 'text-blue-700' : 'text-green-700'}
            `}
          >
            {info.label}
          </h3>
          <ul className="space-y-2">
            {info.desc.map((d, i) => (
              <li key={i} className="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 
                    ${info.label === 'Tidak Toleran' ? 'bg-red-400' : info.label === 'Konservatif' ? 'bg-yellow-400' : info.label === 'Moderat' ? 'bg-blue-400' : 'bg-green-400'}
                  `}
                ></span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
