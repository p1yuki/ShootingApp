import { Project } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EquipmentList } from '@/components/EquipmentList'
import { DocumentViewer } from '@/components/DocumentViewer'

interface DashboardProps {
  project: Project
}

export function Dashboard({ project }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{project.name}</h2>
        {project.description && (
          <p className="text-muted-foreground mt-1">{project.description}</p>
        )}
      </div>

      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="equipment">機材リスト</TabsTrigger>
          <TabsTrigger value="storyboard">絵コンテ</TabsTrigger>
          <TabsTrigger value="script">脚本</TabsTrigger>
          <TabsTrigger value="schedule">香盤</TabsTrigger>
          <TabsTrigger value="other">その他資料</TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment" className="mt-6">
          <EquipmentList projectId={project.id} />
        </TabsContent>
        
        <TabsContent value="storyboard" className="mt-6">
          <DocumentViewer projectId={project.id} documentType="storyboard" />
        </TabsContent>
        
        <TabsContent value="script" className="mt-6">
          <DocumentViewer projectId={project.id} documentType="script" />
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-6">
          <DocumentViewer projectId={project.id} documentType="schedule" />
        </TabsContent>
        
        <TabsContent value="other" className="mt-6">
          <DocumentViewer projectId={project.id} documentType="other" />
        </TabsContent>
      </Tabs>
    </div>
  )
} 