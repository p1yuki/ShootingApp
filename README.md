# 撮影資料管理アプリ

撮影現場での機材管理と資料閲覧を効率化するPWAアプリケーションです。

## 🚀 主な機能

### 📁 プロジェクト管理
- プロジェクト選択のドロップダウンメニュー
- プロジェクトごとの資料管理

### ✅ 機材リスト管理
- 機材の追加・編集・削除
- チェックボックスによる準備完了状態の管理
- 機材名、分類、数量、担当者、備考の管理
- レスポンシブ対応のテーブル表示

### 📄 資料閲覧
- **絵コンテ**：制作済み絵コンテのPDF閲覧
- **脚本**：撮影用脚本のPDF閲覧
- **香盤**：撮影スケジュールのPDF閲覧
- **その他資料**：追加資料のPDF閲覧

### 🔍 PDF機能
- 縦スクロールでの連続ページ表示
- ズームイン・ズームアウト機能
- レスポンシブ対応（PC・タブレット・スマートフォン）
- ピンチトゥズーム対応（モバイル）
- PDFダウンロード機能

### 📱 PWA対応
- ホーム画面への追加
- オフライン基本機能
- アプリライクな操作性

## 🛠 技術構成

- **バックエンド**: Supabase（データベース・ストレージ・認証）
- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **UIライブラリ**: Tailwind CSS + shadcn/ui
- **ルーティング**: React Router
- **PDFビューワー**: react-pdf
- **アイコン**: Lucide React
- **PWA**: Vite PWA Plugin

## 🚦 セットアップ

### 前提条件
- Node.js v20.11.1
- pnpm 8.x

### インストール

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd shooting-app
```

2. **Node.jsバージョンの設定**
```bash
nvm use  # .nvmrcを使用してv20.11.1に切り替え
```

3. **依存関係のインストール**
```bash
pnpm install
```

4. **環境変数の設定**
```bash
cp env.example .env
```

`.env`ファイルを編集して、SupabaseのURLとAPIキーを設定：
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Supabaseの設定

以下のテーブルを作成してください：

```sql
-- プロジェクトテーブル
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 機材テーブル
CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  assignee TEXT,
  notes TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 資料テーブル
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('storyboard', 'script', 'schedule', 'other')),
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

ストレージバケットも作成：
```sql
-- Supabase Storage用のバケット作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);
```

### 開発サーバーの起動

```bash
pnpm dev
```

開発サーバーが http://localhost:5173 で起動します。

### 本番ビルド

```bash
pnpm build
```

### プレビュー

```bash
pnpm preview
```

## 📱 使用方法

1. **ログイン**: Googleアカウントでログイン
2. **プロジェクト選択**: 左上のドロップダウンからプロジェクトを選択
3. **機材管理**: 機材リストタブで機材の追加・編集・チェック
4. **資料閲覧**: 各タブでPDF資料を閲覧・ズーム・ダウンロード

## 🎨 デザインシステム

- **カラーパレット**: シンプルな白ベース、Apple風デザイン
- **フォント**: システムフォント使用
- **レスポンシブ**: モバイルファースト設計
- **アクセシビリティ**: WCAG 2.1準拠

## 🔒 セキュリティ

- Supabase認証による安全なログイン
- Row Level Security (RLS) によるデータ保護
- HTTPS通信

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

1. フォークしてブランチを作成
2. 変更を実装
3. テストを追加
4. プルリクエストを送信

## 📞 サポート

問題や質問がありましたら、Issueを作成してください。 