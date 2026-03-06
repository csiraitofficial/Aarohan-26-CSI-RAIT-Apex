'use client'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Krishi
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                Blockchain-powered Ayurvedic herb traceability platform ensuring transparent, 
                quality-verified, and tamper-proof herb tracking from farm to formula.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary text-lg px-8 py-3">
                  Get Started
                </button>
                <button className="btn-secondary text-lg px-8 py-3">
                  Learn More
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Farmers</h3>
                  <p className="text-sm text-green-100">Track herb collection and get market insights</p>
                </div>
                <div className="bg-white/20 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Labs</h3>
                  <p className="text-sm text-green-100">Quality testing and certification</p>
                </div>
                <div className="bg-white/20 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Manufacturers</h3>
                  <p className="text-sm text-green-100">Supply chain management and tracking</p>
                </div>
                <div className="bg-white/20 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Consumers</h3>
                  <p className="text-sm text-green-100">Verify product authenticity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive dashboard system for all stakeholders
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold ml-4">Farmer Dashboard</h3>
              </div>
              <p className="text-gray-600">
                Herb collection tracking, GPS location tagging, weather insights, 
                and market rate information.
              </p>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🔬</span>
                </div>
                <h3 className="text-xl font-semibold ml-4">Testing Lab</h3>
              </div>
              <p className="text-gray-600">
                Spectroscopy analysis, quality certification, batch testing, 
                and PDF certificate generation.
              </p>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🏭</span>
                </div>
                <h3 className="text-xl font-semibold ml-4">Manufacturer</h3>
              </div>
              <p className="text-gray-600">
                Batch tracking, supplier management, QR code generation, 
                and production analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Blockchain Technology
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our blockchain-powered system ensures complete transparency and 
                immutability throughout the supply chain, from farm to consumer.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Immutable transaction records</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Smart contract automation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Real-time tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Quality assurance</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">10</div>
                  <div className="text-sm text-gray-600">Dashboards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">4</div>
                  <div className="text-sm text-gray-600">Smart Contracts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}