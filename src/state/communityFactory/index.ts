import { StoreApi, useStore } from "zustand";
import store, { CommunityFactoryStore } from "./state";
import { useEffect, useMemo, useRef } from "react";
import { JsonRpcProvider } from "ethers";
import { CommunityFactoryContractService } from "../../services/contracts/CommunityFactory";
import { SessionService } from "../../services/session";
import { Network } from "../../constants/networks";

type communityFactoryStoreSelector<T> = (state: CommunityFactoryStore) => T;

export class CommunityFactoryContractActions {
  store: StoreApi<CommunityFactoryStore>;

  communityFactoryService: CommunityFactoryContractService;

  constructor(
    provider: JsonRpcProvider,
    network: Network,
    sessionService: SessionService
  ) {
    this.store = store;

    this.communityFactoryService = new CommunityFactoryContractService(
      network,
      provider,
      sessionService
    );
  }

  updateProvider(
    provider: JsonRpcProvider,
    network: Network,
    sessionService: SessionService
  ) {
    this.communityFactoryService = new CommunityFactoryContractService(
      network,
      provider,
      sessionService
    );

    this.store.getState().reset();
  }

  async estimateAmountToPay(
    owner: string,
    sponsor: string,
    token: string,
    salt: bigint
  ) {
    try {
      this.store.getState().estimateCommunityFactoryGasRequest();
      const amount = await this.communityFactoryService.estimateCreate(
        owner,
        sponsor,
        token,
        salt
      );

      this.store.getState().estimateCommunityFactoryGasSuccess(amount);
    } catch (error) {
      this.store.getState().estimateCommunityFactoryGasFailed();
    }
  }

  async createCommunityFactory(
    owner: string,
    sponsor: string,
    token: string,
    salt: bigint
  ): Promise<[string, string, string, string] | undefined> {
    try {
      this.store.getState().createRequest();
      const tx = await this.communityFactoryService.create(
        owner,
        sponsor,
        token,
        salt
      );

      await tx.wait();

      this.store.getState().createSuccess();
      return this.communityFactoryService.get(owner, sponsor, token, salt);
    } catch (error) {
      this.store.getState().createFailed();
    }

    return;
  }

  async getCommunityFactoryAddress(
    owner: string,
    sponsor: string,
    token: string,
    salt: bigint
  ) {
    try {
      this.store.getState().getCommunityFactoryAddressRequest();
      const [tokenEntryPoint, paymaster, accountFactory, profile] =
        await this.communityFactoryService.get(owner, sponsor, token, salt);

      this.store
        .getState()
        .getCommunityFactoryAddressSuccess(
          tokenEntryPoint,
          paymaster,
          accountFactory,
          profile
        );
    } catch (error) {
      this.store.getState().getCommunityFactoryAddressFailed();
    }
  }
}

export const useCommunityFactoryContract = (
  network: Network,
  sessionService: SessionService
): [
  <T>(selector: communityFactoryStoreSelector<T>) => T,
  CommunityFactoryContractActions
] => {
  const { rpcUrl } = network;

  const firstLoadRef = useRef(true);

  const configActions = useMemo(
    () =>
      new CommunityFactoryContractActions(
        new JsonRpcProvider(rpcUrl),
        network,
        sessionService
      ),
    [rpcUrl, network, sessionService]
  );

  useEffect(() => {
    if (!firstLoadRef.current) {
      configActions.updateProvider(
        new JsonRpcProvider(rpcUrl),
        network,
        sessionService
      );
    } else {
      firstLoadRef.current = false;
    }
  }, [configActions, rpcUrl, network, sessionService]);

  const useBoundStore = <T>(selector: communityFactoryStoreSelector<T>) =>
    useStore(configActions.store, selector);

  return [useBoundStore, configActions];
};
