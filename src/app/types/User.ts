export type User = {
  uuid: string;
  firstname?: string;
  lastname?: string;
  companyName?: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
  createdAt: string;
  updatedAt: string;
  role: string;
};

export type Token = string;

export type getUsersAdminResponse = {
  success: boolean;
  data: User[];
};

export type UserAdmin = {
  uuid: string;
  firstname?: string;
  lastname?: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
  createdAt: string;
  updatedAt: string;
};
