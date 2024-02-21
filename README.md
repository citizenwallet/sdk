<div align="center">
    <img src="https://raw.githubusercontent.com/citizenwallet/sdk/main/assets/logo.png" alt="Citizen Wallet Logo" width="200">
    <h1>Citizen Wallet SDK</h1>
</div>

An easy-to-use SDK for building frontend interfaces that interact with our backend. This SDK is frontend framework agnostic and includes types, API calls, and state management.

## Introduction

Welcome to the official SDK for our platform. This SDK provides a simple and efficient way to integrate your frontend application with our backend services. It's designed to be easy to use, while providing a comprehensive set of features to help you build powerful applications.

Whether you're building a small side project or a large-scale commercial application, this SDK has everything you need to get started. It includes:

- **Types**: Comprehensive type definitions for all of our API responses and request bodies.
- **API Calls**: Pre-configured API calls to interact with our backend services.
- **State Management**: Built-in state management to help you manage the state of your application.

We hope you find this SDK useful, and we're excited to see what you build with it!

## Installation

To install the SDK, run the following command in your terminal:

```
npm install --save @citizenwallet/sdk
```

## Usage (React with hooks)

Import the SDK into your project:

```
import { useERC20IOU } from '@citizenwallet/sdk';
```

Then, you can use the SDK's functions to interact with the backend. For example:

```
const [store, actions] = useERC20IOU(signer, address);
```

Trigger actions.

```
actions.getHash(...);

actions.redeem(...);
```

Listen to updates from the store.

```
const loading = store(state => state.loading);
const hash = store(state => state.hash);
```

```
function Component() {
    const [store, actions] = useERC20IOU(signer, address);

    useEffect(() => {
        actions.getHash(...);
    }, [actions]);

    const loading = store(state => state.loading);
    const hash = store(state => state.hash);

    return (
        <div>{loading ? 'loading...' : hash}</div>
    )
}
```

## Usage (vanilla)

If you are not using React, you can simply instantiate and call functions directly.

Import the SDK into your project:

```
import { ERC20IOU } from '@citizenwallet/sdk';
```

Then, you can use the SDK's functions to interact with the backend. For example:

```
const erc20IOU = ERC20IOU(signer, address);
```

Trigger calls.

```
erc20IOU.getHash(...);

erc20IOU.redeem(...);
```

Get data from calls.

```
const state = erc20IOU.store.getState();

console.log('loading', state.loading);
console.log('hash', state.hash);
```

Subscribe to changes.

```
erc20IOU.store.subscribe((state) => {
      // do something here;
});
```

## Building

To build the SDK, run the following command in your terminal:

```
npm run build
```

This will compile the TypeScript code to JavaScript.

## Watching for Changes

To automatically recompile the SDK when a file changes, run the following command in your terminal:

```
npm run watch
```

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

This project is licensed under the MIT license.
