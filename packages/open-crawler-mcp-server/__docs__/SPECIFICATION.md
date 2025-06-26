# ウェブクローラーMCPサーバー仕様書

## 概要
ウェブページからテキストコンテンツを取得するシンプルなMCPサーバー。
**重要**: 全てのクロール処理はローカルマシン（MCPサーバー）で実行し、AIには結果のみを返すことでAIのコストを削減する。

## MCPツール

### crawl_page
ウェブページのコンテンツを指定された形式で取得

**パラメータ**:
- `url` (必須): 対象URL
- `selector` (オプション): CSSセレクター
- `text_only` (オプション): テキストのみ取得（非推奨、formatパラメータを使用）
- `format` (オプション): 出力形式 - `text` (デフォルト), `markdown`, `xml`, `json`

**戻り値**:
```json
{
  "url": "実際のURL",
  "title": "ページタイトル",
  "content": "指定された形式で抽出されたコンテンツ",
  "format": "text|markdown|xml|json",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**フォーマット詳細**:
- `text`: プレーンテキスト（従来通り）
- `markdown`: Markdownフォーマット（見出し、リンク、リスト等を保持）
- `xml`: 構造化XML（見出し、段落、リンク等を階層化）
- `json`: 構造化JSON（コンテンツ要素を分類して格納）

### check_robots
robots.txtのクロール可否確認

**パラメータ**:
- `url` (必須): 確認対象URL

**戻り値**:
```json
{
  "allowed": true,
  "crawl_delay": 1
}
```

## アーキテクチャ
- **処理場所**: 全てローカルマシン（MCPサーバー側）で実行
- **AIへの負荷**: 最小限（結果受信のみ）
- **ネットワーク**: MCPサーバーが直接HTTP/HTTPS通信
- **データ処理**: HTML解析、テキスト抽出、robots.txt解析すべてローカルで完結

## 制限事項
- 最大ページサイズ: 10MB
- リクエスト間隔: 最小1秒
- robots.txt完全遵守
- HTTPSを優先使用

## 技術スタック
- TypeScript + Node.js
- MCP SDK
- axios (HTTP)
- cheerio (HTML解析・フォーマット変換)
- robots-parser

## ディレクトリ構成
```
src/
├── index.ts           # MCPサーバー
├── tools/
│   ├── crawl-page.ts  # ページクロール
│   └── check-robots.ts # robots確認
└── utils/
    ├── crawler.ts     # クローラー機能
    ├── robots.ts      # robots.txt処理
    └── formatters.ts  # フォーマット変換
```

## 実装詳細

### 処理フロー
1. AI→MCPサーバー: URLとパラメータ（format含む）送信
2. MCPサーバー: robots.txt確認（ローカルで実行）
3. MCPサーバー: HTTP通信でページ取得（ローカルで実行）
4. MCPサーバー: HTML解析・コンテンツ抽出（ローカルで実行）
5. MCPサーバー: 指定フォーマットに変換（ローカルで実行）
6. MCPサーバー→AI: 変換済み結果のみ送信

### メリット
- AIトークン消費量を大幅削減
- 生HTMLをAIに送信しない
- ネットワーク通信はローカルマシンが担当
- レート制限もローカルで管理

## エラーハンドリング
- `-32001`: ネットワークエラー
- `-32002`: パースエラー  
- `-32003`: robots.txt違反
- `-32004`: レート制限
- `-32005`: サイズ超過

## 開発環境

### セットアップ
```bash
git clone https://github.com/naoto24kawa/open-clawler-mcp-server.git
cd open-clawler-mcp-server
npm install
```

### 開発用コマンド
```bash
# 開発モードで実行（ホットリロード）
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# 型チェック
npm run type-check

# リンター実行
npm run lint
```

### 開発時のMCP設定
開発中は以下の設定でローカルサーバーに接続：

```json
{
  "mcpServers": {
    "open-crawler-dev": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/path/to/open-clawler-mcp-server"
    }
  }
}
```

### プロジェクト構成
```
open-clawler-mcp-server/
├── src/                    # TypeScriptソースコード
│   ├── index.ts           # MCPサーバーエントリーポイント
│   ├── tools/             # MCPツール実装
│   └── utils/             # ユーティリティ関数
├── dist/                  # ビルド出力
├── __docs__/              # ドキュメント
├── package.json           # NPM設定
├── tsconfig.json          # TypeScript設定
└── README.md              # ユーザー向けドキュメント
```

### ビルドプロセス
1. TypeScriptコンパイル（`tsc`）
2. `dist/`フォルダに出力
3. NPMパッケージとして公開可能

### テスト
```bash
# テスト実行（実装時に追加予定）
npm test

# テストカバレッジ
npm run test:coverage
```