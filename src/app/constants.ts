import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { SmartWalletOptions } from "thirdweb/wallets";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
	throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
	clientId: clientId,
});

export const chain = sepolia;
export const tokenDropAddress = "0xB559DbB23fb9c383E759404B70591FD3764Ed63b";
export const editionDropAddress = "0xa2c644D07a78aD12A71c75D5185Fc6885D4bBb48";
export const editionDropTokenId = 9n;

export const editionDropContract = getContract({
	address: editionDropAddress,
	chain,
	client,
});

export const tokenDropContract = getContract({
	address: tokenDropAddress,
	chain,
	client,
});

export const accountAbstraction: SmartWalletOptions = {
	chain,
	sponsorGas: true,
};
