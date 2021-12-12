export interface DataSource<T> {
  findById(id: string): T
}
