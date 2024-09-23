import { injectable } from "tsyringe";

@injectable()
export default class ApiResponse<T> {
  // Private properties with default values
  private state: boolean = false;
  private data?: T = undefined;
  private message: string = "No message provided";
  private isAuthenticated: boolean = false;
  private isAuthorised: boolean = false;

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

  // Setter methods to update private properties
  public setState(state: boolean): void {
    this.state = state;
  }

  public setData(data: T): void {
    this.data = data;
  }

  public setMessage(message: string): void {
    this.message = message;
  }

  public setIsAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticated = isAuthenticated;
  }

  public setIsAuthorised(isAuthorised: boolean): void {
    this.isAuthorised = isAuthorised;
  }
  public setResponseSuccessful(message: string): void {
    this.isAuthenticated = true;
    this.isAuthorised = true;
    this.state = true;
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
    };
  }
}
