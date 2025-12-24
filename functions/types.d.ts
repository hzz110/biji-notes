// Cloudflare Pages Functions 类型定义

declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    exec(query: string): Promise<D1ExecResult>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first<T = unknown>(): Promise<T | null>;
    run(): Promise<D1Result>;
    all<T = unknown>(): Promise<D1Result<T>>;
  }

  interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    meta: {
      duration: number;
      rows_read: number;
      rows_written: number;
      last_row_id: number;
      changed_db: boolean;
      changes: number;
    };
  }

  interface D1ExecResult {
    count: number;
    duration: number;
  }
}

export {};

