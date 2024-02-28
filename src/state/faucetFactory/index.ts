import { StoreApi, useStore } from "zustand";
import store, { FaucetFactoryStore } from "./state";
import { useEffect, useRef } from "react";
import { SessionService } from "../../services/session";
import { BaseWallet, JsonRpcProvider } from "ethers";
import { Config } from "../../services/api/config";
import { FaucetFactoryContractService } from "../../services/contracts/FaucetFactory";
import { FaucetFactories } from "../../config";

type faucetFactoryStoreSelector<T> = (state: FaucetFactoryStore) => T;

export class FaucetFactoryContractActions {
  store: StoreApi<FaucetFactoryStore>;

  sessionService: SessionService;
  faucetFactoryService: FaucetFactoryContractService;

  constructor(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress: string,
    chainId: string,
    signer?: BaseWallet | undefined
  ) {
    this.store = store;
    this.sessionService = new SessionService(
      provider,
      wsUrl,
      accountFactoryAddress,
      signer
    );
    this.faucetFactoryService = new FaucetFactoryContractService(
      FaucetFactories[chainId],
      provider,
      this.sessionService.signer
    );
  }

  updateProvider(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress: string,
    chainId: string
  ) {
    this.sessionService.updateProvider(provider, wsUrl, accountFactoryAddress);
    this.faucetFactoryService = new FaucetFactoryContractService(
      FaucetFactories[chainId],
      provider,
      this.sessionService.signer
    );

    this.store.getState().reset();
  }

  getSigner() {
    return this.sessionService.signer;
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
  config: Config
): [
  <T>(selector: faucetFactoryStoreSelector<T>) => T,
  FaucetFactoryContractActions
] => {
  const { url: rpcUrl, ws_url: wsUrl } = config.node;
  const { account_factory_address: accountFactoryAddress } = config.erc4337;

  const firstLoadRef = useRef(true);

  const configActionsRef = useRef(
    new FaucetFactoryContractActions(
      new JsonRpcProvider(rpcUrl),
      wsUrl,
      accountFactoryAddress,
      config.node.chainId.toString(10)
    )
  );

  useEffect(() => {
    if (!firstLoadRef.current) {
      configActionsRef.current.updateProvider(
        new JsonRpcProvider(rpcUrl),
        wsUrl,
        accountFactoryAddress,
        config.node.chainId.toString(10)
      );
    } else {
      firstLoadRef.current = false;
    }
  }, [rpcUrl, wsUrl, accountFactoryAddress]);

  const useBoundStore = <T>(selector: faucetFactoryStoreSelector<T>) =>
    useStore(configActionsRef.current.store, selector);

  return [useBoundStore, configActionsRef.current];
};
