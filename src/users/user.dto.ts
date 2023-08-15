export interface UserDto {
  id: number;
  email?: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: string[];
  verified: boolean;
}

type NullableKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];
export type UserDtoIgnorableFields = NullableKeys<UserDto>[];
