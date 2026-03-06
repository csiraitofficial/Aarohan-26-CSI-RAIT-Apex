'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LayoutDashboard, 
  Users, 
  Leaf, 
  TestTube, 
  Factory, 
  Truck, 
  Recycle, 
  Globe, 
  Package, 
  Shield, 
  Scan, 
  Menu, 
  X 
} from 'lucide-react'

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Farmers', icon: Leaf, href: '/dashboard/farmer' },
  { name: 'Testing Lab', icon: TestTube, href: '/dashboard/lab' },
  { name: 'Manufacturers', icon: Factory, href: '/dashboard/manufacturer' },
  { name: 'Waste Management', icon: Recycle, href: '/dashboard/waste' },
  { name: 'Sustainability', icon: Globe, href: '/dashboard/sustainability' },
  { name: 'Inventory', icon: Package, href: '/dashboard/inventory' },
  { name: 'Orders', icon: Truck, href: '/dashboard/orders' },
  { name: 'Insurance', icon: Shield, href: '/dashboard/insurance' },
  { name: 'DNA Banking', icon: Users, href: '/dashboard/dna' },
  { name: 'Consumer Portal', icon: Scan, href: '/dashboard/consumer' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-600 mb-8">Krishi</h1>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
              <div className="flex items-center space-x-4">
                <Button variant="outline">Profile</Button>
                <Button>Logout</Button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Content</CardTitle>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}