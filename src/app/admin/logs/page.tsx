import { createClient } from '@/lib/supabase/server'

export default async function AdminLogsPage() {
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from('admin_logs')
    .select(`
      *,
      admin:profiles!admin_logs_admin_id_fkey(username),
      target:profiles!admin_logs_target_user_id_fkey(username)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Journal des actions</h1>
        <p className="text-sm text-gray-500 mt-1">Historique des modifications admin</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600">Admin</th>
              <th className="px-4 py-3 font-medium text-gray-600">Cible</th>
              <th className="px-4 py-3 font-medium text-gray-600">Action</th>
              <th className="px-4 py-3 font-medium text-gray-600">Détails</th>
            </tr>
          </thead>
          <tbody>
            {(logs || []).map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  @{(log.admin as { username: string } | null)?.username || '—'}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  @{(log.target as { username: string } | null)?.username || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    log.action === 'suspend' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {JSON.stringify(log.metadata)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs?.length && (
          <p className="text-center py-8 text-gray-400 text-sm">Aucune action enregistrée</p>
        )}
      </div>
    </div>
  )
}
