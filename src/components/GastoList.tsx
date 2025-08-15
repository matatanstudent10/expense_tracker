import React, { useState } from 'react'
import { gastosService, Gasto } from '../lib/supabase'

interface GastoListProps {
  gastos: Gasto[]
  onGastoDeleted: (id: number) => void
  onGastoUpdated: (gasto: Gasto) => void
}

export const GastoList: React.FC<GastoListProps> = ({ 
  gastos, 
  onGastoDeleted, 
  onGastoUpdated 
}) => {
  const [loading, setLoading] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Gasto>>({})

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este gasto?')) {
      return
    }

    setLoading(id)
    try {
      await gastosService.delete(id)
      onGastoDeleted(id)
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert('Error al eliminar el gasto')
    } finally {
      setLoading(null)
    }
  }

  const startEditing = (gasto: Gasto) => {
    setEditingId(gasto.id!)
    setEditData({
      nombre: gasto.nombre,
      fecha: gasto.fecha,
      valor: gasto.valor,
      categoria: gasto.categoria,
      descripcion: gasto.descripcion
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditData({})
  }

  const saveEdit = async (id: number) => {
    if (!editData.nombre || !editData.valor) {
      alert('Nombre y valor son obligatorios')
      return
    }

    setLoading(id)
    try {
      const updatedGasto = await gastosService.update(id, editData)
      onGastoUpdated(updatedGasto)
      setEditingId(null)
      setEditData({})
    } catch (error) {
      console.error('Error al actualizar:', error)
      alert('Error al actualizar el gasto')
    } finally {
      setLoading(null)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (gastos.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          <p className="text-lg">No hay gastos registrados</p>
          <p className="text-sm">Agrega tu primer gasto usando el formulario anterior</p>
        </div>
      </div>
    )
  }

  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.valor, 0)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Lista de Gastos</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total registros: {gastos.length}</p>
          <p className="text-lg font-bold text-red-600">
            Total: {formatCurrency(totalGastos)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Categoría</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Valor</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => (
              <tr key={gasto.id} className="border-b hover:bg-gray-50">
                {editingId === gasto.id ? (
                  // Modo edición
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={editData.fecha || ''}
                        onChange={(e) => setEditData({...editData, fecha: e.target.value})}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editData.nombre || ''}
                        onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={editData.categoria || ''}
                        onChange={(e) => setEditData({...editData, categoria: e.target.value})}
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        <option value="Alimentación">Alimentación</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Entretenimiento">Entretenimiento</option>
                        <option value="Salud">Salud</option>
                        <option value="Ropa">Ropa</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={editData.valor || ''}
                        onChange={(e) => setEditData({...editData, valor: parseFloat(e.target.value)})}
                        className="w-full px-2 py-1 text-sm border rounded text-right"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => saveEdit(gasto.id!)}
                        disabled={loading === gasto.id}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 mr-1"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                      >
                        ✗
                      </button>
                    </td>
                  </>
                ) : (
                  // Modo visualización
                  <>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {formatDate(gasto.fecha)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{gasto.nombre}</div>
                      {gasto.descripcion && (
                        <div className="text-xs text-gray-500">{gasto.descripcion}</div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {gasto.categoria || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-red-600">
                      {formatCurrency(gasto.valor)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => startEditing(gasto)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 mr-1"
                        disabled={loading === gasto.id}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(gasto.id!)}
                        disabled={loading === gasto.id}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        {loading === gasto.id ? '...' : '🗑️'}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}