"use client";
import { balanceOf, claimTo as claimNFT } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
  useSendBatchTransaction,
} from "thirdweb/react";
import {
  accountAbstraction,
  client,
  editionDropContract,
  editionDropTokenId,
  tokenDropContract,
} from "../constants";
import Link from "next/link";
import { getBalance, claimTo as claimToken } from "thirdweb/extensions/erc20";
import { lightTheme } from "thirdweb/react";

const BatchingHome = () => {
  const smartAccount = useActiveAccount();
  const { data: tokenBalance, refetch: refetchTokens } = useReadContract(
    getBalance,
    {
      contract: tokenDropContract,
      address: smartAccount?.address!,
      queryOptions: { enabled: !!smartAccount },
    }
  );
  const { data: nftBalance, refetch: refetchNFTs } = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccount?.address!,
    tokenId: editionDropTokenId,
    queryOptions: { enabled: !!smartAccount },
  });
  const { mutate: sendBatch, isPending } = useSendBatchTransaction();

  const handleClick = async () => {
    if (!smartAccount) return;
    const transactions = [
      claimNFT({
        contract: editionDropContract,
        tokenId: editionDropTokenId,
        to: smartAccount.address,
        quantity: 1n,
      }),
      claimToken({
        contract: tokenDropContract,
        quantity: "0.1",
        to: smartAccount.address,
      }),
    ];
    sendBatch(transactions, {
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
      onSuccess: (result) => {
        refetchNFTs();
        refetchTokens();
        alert("Success! Tx hash: " + result.transactionHash);
      },
    });
  };

  return (
    <div className="flex flex-col items-center px-6 py-10 max-w-4xl mx-auto bg-[#f5f0e1] border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h1 className="text-center text-2xl md:text-6xl font-bold tracking-tighter mb-10 font-mono text-black">
        Batching Transactions
      </h1>

      <div className="mb-6">
	  <ConnectButton
				client={client}
				accountAbstraction={accountAbstraction}
				theme={lightTheme()}
				connectModal={{ size: "compact" }}
		/>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        {smartAccount ? (
          <>
            {nftBalance && tokenBalance && (
              <p className="text-lg font-mono text-center text-black">
                You own{" "}
                <strong className="text-red-600">{nftBalance.toString()}</strong> NFTs
                and{" "}
                <strong className="text-blue-600">
                  {tokenBalance.displayValue} {tokenBalance.symbol}
                </strong>{" "}
                Tokens
              </p>
            )}
            <button
              onClick={handleClick}
              disabled={isPending}
              className="w-full max-w-sm py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold font-mono border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {isPending ? "Claiming..." : "🎉 Claim NFTs & Tokens at once!"}
            </button>
          </>
        ) : (
          <p className="text-black text-center font-mono">Login to get started</p>
        )}
      </div>

      <Link
        href="/"
        className="mt-10 text-sm text-black hover:underline hover:text-yellow-700 font-mono"
      >
        ← Back to menu
      </Link>
    </div>
  );
};

export default BatchingHome;
