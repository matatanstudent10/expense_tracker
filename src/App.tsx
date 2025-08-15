import React, { useState, useEffect } from 'react'
import { GastoForm } from './components/GastoForm'
import { GastoList } from './components/GastoList'
import { Dashboard } from './components/Dashboard'
import { gastosService, Gasto } from './lib/supabase'
// import './App.css'  // Comentado porque usamos Tailwind

function App() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agregar' | 'lista'>('dashboard')

  // Cargar gastos al iniciar
  useEffect(() => {
    loadGastos()
  }, [])

  const loadGastos = async () => {
    try {
      setLoading(true)
      const data = await gastosService.getAll()
      setGastos(data || [])
      setError('')
    } catch (err) {
      console.error('Error cargando gastos:', err)
      setError('Error al cargar los gastos. Verifica la configuración de Supabase.')
      // Datos de ejemplo para desarrollo
      setGastos([
        {
          id: 1,
          nombre: 'Supermercado',
          fecha: '2025-08-15',
          valor: 45000,
          categoria: 'Alimentación',
          descripcion: 'Compras de la semana'
        },
        {
          id: 2,
          nombre: 'Gasolina',
          fecha: '2025-08-14',
          valor: 60000,
          categoria: 'Transporte',
          descripcion: 'Tanqueada completa'
        },
        {
          id: 3,
          nombre: 'Internet',
          fecha: '2025-08-13',
          valor: 89000,
          categoria: 'Servicios',
          descripcion: 'Pago mensual'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleGastoCreated = (nuevoGasto: Gasto) => {
    setGastos(prev => [nuevoGasto, ...prev])
    setActiveTab('lista')
  }

  const handleGastoDeleted = (id: number) => {
    setGastos(prev => prev.filter(gasto => gasto.id !== id))
  }

  const handleGastoUpdated = (gastoActualizado: Gasto) => {
    setGastos(prev => prev.map(gasto => 
      gasto.id === gastoActualizado.id ? gastoActualizado : gasto
    ))
  }

  const tabs = [
    { id: 'dashboard' as const, label: '📊 Dashboard', count: gastos.length },
    { id: 'agregar' as const, label: '➕ Agregar Gasto', count: null },
    { id: 'lista' as const, label: '📋 Lista Gastos', count: gastos.length }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando gastos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">💰 Mis Gastos</h1>
              <p className="text-sm text-gray-600">Controla tus finanzas personales</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total registrado</p>
              <p className="text-xl font-bold text-red-600">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP'
                }).format(gastos.reduce((sum, gasto) => sum + gasto.valor, 0))}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-500">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  {error}
                </p>
                <p className="text-xs mt-1">
                  Mostrando datos de ejemplo. Configura Supabase para guardar datos reales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard gastos={gastos} />}
        
        {activeTab === 'agregar' && (
          <GastoForm onGastoCreated={handleGastoCreated} />
        )}
        
        {activeTab === 'lista' && (
          <GastoList 
            gastos={gastos}
            onGastoDeleted={handleGastoDeleted}
            onGastoUpdated={handleGastoUpdated}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>💰 Gestor de Gastos Personales</p>
            <p className="mt-1">
              {gastos.length > 0 ? (
                <>Último registro: {new Date(gastos[0].fecha).toLocaleDateString('es-CO')}</>
              ) : (
                'No hay gastos registrados'
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App