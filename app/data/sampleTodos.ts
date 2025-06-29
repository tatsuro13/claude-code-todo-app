import type { Todo } from '~/lib/types';

export const sampleTodos: Todo[] = [
  {
    id: 1,
    title: "プロジェクトの企画書を作成",
    description: "新しいWebアプリケーションの企画書を作成する",
    completed: false,
    priority: 'high',
    createdAt: "2025-06-28T10:00:00Z",
    tags: ["仕事", "企画"]
  },
  {
    id: 2,
    title: "買い物リストを作成",
    description: "週末の買い物リストを作成する",
    completed: true,
    priority: 'medium',
    createdAt: "2025-06-27T14:30:00Z",
    tags: ["プライベート", "買い物"]
  },
  {
    id: 3,
    title: "React Router v7の学習",
    description: "新しいフレームワークモードの機能を理解する",
    completed: false,
    priority: 'high',
    createdAt: "2025-06-26T09:15:00Z",
    tags: ["学習", "技術"]
  },
  {
    id: 4,
    title: "デザインシステムの構築",
    description: "Tailwind CSSを使ったコンポーネントライブラリを作成",
    completed: false,
    priority: 'medium',
    createdAt: "2025-06-25T16:45:00Z",
    tags: ["デザイン", "仕事"]
  },
  {
    id: 5,
    title: "健康診断の予約",
    description: "年次健康診断の予約を取る",
    completed: true,
    priority: 'low',
    createdAt: "2025-06-24T11:20:00Z",
    tags: ["健康", "プライベート"]
  },
  {
    id: 6,
    title: "コードレビューの実施",
    description: "チームメンバーのプルリクエストをレビュー",
    completed: false,
    priority: 'high',
    createdAt: "2025-06-23T13:30:00Z",
    tags: ["仕事", "コードレビュー"]
  },
  {
    id: 7,
    title: "データベースの設計",
    description: "D1データベースのスキーマ設計と最適化",
    completed: false,
    priority: 'medium',
    createdAt: "2025-06-22T08:00:00Z",
    tags: ["データベース", "技術"]
  },
  {
    id: 8,
    title: "週報の作成",
    description: "今週の作業内容をまとめて週報を作成",
    completed: true,
    priority: 'low',
    createdAt: "2025-06-21T17:00:00Z",
    tags: ["報告", "仕事"]
  },
  {
    id: 9,
    title: "テストケースの追加",
    description: "新機能に対するVitest単体テストを作成",
    completed: false,
    priority: 'medium',
    createdAt: "2025-06-20T14:15:00Z",
    tags: ["テスト", "品質"]
  },
  {
    id: 10,
    title: "ドキュメントの更新",
    description: "APIドキュメントとREADMEを最新状態に更新",
    completed: false,
    priority: 'low',
    createdAt: "2025-06-19T10:30:00Z",
    tags: ["ドキュメント", "保守"]
  }
];