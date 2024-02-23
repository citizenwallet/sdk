<div align="center">
    <img src="https://raw.githubusercontent.com/citizenwallet/sdk/main/assets/logo.png" alt="Citizen Wallet Logo" width="200">
    <h1>Citizen Wallet SDK</h1>
</div>

An easy-to-use SDK for building frontend interfaces that interact with a community server and any related smart contracts that we use. This SDK is frontend framework agnostic and includes types, API calls, and state management.

# Introduction

Welcome to the official SDK for our platform. This SDK provides a simple and efficient way to integrate your frontend application with our backend services. It's designed for speeding up development of client applications by providing state management out of the box. You can simply make requests and have your UI listen for and display the data.

Whether you're building a small side project or a large-scale commercial application, this SDK has everything you need to get started. It includes:

- **Types**: Comprehensive type definitions for all of our API responses and request bodies.
- **API Calls**: Pre-configured API calls to interact with our backend services.
- **State Management**: Built-in state management to help you manage the state of your application.

We hope you find this SDK useful, and we're excited to see what you build with it!

# Installation

To install the SDK, run the following command in your terminal:

```
npm install --save @citizenwallet/sdk
```

# Config

Every community and their currency has a configuration in a json format. These can be retrieved in order to interact with the community in question.

## useConfig (React with hooks)

We have created methods that you can call with state management, so that you can focus on building your user interface.

```
import { useConfig } from '@citizenwallet/sdk';
```

### Fetch all configs

```
function MyComponent() {
    const [subscribe, actions] = useConfig();

    useEffect(() => {
        actions.getConfigs();
    }, [actions])

    const configs = subscribe(state => state.configs); // the component will re-render whenever .configs changes
    const loading = subscribe(state => state.loading); // same here with loading

    return (
        <div>
            {loading && !configs?.length ? 'loading...' : configs.map(c => <div>c.community.name</div>)}
        </div>
    )
}
```

### Fetch single config

```
function MyComponent({ slug }) {
    const [subscribe, actions] = useConfig();

    useEffect(() => {
        actions.getConfig(slug); // fetch for a slug and any time the slug changes
    }, [actions, slug])

    const config = subscribe(state => state.config); // the component will re-render whenever .config changes
    const loading = subscribe(state => state.loading); // same here with loading

    return (
        <div>
            {loading && !configs?.length ? 'loading...' : <div>config.community.name</div>}
        </div>
    )
}
```

## ConfigService

You can interact with the ConfigService directly as well.

```
import { ConfigService } from '@citizenwallet/sdk';
```

### Fetch all configs

```
const configService = new ConfigServce();

const configs = await configService.get(); // all configs
```

### Fetch single config

```
const configService = new ConfigServce();

const config = await configService.getBySlug('my-slug'); // a single config
```

## Custom Base URL

You can point the service at another base url, if you have your own place where a `communities.json` file is stored.

```
import { useConfig } from '@citizenwallet/sdk';

const [subscribe, actions] = useConfig('https://your-custom-base-url.com');
```

You can do the same with the ConfigService.

```
import { ConfigService, ApiService } from '@citizenwallet/sdk';

const configService = new ConfigService(new ApiService('https://your-custom-base-url.com'));
```

# SimpleFaucet

An IOU is a smart contract which manages IOU redemption for a single ERC 20 token. It will hash, verify signatures and keep track of redemptions.

## useSimpleFaucetContract (React with hooks)

Import the SDK into your project:

```
import { useSimpleFaucetContract } from '@citizenwallet/sdk';
```

Then, you can use the SDK's functions to interact with the backend. For example:

```
const [subscribe, actions] = useSimpleFaucetContract(address, signer);
```

### Trigger actions.

```
actions.getHash(...);

actions.redeem(...);
```

### Listen to updates from the store.

```
const loading = subscribe(state => state.loading);
const hash = subscribe(state => state.hash);
```

### Access data directly

```
const hash = actions.store.getState().hash;
```

### Example

```
function Component() {
    const [subscribe, actions] = useSimpleFaucetContract(
        address, // contract address
        rpcSigner, // ethers JsonRpcSigner
        sender, // the smart contract account belonging to the signer
        config, // the community config
    );

    useEffect(() => {
        actions.fetchMetadata();
        actions.redeem();
    }, [actions]);

    const loading = subscribe(state => state.loading);
    const metadataLoading = subscribe(state => state.metadataLoading);
    const tokenAddress = subscribe(state => state.tokenAddress);
    const redeemAmount = subscribe(state => state.amount);

    return (
        <div>
        {metadataLoading? : 'loading meta data' : `token: ${tokenAddress} redeem amount: ${redeemAmount}`}
        {loading ? 'loading...' : 'redeemed!'}
        </div>
    )
}
```

## SimpleFaucetContractService (contract)

If you want to make direct calls to the contract and handle everything else yourself.

Import the SDK into your project:

```
import { SimpleFaucetContractService } from '@citizenwallet/sdk';
```

Then, you can use the SDK's functions to interact with the backend. For example:

```
const contract = SimpleFaucetContractService(
    address, // contract address
    rpcSigner, // ethers JsonRpcSigner
    sender, // the smart contract account belonging to the signer
    config, // the community config
);
```

### Trigger calls.

```
await contract.redeem();
```

# IOU

An IOU is a smart contract which manages IOU redemption for a single ERC 20 token. It will hash, verify signatures and keep track of redemptions.

## useIOUContract (React with hooks)

Import the SDK into your project:

```
import { useIOUContract } from '@citizenwallet/sdk';
```

Then, you can use the SDK's functions to interact with the backend. For example:

```
const [subscribe, actions] = useIOUContract(address, signer);
```

### Trigger actions.

```
actions.getHash(...);

actions.redeem(...);
```

### Listen to updates from the store.

```
const loading = subscribe(state => state.loading);
const hash = subscribe(state => state.hash);
```

### Access data directly

```
const hash = actions.store.getState().hash;
```

### Example

```
function Component() {
const [subscribe, actions] = useIOUContract(address, signer);

    useEffect(() => {
        actions.getHash(...);
    }, [actions]);

    const loading = subscribe(state => state.loading);
    const hash = subscribe(state => state.hash);

    return (
        <div>{loading ? 'loading...' : hash}</div>
    )

}
```

## IOUContractService (contract)

If you want to make direct calls to the contract and handle everything else yourself.

Import the SDK into your project:

```
import { IOUContractService } from '@citizenwallet/sdk';
```

Then, you can use the SDK's functions to interact with the backend. For example:

```
const contract = IOUContractService(address, signer);
```

### Trigger calls.

```
const hash = await contract.getHash(...);

await contract.redeem(...);
```

# Building

To build the SDK, run the following command in your terminal:

```
npm run build
```

This will compile the TypeScript code to JavaScript.

# Watching for Changes

To automatically recompile the SDK when a file changes, run the following command in your terminal:

```
npm run watch
```

# Contributing

We welcome contributions! Please see our contributing guidelines for more details.

# License

This project is licensed under the MIT license.
