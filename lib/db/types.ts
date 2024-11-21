export interface User {
  id?: number;
  uuid: string;
  fullName: string;
  email: string;
  company: string;
  role: string;
  scored?: boolean;
  createdDate?: string;
}

export interface Score {
  id: number;
  userId: number;
  score: number;
}