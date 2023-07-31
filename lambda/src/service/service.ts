interface Service<T, D, U> {
    Create(data: D): Promise<void>;
    Update(id: T, data : D): Promise<void>;
    Delete(id: T): Promise<void>;
    GetAll(): Promise<U>;
    Get(id: T): Promise<U>;
  }
  