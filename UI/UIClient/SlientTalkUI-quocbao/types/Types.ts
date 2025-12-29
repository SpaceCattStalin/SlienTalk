export type Collection = {
  collectionId: string;
  name: string;
  createdBy: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number | null;
  signWords: SignWord[];
};

type Word = {
  id: string;
  word: string;
  meaning: string;
  example?: string;
};

export interface SignWord {
  signWordId: string;
  word: string;
  category: string;
  definition?: string | null;
  wordType?: string | null;
  signWordUri?: string | null;
  exampleSentence?: string | null;
  exampleSentenceVideoUri?: string | null;
  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
  isInUserCollection: boolean;
}

export type GenericResponse<T = any> = {
  isSuccess: boolean;         // always present
  message?: string;           // optional success message
  errorMessage?: string;      // optional error message
  data?: T | null;            // optional payload, can be any type or null
  count?: number;             // optional, for list endpoints
};

export type ApiResponse<T> = {
  isSuccess: boolean,
  data?: T;
};

export type CreatePaymentResponse = {
  orderUrl: string,
  zpTransToken: string,
  message: string;
};

export type PaymentCallback = {
  app_id: number,
  app_trans_id: string,
  app_time: number,
  app_user: string,
  amount: number,
  embed_data: string,
  item: string,
  za_trans_id: number,
  server_time: number,
  channel: number,
  merchant_user_id: string,
  user_fee_amount: number,
  discount_amount: number,
  return_code: number,
  return_message: string
}

export type CreatePaymentRequest = {
  userId: string,
  amount: number,
  itemName: string,
  description: string;
};

export interface MoveSignWordRequest {
  signWordId: string;
  fromCollectionId: string;
  toCollectionId: string;
}

export interface MoveSignWordResponse {
  isSuccess: boolean;
  message?: string;
}

export interface DeleteCollectionResponse {
  isSuccess: boolean;
  message?: string;
  errorMessage?: string;
}

export type UserInfo = {
  id: string,
  name: string,
  phoneNumber: string;
  imgUrl?: string
};

export type GetWordsByCollection = {
  collectionName: string,
  words: SignWord[];
};

export interface SignWordCategoryResponse {
  isSuccess: boolean;
  count: number;
  data: SignWord[];
}
export interface WordByIdResponse {
  isSuccess: boolean;
  data?: SignWord;
  errorMessage?: string;
}

export interface RelatedWord {
  relatedSignWordId: string;
  word: string;
  notes?: string;
}

export interface CreateCollectionRequest {
  name: string;
  isDefault: boolean;
}

export interface AddSignWordToCollectionRequest {
  collectionId: string;
  signWordId: string;
}