import { StoreApi, useStore } from "zustand";
import store, { FaucetFactoryStore } from "./state";
import { useEffect, useMemo, useRef } from "react";
import { JsonRpcProvider } from "ethers";
import { Config } from "../../services/api/config";
import { FaucetFactoryContractService } from "../../services/contracts/FaucetFactory";
import { FaucetFactories } from "../../config";
import { SessionService } from "../../services/session";

type faucetFactoryStoreSelector<T> = (state: FaucetFactoryStore) => T;

export class FaucetFactoryContractActions {
  store: StoreApi<FaucetFactoryStore>;

  faucetFactoryService: FaucetFactoryContractService;

  constructor(
    provider: JsonRpcProvider,
    chainId: string,
    sessionService: SessionService
  ) {
    this.store = store;

    this.faucetFactoryService = new FaucetFactoryContractService(
      FaucetFactories[chainId],
      provider,
      sessionService
    );
  }

  updateProvider(
    provider: JsonRpcProvider,
    chainId: string,
    sessionService: SessionService
  ) {
    this.faucetFactoryService = new FaucetFactoryContractService(
      FaucetFactories[chainId],
      provider,
      sessionService
    );

    this.store.getState().reset();
  }

  async estimateAmountToPay(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ) {
    try {
      this.store.getState().estimateSimpleFaucetGasRequest();
      const amount = await this.faucetFactoryService.estimateCreateSimpleFaucet(
        owner,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        redeemAdmin
      );

      this.store.getState().estimateSimpleFaucetGasSuccess(amount);
    } catch (error) {
      this.store.getState().estimateSimpleFaucetGasFailed();
    }
  }

  async createSimpleFaucet(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ): Promise<string | undefined> {
    try {
      this.store.getState().createRequest();
      const tx = await this.faucetFactoryService.createSimpleFaucet(
        owner,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        redeemAdmin
      );

      await tx.wait();

      this.store.getState().createSuccess();
      return this.faucetFactoryService.getSimpleFaucetAddress(
        owner,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        redeemAdmin
      );
    } catch (error) {
      this.store.getState().createFailed();
    }

    return;
  }

  async getSimpleFaucetAddress(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ) {
    try {
      this.store.getState().getSimpleFaucetAddressRequest();
      const address = await this.faucetFactoryService.getSimpleFaucetAddress(
        owner,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        redeemAdmin
      );

      this.store.getState().getSimpleFaucetAddressSuccess(address);
    } catch (error) {
      this.store.getState().getSimpleFaucetAddressFailed();
    }
  }
}

export const useFaucetFactoryContract = (
  config: Config,
  sessionService: SessionService
): [
  <T>(selector: faucetFactoryStoreSelector<T>) => T,
  FaucetFactoryContractActions
] => {
  const { url: rpcUrl, chain_id: chainId } = config.node;

  const firstLoadRef = useRef(true);

  const configActions = useMemo(
    () =>
      new FaucetFactoryContractActions(
        new JsonRpcProvider(rpcUrl),
        chainId.toString(10),
        sessionService
      ),
    [rpcUrl, chainId, sessionService]
  );

  useEffect(() => {
    if (!firstLoadRef.current) {
      configActions.updateProvider(
        new JsonRpcProvider(rpcUrl),
        chainId.toString(10),
        sessionService
      );
    } else {
      firstLoadRef.current = false;
    }
  }, [configActions, rpcUrl, chainId, sessionService]);

  const useBoundStore = <T>(selector: faucetFactoryStoreSelector<T>) =>
    useStore(configActions.store, selector);

  return [useBoundStore, configActions];
};
