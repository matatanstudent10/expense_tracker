import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para TypeScript
export type Gasto = {
  id?: number
  nombre: string
  fecha: string
  valor: number
  categoria?: string
  descripcion?: string
  created_at?: string
}

// Funciones para manejar gastos
export const gastosService = {
  // Obtener todos los gastos
  async getAll() {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .order('fecha', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Crear nuevo gasto
  async create(gasto: Omit<Gasto, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('gastos')
      .insert([gasto])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Actualizar gasto
  async update(id: number, gasto: Partial<Gasto>) {
    const { data, error } = await supabase
      .from('gastos')
      .update(gasto)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Eliminar gasto
  async delete(id: number) {
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Obtener resumen por mes
  async getResumenMes(year: number, month: number) {
    const { data, error } = await supabase
      .from('gastos')
      .select('valor, categoria')
      .gte('fecha', `${year}-${month.toString().padStart(2, '0')}-01`)
      .lt('fecha', `${year}-${(month + 1).toString().padStart(2, '0')}-01`)
    
    if (error) throw error
    
    const total = data.reduce((sum, gasto) => sum + gasto.valor, 0)
    const porCategoria = data.reduce((acc, gasto) => {
      const cat = gasto.categoria || 'Sin categoría'
      acc[cat] = (acc[cat] || 0) + gasto.valor
      return acc
    }, {} as Record<string, number>)
    
    return { total, porCategoria, cantidad: data.length }
  }
}