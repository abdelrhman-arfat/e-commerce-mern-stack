export type TResponse<T> = {
  results?:
    | T[]
    | {
        _id: string;
        title: string;
        description?: string;
        price: number;
        image: string;
        category: string;
        isDone: boolean;
        quantity: number;
        likes: { userId: string; createdAt: Date; updatedAt: Date }[];
        comments: {
          userId: string;
          comment: string;
          createdAt: Date;
          updatedAt: Date;
        }[];
        products?: {
          quantity?: number;
          productId: {
            quantity: number;
            price: number;
            title: string;
            image: string;
            category: string;
            _id: string;
          };
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
