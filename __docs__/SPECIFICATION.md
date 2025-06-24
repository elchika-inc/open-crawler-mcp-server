# ウェブクローラーMCPサーバー仕様書

## 概要
ウェブページからテキストコンテンツを取得するシンプルなMCPサーバー。
**重要**: 全てのクロール処理はローカルマシン（MCPサーバー）で実行し、AIには結果のみを返すことでAIのコストを削減する。

## MCPツール

### crawl_page
ウェブページのテキストコンテンツを取得

**パラメータ**:
- `url` (必須): 対象URL
- `selector` (オプション): CSSセレクター
- `text_only` (オプション): テキストのみ取得（デフォルトtrue）

**戻り値**:
```json
{
  "url": "実際のURL",
  "title": "ページタイトル",
  "content": "抽出されたテキスト",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

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
- cheerio (HTML解析)
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
    └── robots.ts      # robots.txt処理
```

## 実装詳細

### 処理フロー
1. AI→MCPサーバー: URLとパラメータ送信
2. MCPサーバー: robots.txt確認（ローカルで実行）
3. MCPサーバー: HTTP通信でページ取得（ローカルで実行）
4. MCPサーバー: HTML解析・テキスト抽出（ローカルで実行）
5. MCPサーバー→AI: 結果のみ送信

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