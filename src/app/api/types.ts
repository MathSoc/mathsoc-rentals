export type GetManyResponse<T> = {
  data: T[];
  meta: {
    total_count: number;
    page_index: number;
    page_size: number;
  };
};
