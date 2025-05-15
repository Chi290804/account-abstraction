
"use client";
import {
  balanceOf,
  claimTo,
  getNFT,
} from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  lightTheme,
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import {
  accountAbstraction,
  client,
  editionDropContract,
} from "../constants";
import Link from "next/link";
import React from "react";

const tokenIds = [3n, 4n, 5n, 6n, 7n, 8n, 9n];

const GaslessHome: React.FC = () => {
  const smartAccount = useActiveAccount();

  return (
    <div className="flex flex-col items-center px-6 py-10 max-w-4xl mx-auto bg-[#f5f0e1] border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h1 className="text-center text-2xl md:text-6xl font-bold tracking-tighter mb-10 font-mono text-black">
        Claim Your NFTs
      </h1>

      <ConnectButton
			  client={client}
			  accountAbstraction={accountAbstraction}
			  theme={lightTheme()}
			  connectModal={{ size: "compact" }}
			/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 w-full">
        {tokenIds.map((tokenId) => (
          <NFTCard
            key={tokenId.toString()}
            tokenId={tokenId}
            smartAccountAddress={smartAccount?.address}
          />
        ))}
      </div>

      <Link
        href="/"
        className="text-sm text-black font-mono mt-12 hover:text-yellow-600 hover:underline"
      >
        ← Back to menu
      </Link>
    </div>
  );
};

const NFTCard: React.FC<{
  tokenId: bigint;
  smartAccountAddress?: string;
}> = ({ tokenId, smartAccountAddress }) => {
  const { data: nft } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId,
  });

  const { data: nftBalance } = useReadContract(balanceOf, {
    contract: editionDropContract,
    owner: smartAccountAddress!,
    tokenId,
    queryOptions: { enabled: !!smartAccountAddress },
  });

  return (
    <div className="bg-[#fffdf7] border-4 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-4 flex flex-col items-center font-mono">
      {nft ? (
        <>
          <MediaRenderer
            client={client}
            src={nft.metadata.image}
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              border: "2px solid black",
            }}
          />
          <h3 className="mt-4 text-xl font-extrabold text-[#222023] text-center">
            {nft.metadata.name}
          </h3>
          <p className="text-sm text-gray-700 text-center mt-1 px-2">
            {nft.metadata.description}
          </p>

          {smartAccountAddress ? (
            <>
              <p className="text-sm mt-3 text-[#f04e45] font-semibold">
                You own: {nftBalance?.toString() || "0"}
              </p>
              <TransactionButton
                className="mt-3 px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black font-bold border-2 border-black rounded shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                transaction={() =>
                  claimTo({
                    contract: editionDropContract,
                    tokenId,
                    to: smartAccountAddress,
                    quantity: 1n,
                  })
                }
                onError={(error) => alert(`Error: ${error.message}`)}
                onTransactionConfirmed={() => alert("🎉 Claimed successfully!")}
              >
                ✨ Claim
              </TransactionButton>
            </>
          ) : (
            <p className="text-xs mt-4 text-gray-500 text-center">
              Connect wallet to claim.
            </p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GaslessHome;
