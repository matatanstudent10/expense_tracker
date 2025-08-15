import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { AnimatedBackground } from '../AnimatedBackground'

interface RegisterProps {
  onToggleMode: () => void
}

export const Register: React.FC<RegisterProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message || 'Error al crear la cuenta')
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AnimatedBackground />
        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <span className="text-white text-3xl">✓</span>
            </div>
            <h2 className="mt-8 text-4xl font-bold text-white tracking-tight">
              ¡Cuenta Creada!
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 mt-8">
              <p className="text-gray-300 mb-4 font-medium">
                Te hemos enviado un email de confirmación a:
              </p>
              <p className="font-bold text-white mb-6">{email}</p>
              <p className="text-sm text-gray-400 mb-6">
                Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
              </p>
              <button
                onClick={onToggleMode}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AnimatedBackground />
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <span className="text-white text-3xl">💰</span>
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white tracking-tight">
            Crear Cuenta
          </h2>
          <p className="mt-3 text-lg text-gray-300 font-medium">
            Únete y comienza a controlar tus gastos
          </p>
        </div>

        <div className="bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 space-y-6">
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-3 rounded-xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Registro con Email */}
          <form onSubmit={handleEmailRegister} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200 mb-2">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                placeholder="Repite tu contraseña"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={onToggleMode}
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}