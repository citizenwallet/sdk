import { BaseApiService } from "../../../src/services/api";
import { BaseConfigApiService } from "../../../src/services/api/config";
import { MockConfigApiService } from "./config";

export class MockApiService implements BaseApiService {
  config: BaseConfigApiService;
  constructor() {
    this.config = new MockConfigApiService();
  }
}
