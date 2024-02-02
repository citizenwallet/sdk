# SDK

An easy-to-use SDK for building frontend interfaces that interact with our backend. This SDK is frontend framework agnostic and includes types, API calls, and state management.

## Installation

To install the SDK, run the following command in your terminal:

```
npm install --save @citizenwallet/sdk
```

## Usage

Import the SDK into your project:

```
import { useTransactions } from '@citizenwallet/sdk';
```

Then, you can use the SDK's functions to interact with the backend. For example:

```
const transactions = useTransactions(address);
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
