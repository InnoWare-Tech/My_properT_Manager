export default interface IApiResponse<T> {
  state: boolean;
  data?: T;
  message: string;
  isAuthenticated: boolean;
  isAuthorised: boolean;
}
