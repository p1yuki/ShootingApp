import { Project } from '@/lib/supabase'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProjectSelectorProps {
  projects: Project[]
  selectedProject: Project | null
  onProjectSelect: (project: Project) => void
}

export function ProjectSelector({ 
  projects, 
  selectedProject, 
  onProjectSelect 
}: ProjectSelectorProps) {
  return (
    <Select
      value={selectedProject?.id}
      onValueChange={(value) => {
        const project = projects.find(p => p.id === value)
        if (project) {
          onProjectSelect(project)
        }
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="プロジェクトを選択" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 