import { injectable } from "tsyringe";

@injectable()
export default class ApiResponse<T> {
  // Private properties with default values
  private state: boolean = false;
  private data?: T = undefined;
  private message: string = "No message provided";
  private isAuthenticated: boolean = false;
  private isAuthorised: boolean = false;
  private page?: number;
  private pageSize?: number;
  private totalPages?: number;
  private hasNextPage?: boolean;

  // Getter methods to access private properties
  public getState(): boolean {
    return this.state;
  }

  public getData(): T | undefined {
    return this.data;
  }

  public getMessage(): string {
    return this.message;
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public getIsAuthorised(): boolean {
    return this.isAuthorised;
  }

  public setFailedResponse(
    message: string,
    isAuthenticated: boolean = true,
    isAuthorised: boolean = true
  ): void {
    this.isAuthenticated = isAuthenticated;
    this.isAuthorised = isAuthorised;
    this.state = false;
    this.message = message;
  }

  public setSuccessfulResponse(message: string, data: T): void {
    this.isAuthenticated = true;
    this.isAuthorised = true;
    this.state = true;
    this.message = message;
    this.data = data;
  }

  public setSuccessfulPageResponse(
    message: string,
    data: T,
    page: number,
    pageSize: number,
    totalPages: number
  ): void {
    this.isAuthenticated = true;
    this.isAuthorised = true;
    this.state = true;
    this.message = message;
    this.data = data;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
    this.hasNextPage = page < totalPages;
  }

  public setUnauthorisedResponse<T>(message: string): void {
    this.isAuthenticated = true;
    this.isAuthorised = false;
    this.state = false;
    this.message = message;
  }

  public setUnauthenticatedResponse<T>(message: string): void {
    this.isAuthenticated = false;
    this.isAuthorised = false;
    this.state = false;
    this.message = message;
  }

  // Method to convert the class instance to a JSON object
  public toJSON(): object {
    return {
      state: this.state,
      data: this.data,
      message: this.message,
      isAuthenticated: this.isAuthenticated,
      isAuthorised: this.isAuthorised,
      page: this.page,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
    };
  }
}
