import { BaseApiService } from "../../../src/services/api";
import {
  BaseConfigApiService,
  ConfigApiService,
} from "../../../src/services/api/config";
import { MockConfigApi } from "./config";

export class MockApiService implements BaseApiService {
  config: BaseConfigApiService;
  constructor() {
    this.config = new ConfigApiService(new MockConfigApi());
  }
}
