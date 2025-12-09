export function apiResponse<T>(data: T, message = 'Success', success = true) {
  return {
    success,
    message,
    data,
    timestamp: new Date(),
  };
}
