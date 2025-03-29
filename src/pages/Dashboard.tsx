import React from 'react';
import { BarChart, Clock, FileCheck, Users } from 'lucide-react';

const stats = [
  { name: 'Total Assignments', value: '25', icon: FileCheck, color: 'bg-blue-500' },
  { name: 'Pending Reviews', value: '12', icon: Clock, color: 'bg-yellow-500' },
  { name: 'Active Students', value: '156', icon: Users, color: 'bg-green-500' },
  { name: 'Average Score', value: '85%', icon: BarChart, color: 'bg-purple-500' },
];

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${item.color}`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;