
export interface TableState<T> {
  currentPage: number;
  cachedPages: Record<number, T[]>;
}

export interface TablesState {
  albums: TableState<any>;
  users: TableState<any>;
  posts: TableState<any>;
  comments: TableState<any>;
}
