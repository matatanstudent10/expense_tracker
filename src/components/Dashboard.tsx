import React, { useMemo } from 'react'
import { Gasto } from '../lib/supabase'

interface DashboardProps {
  gastos: Gasto[]
}

export const Dashboard: React.FC<DashboardProps> = ({ gastos }) => {
  const estadisticas = useMemo(() => {
    if (gastos.length === 0) {
      return {
        totalGastos: 0,
        promedioGasto: 0,
        gastoMayor: 0,
        gastoMenor: 0,
        totalMesActual: 0,
        gastosPorCategoria: {},
        gastosMesActual: 0
      }
    }

    const valores = gastos.map(g => g.valor)
    const totalGastos = valores.reduce((sum, val) => sum + val, 0)
    const promedioGasto = totalGastos / gastos.length
    const gastoMayor = Math.max(...valores)
    const gastoMenor = Math.min(...valores)

    // Gastos del mes actual
    const mesActual = new Date()
    const inicioMes = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1)
    const finMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0)
    
    const gastosMesActual = gastos.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha)
      return fechaGasto >= inicioMes && fechaGasto <= finMes
    })
    
    const totalMesActual = gastosMesActual.reduce((sum, gasto) => sum + gasto.valor, 0)

    // Gastos por categoría
    const gastosPorCategoria = gastos.reduce((acc, gasto) => {
      const categoria = gasto.categoria || 'Sin categoría'
      acc[categoria] = (acc[categoria] || 0) + gasto.valor
      return acc
    }, {} as Record<string, number>)

    return {
      totalGastos,
      promedioGasto,
      gastoMayor,
      gastoMenor,
      totalMesActual,
      gastosPorCategoria,
      gastosMesActual: gastosMesActual.length
    }
  }, [gastos])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value)
  }

  const categoriasOrdenadas = Object.entries(estadisticas.gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Resumen General</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Gastos</h3>
            <p className="text-2xl font-bold text-blue-800">
              {formatCurrency(estadisticas.totalGastos)}
            </p>
            <p className="text-xs text-blue-600">{gastos.length} registros</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Promedio por Gasto</h3>
            <p className="text-2xl font-bold text-green-800">
              {formatCurrency(estadisticas.promedioGasto)}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Gasto Mayor</h3>
            <p className="text-2xl font-bold text-red-800">
              {formatCurrency(estadisticas.gastoMayor)}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">Gasto Menor</h3>
            <p className="text-2xl font-bold text-yellow-800">
              {formatCurrency(estadisticas.gastoMenor)}
            </p>
          </div>
        </div>
      </div>

      {/* Mes actual */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Mes Actual</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600">Total Mes</h3>
            <p className="text-3xl font-bold text-purple-800">
              {formatCurrency(estadisticas.totalMesActual)}
            </p>
            <p className="text-xs text-purple-600">
              {estadisticas.gastosMesActual} gastos este mes
            </p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-600">Promedio Diario</h3>
            <p className="text-3xl font-bold text-indigo-800">
              {formatCurrency(estadisticas.totalMesActual / new Date().getDate())}
            </p>
            <p className="text-xs text-indigo-600">Basado en días transcurridos</p>
          </div>
        </div>
      </div>

      {/* Gastos por categoría */}
      {categoriasOrdenadas.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Gastos por Categoría</h2>
          
          <div className="space-y-3">
            {categoriasOrdenadas.map(([categoria, total], index) => {
              const porcentaje = (total / estadisticas.totalGastos) * 100
              const colores = [
                'bg-blue-500',
                'bg-green-500', 
                'bg-red-500',
                'bg-yellow-500',
                'bg-purple-500',
                'bg-indigo-500',
                'bg-pink-500'
              ]
              
              return (
                <div key={categoria} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{categoria}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">{formatCurrency(total)}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({porcentaje.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colores[index % colores.length]}`}
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Últimos gastos */}
      {gastos.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Últimos Gastos</h2>
          
          <div className="space-y-3">
            {gastos.slice(0, 5).map(gasto => (
              <div key={gasto.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{gasto.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(gasto.fecha).toLocaleDateString('es-CO')} • {gasto.categoria}
                  </p>
                </div>
                <span className="font-bold text-red-600">
                  {formatCurrency(gasto.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}