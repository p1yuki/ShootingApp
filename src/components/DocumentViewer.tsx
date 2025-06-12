import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { supabase, Document as DocumentType } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Upload, ZoomIn, ZoomOut, Download } from 'lucide-react'

// PDF.js worker設定
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface DocumentViewerProps {
  projectId: string
  documentType: 'storyboard' | 'script' | 'schedule' | 'other'
}

export function DocumentViewer({ projectId, documentType }: DocumentViewerProps) {
  const [documents, setDocuments] = useState<DocumentType[]>([])
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [projectId, documentType])

  const fetchDocuments = async () => {
    setLoading(true)
    
    // テストモード: 空のドキュメントリストを返す
    setTimeout(() => {
      setDocuments([])
      setLoading(false)
    }, 500)
    
    /* 実際のSupabase版
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .eq('type', documentType)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('資料の取得に失敗しました:', error)
    } else {
      setDocuments(data || [])
      if (data && data.length > 0 && !selectedDocument) {
        setSelectedDocument(data[0])
      }
    }
    setLoading(false)
    */
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      alert('PDFファイルを選択してください')
      return
    }

    setUploading(true)
    try {
      // ファイル名を生成
      const fileName = `${projectId}/${documentType}/${Date.now()}_${file.name}`
      
      // Supabase Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // データベースに記録
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          name: file.name,
          type: documentType,
          file_path: fileName,
        })

      if (dbError) throw dbError

      fetchDocuments()
    } catch (error) {
      console.error('ファイルのアップロードに失敗しました:', error)
      alert('ファイルのアップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  const getDocumentUrl = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600) // 1時間有効

    return data?.signedUrl || ''
  }

  const handleDownload = async (doc: DocumentType) => {
    try {
      const url = await getDocumentUrl(doc.file_path)
      if (url) {
        const link = document.createElement('a')
        link.href = url
        link.download = doc.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('ダウンロードに失敗しました:', error)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const getDocumentTypeLabel = () => {
    switch (documentType) {
      case 'storyboard': return '絵コンテ'
      case 'script': return '脚本'
      case 'schedule': return '香盤'
      case 'other': return 'その他資料'
      default: return '資料'
    }
  }

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{getDocumentTypeLabel()}</h3>
        <div className="flex gap-2">
          <span className="text-xs text-muted-foreground px-2 py-1 bg-yellow-100 rounded">
            テストモード
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            onClick={() => alert('テストモードでは、PDFアップロード機能は無効化されています。\n実際のSupabase設定完了後に使用できます。')}
            disabled={uploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'アップロード中...' : 'PDFをアップロード'}
          </Button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          まだ資料がアップロードされていません
        </div>
      ) : (
        <div className="space-y-4">
          {documents.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {documents.map((doc) => (
                <Button
                  key={doc.id}
                  variant={selectedDocument?.id === doc.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDocument(doc)}
                >
                  {doc.name}
                </Button>
              ))}
            </div>
          )}

          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">{selectedDocument.name}</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="px-3 py-1 text-sm bg-muted rounded">
                    {Math.round(scale * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScale(s => Math.min(2.0, s + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedDocument)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <PDFDocument document={selectedDocument} scale={scale} onLoadSuccess={onDocumentLoadSuccess} />
              
              {numPages && (
                <div className="text-center text-sm text-muted-foreground">
                  全 {numPages} ページ
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// PDFドキュメント表示コンポーネント
function PDFDocument({ 
  document, 
  scale, 
  onLoadSuccess 
}: { 
  document: DocumentType
  scale: number
  onLoadSuccess: ({ numPages }: { numPages: number }) => void
}) {
  const [url, setUrl] = useState<string>('')
  const [numPages, setNumPages] = useState<number | null>(null)

  useEffect(() => {
    const loadUrl = async () => {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600)
      
      if (data?.signedUrl) {
        setUrl(data.signedUrl)
      }
    }
    loadUrl()
  }, [document])

  if (!url) {
    return <div className="text-center py-8">PDFを読み込み中...</div>
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Document
        file={url}
        onLoadSuccess={(pdf) => {
          setNumPages(pdf.numPages)
          onLoadSuccess(pdf)
        }}
        className="max-w-full"
      >
        <div className="space-y-4 p-4">
          {numPages && Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="flex justify-center">
              <Page
                pageNumber={index + 1}
                scale={scale}
                className="max-w-full"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </div>
      </Document>
    </div>
  )
} 