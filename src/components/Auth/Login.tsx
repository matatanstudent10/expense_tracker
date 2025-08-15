import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { AnimatedBackground } from '../AnimatedBackground'

interface LoginProps {
  onToggleMode: () => void
}

export const Login: React.FC<LoginProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError('Email y contraseña son obligatorios')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message || 'Error al iniciar sesión')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AnimatedBackground />
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <span className="text-white text-3xl">💰</span>
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white tracking-tight">
            Bienvenido
          </h2>
          <p className="mt-3 text-lg text-gray-300 font-medium">
            Accede a tu gestor de gastos
          </p>
        </div>

        <div className="bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 space-y-6">
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-3 rounded-xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login con Email */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
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
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onToggleMode}
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}