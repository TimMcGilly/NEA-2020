import { AxiosResponse } from 'axios';

export class ResponseHandler {
    private res: AxiosResponse;

    constructor(res: AxiosResponse) {
      this.res = res;
    }

    get isSuccess(): boolean {
      return this.res.data.status === 'success' && !this.HasErrorStatusCode();
    }

    get isFail(): boolean {
      return this.res.data.status === 'fail' && !this.HasErrorStatusCode();
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

    /**
     * Returns formatted string array of all errors
     */
    get failArray(): string[] {
      // Formats fail as string array from object.
      if (this.isFail) {
        const failArray = [];
        Object.keys(this.res.data.data).forEach((key) => {
          failArray.push(`${key}: ${this.res.data.data[key]}`);
        });
      }

      if (this.isError) { return [`Internal Error: ${this.res.data.message}`]; }
      return [];
    }
}
