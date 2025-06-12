import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Project } from '@/lib/supabase'
// import { supabase } from '@/lib/supabase'
import { ProjectSelector } from '@/components/ProjectSelector'
import { Dashboard } from '@/components/Dashboard'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut } from 'lucide-react'

// テスト用のモックデータ
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'テスト映画プロジェクト',
    description: 'サンプルの映画撮影プロジェクト',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2', 
    name: 'CM撮影案件',
    description: 'コマーシャル撮影のプロジェクト',
    created_at: '2024-01-02',
    updated_at: '2024-01-02'
  }
]

function App() {
  // const [session, setSession] = useState<any>(null)
  const [session, setSession] = useState<any>({ user: { email: 'test@example.com' } }) // テスト用
  const [projects, setProjects] = useState<Project[]>(mockProjects) // モックデータを使用
  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[0]) // 最初のプロジェクトを選択
  const [loading, setLoading] = useState(false) // ローディング無効

  // 以下のuseEffectをコメントアウト
  /*
  useEffect(() => {
    // セッション状態の取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // セッション変更の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchProjects()
    }
  }, [session])

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('プロジェクトの取得に失敗しました:', error)
    } else {
      setProjects(data || [])
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0])
      }
    }
  }
  */

  const handleLogin = async () => {
    alert('テストモードです。ログイン機能は無効化されています。')
  }

  const handleLogout = async () => {
    alert('テストモードです。ログアウト機能は無効化されています。')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-3xl font-bold text-foreground">撮影資料管理アプリ</h1>
          <p className="text-muted-foreground">
            撮影現場での機材管理と資料閲覧を効率化するアプリです
          </p>
          <Button onClick={handleLogin} className="gap-2">
            <LogIn className="h-4 w-4" />
            ログイン
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">撮影資料管理</h1>
            {projects.length > 0 && (
              <ProjectSelector
                projects={projects}
                selectedProject={selectedProject}
                onProjectSelect={setSelectedProject}
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">テストモード</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route 
            path="/" 
            element={
              selectedProject ? (
                <Dashboard project={selectedProject} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">プロジェクトを選択してください</p>
                </div>
              )
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App 