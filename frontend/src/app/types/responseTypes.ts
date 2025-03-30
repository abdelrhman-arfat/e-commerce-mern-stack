export type TResponse<T> = {
  results?:
    | T[]
    | {
        products?: {
          quantity: number;
          productId: string;
          _id: string;
          title: string;
          description: string;
          price: number;
          image: string;
          userId: string;
          createdAt: Date;
          updatedAt: Date;
          likes: {
            userId: string;
            createdAt: Date;
            updatedAt: Date;
          }[];
          comments: {
            userId: string;
            comment: string;
            createdAt: Date;
            updatedAt: Date;
          }[];
        }[];
      };
  totalPages?: number;
  currentPage?: number;
  totalData?: number;
  code: number;
  message: string;
  error?: string;
};
