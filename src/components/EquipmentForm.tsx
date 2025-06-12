import { useState } from 'react'
// import { supabase, Equipment } from '@/lib/supabase'
import { Equipment } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface EquipmentFormProps {
  projectId: string
  equipment?: Equipment | null
  onClose: () => void
}

export function EquipmentForm({ projectId, equipment, onClose }: EquipmentFormProps) {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    category: equipment?.category || '',
    quantity: equipment?.quantity || 1,
    assignee: equipment?.assignee || '',
    notes: equipment?.notes || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // テストモード: 簡単なアラートで完了を通知
      setTimeout(() => {
        alert(`${equipment ? '編集' : '追加'}が完了しました！\n機材名: ${formData.name}`)
        setSaving(false)
        onClose()
      }, 1000)
      
      /* 実際のSupabase版
      if (equipment) {
        // 編集
        const { error } = await supabase
          .from('equipment')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', equipment.id)

        if (error) throw error
      } else {
        // 新規作成
        const { error } = await supabase
          .from('equipment')
          .insert({
            ...formData,
            project_id: projectId,
            completed: false,
          })

        if (error) throw error
      }

      onClose()
      */
    } catch (error) {
      console.error('機材の保存に失敗しました:', error)
      alert('機材の保存に失敗しました')
      setSaving(false)
    }
  }

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {equipment ? '機材を編集' : '機材を追加'}
            </h3>
            <span className="text-xs text-muted-foreground px-2 py-1 bg-yellow-100 rounded">
              テストモード
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">機材名 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="例: カメラ、マイク、照明など"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">分類</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="カメラ、音響、照明など"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">数量 *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">担当者</label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="担当者名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">備考</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="注意事項や詳細情報など"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? '保存中...' : equipment ? '更新' : '追加'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 