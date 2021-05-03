import { AxiosResponse } from 'axios';

export class ResponseHandler {
    private res: AxiosResponse;

    constructor(res: AxiosResponse) {
      this.res = res;
    }

    get isSuccess(): boolean {
      return this.res.data.status === 'success' || !this.HasErrorStatusCode();
    }

    get isFail(): boolean {
      return this.res.data.status === 'fail' || !this.HasErrorStatusCode();
    }

    get isError(): boolean {
      return this.res.data.status === 'error' || this.HasErrorStatusCode();
    }

    private HasErrorStatusCode(): boolean {
      return this.res.status >= 400 && this.res.status <= 600;
    }

    get data() {
      if (this.isFail || this.isSuccess) { return this.res.data.data; }

      // If error
      return this.res.data.message;
    }

    get failArray(): string[] {
      if (this.isFail) {
        return this.res.data.data;
      }
      if (this.isError) { return [`Internal Error: ${this.res.data.message}`]; }
      return [];
    }
}
