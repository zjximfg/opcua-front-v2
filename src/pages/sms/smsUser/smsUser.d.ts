
export default interface SmsUserDataType {
  id: number;
  roleId: number;
  name: string;
  gender: number;
  telephone: string;
  email: string;
  description: string;
}


export interface SmsUserQueryParams {
  roleId?: number;
  name?: string;
  telephone?: string;
  description?: string;
  pageSize?: number;
  currentPage?: number;
}
