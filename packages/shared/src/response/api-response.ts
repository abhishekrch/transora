export class ApiResponse<T = unknown> {
  constructor(
    public data: T,
    public message?: string,
  ) {}
}
