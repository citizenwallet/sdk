import { StoreApi, useStore } from "zustand";
import store, { ERC20Store } from "./state";
import { useMemo } from "react";
import { Config, ConfigIndexer } from "../../services/api/config";
import { JsonRpcProvider } from "ethers";
import { ERC20ContractService } from "../../services/contracts/ERC20";
import {
  IndexerResponsePaginationMetadata,
  IndexerService,
} from "../../services/indexer";

type erc20StoreSelector<T> = (state: ERC20Store) => T;

export class ERC20Actions {
  store: StoreApi<ERC20Store>;

  tokenAddress: string;

  erc20Service: ERC20ContractService;
  indexerService: IndexerService;

  constructor(
    tokenAddress: string,
    wsUrl: string,
    provider: JsonRpcProvider,
    configIndexer: ConfigIndexer
  ) {
    this.store = store;
    this.tokenAddress = tokenAddress;
    this.erc20Service = new ERC20ContractService(tokenAddress, wsUrl, provider);
    this.indexerService = new IndexerService(configIndexer);
  }

  async getBalance(address: string) {
    try {
      this.store.getState().balanceRequest();

      const balance = await this.erc20Service.balanceOf(address);

      this.store.getState().balanceSuccess(balance);
    } catch (error) {
      this.store.getState().balanceFailed();
    }
  }

  private fetchMaxDate = new Date();
  private fetchLimit = 10;
  private transfersPagination?: IndexerResponsePaginationMetadata;
  private previousFetchLength = 0;
  async getTransfers(address: string) {
    try {
      if (
        this.transfersPagination &&
        this.previousFetchLength < this.fetchLimit
      ) {
        // nothing more to fetch
        return;
      }

      this.store.getState().transfersRequest();

      const params = {
        maxDate: this.fetchMaxDate.toISOString(),
        limit: this.fetchLimit,
        offset: this.transfersPagination
          ? this.transfersPagination.offset + this.fetchLimit
          : 0,
      };

      const transfers = await this.indexerService.getAllTransfers(
        this.tokenAddress,
        address,
        params
      );

      this.transfersPagination = transfers.meta;
      this.previousFetchLength = transfers.array.length;

      this.store.getState().transfersSuccessAppend(transfers.array);
    } catch (error) {
      this.store.getState().transfersFailed();
    }
  }
}

export const useERC20 = (
  config: Config
): [<T>(selector: erc20StoreSelector<T>) => T, ERC20Actions] => {
  const { url: rpcUrl, ws_url: wsUrl } = config.node;
  const { address } = config.token;

  const configActions = useMemo(
    () =>
      new ERC20Actions(
        address,
        wsUrl,
        new JsonRpcProvider(rpcUrl),
        config.indexer
      ),
    [address, wsUrl, rpcUrl, config.indexer]
  );

  const useBoundStore = <T>(selector: erc20StoreSelector<T>) =>
    useStore(configActions.store, selector);

  return [useBoundStore, configActions];
};
