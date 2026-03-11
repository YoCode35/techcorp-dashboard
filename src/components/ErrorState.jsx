import { AlertTriangle, RefreshCw } from 'lucide-react'

function ErrorState({ title, message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle size={22} className="text-red-500" />
      </div>
      <p className="text-gray-900 dark:text-white font-medium">
        {title ?? 'Une erreur est survenue'}
      </p>
      <p className="text-gray-400 text-sm mt-1 max-w-sm">
        {message ?? 'Impossible de charger les données. Vérifiez votre connexion et réessayez.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} />
          Réessayer
        </button>
      )}
    </div>
  )
}

export default ErrorState