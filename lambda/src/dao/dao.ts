interface DAO<T, U> {
  Create(input: T): Promise<U>;
  Update(input: T): Promise<U>;
  Delete(input: T): Promise<U>;
  GetAll(input: T): Promise<U>;
  Get(input: T): Promise<U>;
}
