import { useState, useEffect } from 'react'
// import { supabase, Equipment } from '@/lib/supabase'
import { Equipment } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { EquipmentForm } from '@/components/EquipmentForm'

// テスト用のモックデータ
const mockEquipment: Equipment[] = [
  {
    id: '1',
    project_id: '1',
    name: 'カメラ RED KOMODO',
    category: 'カメラ',
    quantity: 1,
    assignee: '田中カメラマン',
    notes: 'レンズキット付き',
    completed: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2',
    project_id: '1',
    name: 'ワイヤレスマイク',
    category: '音響',
    quantity: 2,
    assignee: '佐藤録音',
    notes: '予備バッテリー含む',
    completed: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '3',
    project_id: '1',
    name: 'LED照明パネル',
    category: '照明',
    quantity: 4,
    assignee: '照明チーム',
    notes: 'ディフューザー付き',
    completed: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
]

interface EquipmentListProps {
  projectId: string
}

export function EquipmentList({ projectId }: EquipmentListProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)

  useEffect(() => {
    fetchEquipment()
  }, [projectId])

  const fetchEquipment = async () => {
    setLoading(true)
    
    // テストモード: モックデータを使用
    setTimeout(() => {
      const projectEquipment = mockEquipment.filter(item => item.project_id === projectId)
      setEquipment(projectEquipment)
      setLoading(false)
    }, 500) // ローディング演出
    
    /* 実際のSupabase版
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('機材リストの取得に失敗しました:', error)
    } else {
      setEquipment(data || [])
    }
    setLoading(false)
    */
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    // テストモード: ローカル状態を更新
    setEquipment(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !completed } : item
      )
    )
    
    /* 実際のSupabase版
    const { error } = await supabase
      .from('equipment')
      .update({ completed: !completed })
      .eq('id', id)

    if (error) {
      console.error('機材状態の更新に失敗しました:', error)
    } else {
      fetchEquipment()
    }
    */
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この機材を削除しますか？')) return

    // テストモード: ローカル状態から削除
    setEquipment(prev => prev.filter(item => item.id !== id))
    
    /* 実際のSupabase版
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('機材の削除に失敗しました:', error)
    } else {
      fetchEquipment()
    }
    */
  }

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEquipment(null)
    fetchEquipment()
  }

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">機材リスト</h3>
        <div className="flex gap-2">
          <span className="text-xs text-muted-foreground px-2 py-1 bg-yellow-100 rounded">
            テストモード
          </span>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            機材を追加
          </Button>
        </div>
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          このプロジェクトにはまだ機材が登録されていません
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead className="bg-muted">
              <tr>
                <th className="border border-border p-3 text-left">完了</th>
                <th className="border border-border p-3 text-left">機材名</th>
                <th className="border border-border p-3 text-left">分類</th>
                <th className="border border-border p-3 text-left">数量</th>
                <th className="border border-border p-3 text-left">担当者</th>
                <th className="border border-border p-3 text-left">備考</th>
                <th className="border border-border p-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr
                  key={item.id}
                  className={`${
                    item.completed
                      ? 'bg-muted/50 text-muted-foreground line-through'
                      : 'bg-background'
                  } hover:bg-muted/30`}
                >
                  <td className="border border-border p-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleComplete(item.id, item.completed)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="border border-border p-3 font-medium">
                    {item.name}
                  </td>
                  <td className="border border-border p-3">{item.category}</td>
                  <td className="border border-border p-3">{item.quantity}</td>
                  <td className="border border-border p-3">{item.assignee || '-'}</td>
                  <td className="border border-border p-3">{item.notes || '-'}</td>
                  <td className="border border-border p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        編集
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EquipmentForm
          projectId={projectId}
          equipment={editingEquipment}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
} 