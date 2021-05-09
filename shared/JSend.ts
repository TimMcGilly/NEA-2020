type APIResponseSuccess = {
    status: 'success',
    data: unknown
  };
  
  type APIResponseFail = {
    status: 'fail',
    data: {[k: string]: unknown},
  };
  
  type APIResponseError = {
    status: 'error',
    message: string,
    data?: unknown,
    code?: number
  };
  
export type APIResponse = APIResponseSuccess | APIResponseFail | APIResponseError;