import { ConfigIndexer } from "../api/config";

export type TransferStatus = "sending" | "pending" | "success" | "fail";

export interface TransferData {
  description: string;
}

export interface Transfer {
  hash: string;
  tx_hash: string;
  token_id: number;
  created_at: Date;
  from: string;
  to: string;
  nonce: number;
  value: number;
  data: TransferData | null;
  status: TransferStatus;
}

export interface IndexerResponsePaginationMetadata {
  limit: number;
  offset: number;
  total: number;
}
export interface ObjectResponse<T, M> {
  object: T;
  meta: M;
}

export interface ArrayResponse<T, M> {
  array: T[];
  meta: M;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface TransferQueryParams {
  maxDate: string;
}

export interface NewTransfersQueryParams {
  fromDate: string;
}

export class IndexerService {
  private url: string;
  private key: string;

  constructor(config: ConfigIndexer) {
    this.url = config.url;
    this.key = config.key;
  }

  async getTransfer(
    tokenAddress: string,
    hash: string
  ): Promise<ObjectResponse<Transfer, IndexerResponsePaginationMetadata>> {
    const url = `${this.url}/logs/v2/transfers/${tokenAddress}/tx/${hash}`;

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${this.key}` },
    });
    return resp.json();
  }

  async getAllTransfers(
    tokenAddress: string,
    params?: PaginationParams & TransferQueryParams
  ): Promise<ArrayResponse<Transfer, IndexerResponsePaginationMetadata>> {
    let url = `${this.url}/logs/v2/transfers/${tokenAddress}`;

    if (params) {
      url += `?limit=${params.limit}&offset=${params.offset}`;

      if (params.maxDate) {
        url += `&maxDate=${params.maxDate}`;
      }
    }

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${this.key}` },
    });
    return resp.json();
  }

  async getTransfers(
    tokenAddress: string,
    accountAddress: string,
    params?: PaginationParams & TransferQueryParams
  ): Promise<ArrayResponse<Transfer, IndexerResponsePaginationMetadata>> {
    let url = `${this.url}/logs/v2/transfers/${tokenAddress}/${accountAddress}`;

    if (params) {
      url += `?limit=${params.limit}&offset=${params.offset}`;

      if (params.maxDate) {
        url += `&maxDate=${params.maxDate}`;
      }
    }

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${this.key}` },
    });
    return resp.json();
  }

  async getNewTransfers(
    tokenAddress: string,
    accountAddress: string,
    params?: PaginationParams & NewTransfersQueryParams
  ): Promise<ArrayResponse<Transfer, IndexerResponsePaginationMetadata>> {
    let url = `${this.url}/logs/v2/transfers/${tokenAddress}/${accountAddress}/new`;

    if (params) {
      url += `?limit=${params.limit}&offset=${params.offset}`;

      if (params.fromDate) {
        url += `&fromDate=${params.fromDate}`;
      }
    }

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${this.key}` },
    });
    return resp.json();
  }

  async getAllNewTransfers(
    tokenAddress: string,
    params?: PaginationParams & NewTransfersQueryParams
  ): Promise<ArrayResponse<Transfer, IndexerResponsePaginationMetadata>> {
    let url = `${this.url}/logs/v2/transfers/${tokenAddress}/new`;

    if (params) {
      url += `?limit=${params.limit}&offset=${params.offset}`;

      if (params.fromDate) {
        url += `&fromDate=${params.fromDate}`;
      }
    }

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${this.key}` },
    });
    return resp.json();
  }
}
