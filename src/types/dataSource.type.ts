export interface DataSource<T> {
  findById(id: string): Promise<T>
}
