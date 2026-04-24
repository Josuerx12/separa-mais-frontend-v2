export interface IPagination<Item> {
  items: Item[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}
