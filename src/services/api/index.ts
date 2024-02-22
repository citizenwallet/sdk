import { Api } from "./api";
import { BaseConfigApiService, ConfigApiService } from "./config";

export abstract class BaseApiService {
  abstract config: BaseConfigApiService;
}

export class ApiService implements BaseApiService {
  config: BaseConfigApiService;
  constructor(baseUrl: string) {
    this.config = new ConfigApiService(new Api(baseUrl));
  }
}
