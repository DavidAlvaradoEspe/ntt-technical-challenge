export interface ApiData<T>{
  data: T;
}
export interface ApiDataMessage<T>{
  message: string;
  data: T;
}
export interface ApiMessage{
  message: string;
}
export interface ApiErrorPayload {
  name?: string,
  message?: string,
  errors? : unknown
}
