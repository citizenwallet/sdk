import { ConfigService } from "../../src/services/config";
import { ConfigActions } from "../../src/state/config";
import { MockApiService } from "./mock/api";

describe("Config", () => {
  let configService: ConfigService;
  let configActions: ConfigActions;

  beforeEach(() => {
    configService = new ConfigService(new MockApiService());
    configActions = new ConfigActions(new MockApiService());

    const state = configActions.store.getState();

    state.reset();
  });

  it("get a config", async () => {
    const config = await configService.getBySlug("community1");

    expect(config.community.name).toBe("Community 1");
  });

  it("get all configs", async () => {
    const configs = await configService.get();

    expect(configs.length).toBe(2);
  });

  it("get a config using a slug with the store", async () => {
    const state = configActions.store.getState();

    expect(state.loading).toBe(true);
    expect(state.error).toBe(false);
    expect(state.config).toBe(undefined);

    await configActions.getConfig("community1");

    const newState = configActions.store.getState();

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(false);
    expect(newState.config).not.toBe(undefined);
    expect(newState.config?.community.name).toBe("Community 1");
  });

  it("get all configs with the store", async () => {
    const state = configActions.store.getState();

    expect(state.loading).toBe(true);
    expect(state.error).toBe(false);
    expect(state.configs).toBe(undefined);

    await configActions.getConfigs();

    const newState = configActions.store.getState();

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(false);
    expect(newState.configs).not.toBe(undefined);
    expect(newState.configs?.length).toBe(2);
  });

  it("fail to get with the wrong slug with the store", async () => {
    const state = configActions.store.getState();

    expect(state.loading).toBe(true);
    expect(state.error).toBe(false);
    expect(state.config).toBe(undefined);

    await configActions.getConfig("invalidSlug");

    const newState = configActions.store.getState();

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(true);
    expect(newState.config).toBe(undefined);
  });
});
