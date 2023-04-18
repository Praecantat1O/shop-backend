export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
}

export interface IProductPut {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface IStock {
  product_id: string;
  count: number;
}

export interface IStockPut {
  product_id: string;
  count: number;
}
