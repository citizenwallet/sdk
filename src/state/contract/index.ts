import { StoreApi, useStore } from "zustand";
import store, { ContractStore } from "./state";
import { useMemo } from "react";
import { Config } from "../../services/api/config";
import { GenericContractService } from "../../services/contracts/generic";
import { JsonRpcProvider } from "ethers";

type contractStoreSelector<T> = (state: ContractStore) => T;

export class ContractActions {
  store: StoreApi<ContractStore>;

  contractService: GenericContractService;

  constructor(rpcUrl: string) {
    this.store = store;

    const provider = new JsonRpcProvider(rpcUrl);
    this.contractService = new GenericContractService(provider);
  }

  updateRpcUrl(rpcUrl: string) {
    const provider = new JsonRpcProvider(rpcUrl);
    this.contractService.updateProvider(provider);
  }

  async checkExists(address: string) {
    try {
      this.store.getState().request();

      const exists = await this.contractService.exists(address);

      this.store.getState().checkExistsSuccess(exists);
    } catch (error) {
      this.store.getState().failed();
    }
  }
}

export const useContract = (
  config: Config
): [<T>(selector: contractStoreSelector<T>) => T, ContractActions] => {
  const { url } = config.node;

  const contractActions = useMemo(() => new ContractActions(url), [url]);

  const useBoundStore = <T>(selector: contractStoreSelector<T>) =>
    useStore(contractActions.store, selector);

  return [useBoundStore, contractActions];
};
