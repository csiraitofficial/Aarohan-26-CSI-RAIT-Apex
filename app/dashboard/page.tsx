'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Leaf, 
  TestTube, 
  Factory, 
  Truck, 
  Recycle, 
  Globe, 
  Package, 
  Shield, 
  Scan 
} from 'lucide-react'

export default function Dashboard() {
  const dashboardStats = [
    { label: 'Total Farmers', value: '1,234', icon: Leaf, color: 'text-green-600' },
    { label: 'Active Labs', value: '156', icon: TestTube, color: 'text-blue-600' },
    { label: 'Manufacturers', value: '89', icon: Factory, color: 'text-purple-600' },
    { label: 'Products Tracked', value: '5,678', icon: Package, color: 'text-orange-600' },
  ]

  const quickActions = [
    { label: 'Add New Farmer', icon: Users, color: 'bg-green-500' },
    { label: 'Process Lab Test', icon: TestTube, color: 'bg-blue-500' },
    { label: 'Create Batch', icon: Factory, color: 'bg-purple-500' },
    { label: 'Generate Report', icon: Scan, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Krishi Dashboard</h1>
        <p className="text-green-100">Manage your Ayurvedic herb traceability operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Button key={index} className={`w-full h-20 ${action.color} hover:opacity-90`}>
            <action.icon className="h-6 w-6 mr-3" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from the supply chain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">New herb collection from Farm #123</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
              <span className="text-green-600 font-semibold">Verified</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Lab test completed for Batch #456</p>
                <p className="text-sm text-gray-600">4 hours ago</p>
              </div>
              <span className="text-blue-600 font-semibold">Quality Passed</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">New product created: Ashwagandha Capsules</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
              <span className="text-purple-600 font-semibold">Ready for Sale</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}