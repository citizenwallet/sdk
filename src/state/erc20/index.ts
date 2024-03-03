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
import { isRefScrollable } from "../../utils/scroll";
import { delay } from "../../utils/delay";

type erc20StoreSelector<T> = (state: ERC20Store) => T;

/**
 * Represents a class that provides actions related to ERC20 tokens.
 */
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

  /**
   * Retrieves the balance of the specified address.
   * @param address The address for which to retrieve the balance.
   */
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

  /**
   * Retrieves transfers for a given address.
   *
   * @param address - The address for which to retrieve transfers.
   * @param reset - Indicates whether to reset the state before fetching transfers.
   * @returns A promise that resolves to a boolean indicating whether the transfers were successfully retrieved.
   */
  async getTransfers(address: string, reset = false): Promise<boolean> {
    try {
      if (reset) {
        this.fetchMaxDate = new Date();
        this.transfersPagination = undefined;
        this.previousFetchLength = 0;
      }

      if (
        this.transfersPagination &&
        this.previousFetchLength < this.fetchLimit
      ) {
        // nothing more to fetch
        return false;
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

      if (reset) {
        this.store.getState().transfersSuccess(transfers.array);
        return true;
      }

      this.store.getState().transfersSuccessAppend(transfers.array);
      return true;
    } catch (error) {
      this.store.getState().transfersFailed();
    }

    return false;
  }

  /**
   * Fetches transfers for a given address automatically based on scrolling behavior in a given div.
   * This allows you to easily implement infinite scrolling for transfers.
   * The function will automatically stop fetching when there are no more transfers to fetch.
   *
   * If the div isn't scrollable yet, it will keep trying to fetch until it is.
   *
   * @param address - The address for which transfers are to be fetched.
   * @param scrollableRef - A reference to the scrollable element.
   * @param cleanupFunctionRef - A mutable reference to the cleanup function.
   * @param refetchDelay - The delay (in milliseconds) between subsequent fetches. Default is 500ms.
   */
  async getTransfersForScrollable(
    address: string,
    scrollableRef: React.RefObject<HTMLDivElement>,
    cleanupFunctionRef: React.MutableRefObject<() => void>,
    refetchDelay = 500
  ) {
    try {
      const isScrollable = isRefScrollable(scrollableRef);

      if (!isScrollable) {
        // try and fetch until we have enough to scroll, stop if we have no more to fetch
        const hasMore = await this.getTransfers(address);
        if (!hasMore) {
          cleanupFunctionRef.current = () => {};
          return;
        }

        await delay(refetchDelay);

        this.getTransfersForScrollable(
          address,
          scrollableRef,
          cleanupFunctionRef,
          refetchDelay
        );

        return;
      }

      const listener = () => {
        if (scrollableRef.current) {
          if (
            scrollableRef.current.scrollTop +
              scrollableRef.current.clientHeight >=
            scrollableRef.current.scrollHeight
          ) {
            this.getTransfers(address);
          }
        }
      };

      scrollableRef.current?.addEventListener("scroll", listener);

      cleanupFunctionRef.current = () => {
        // remove listener
        scrollableRef.current?.removeEventListener("scroll", listener);
      };
      return;
    } catch (error) {}
    cleanupFunctionRef.current = () => {};
    return;
  }
}

/**
 * Custom hook for interacting with ERC20 tokens.
 * This provides state management functionality where you can call actions that trigger state changes.
 * You can listen to state changes on your UI components and update them accordingly.
 *
 * @param config - The configuration object.
 * @returns An array containing a selector function and ERC20 actions.
 */
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

  /**
   * Custom hook for accessing the ERC20 store.
   * @param selector - The selector function.
   * @returns The selected value from the ERC20 store.
   */
  const useBoundStore = <T>(selector: erc20StoreSelector<T>) =>
    useStore(configActions.store, selector);

  return [useBoundStore, configActions];
};
