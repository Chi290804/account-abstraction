"use client";
import { useState, useCallback } from "react";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import {
  addSessionKey,
  getAllActiveSigners,
  removeSessionKey,
} from "thirdweb/extensions/erc4337";
import { getContract } from "thirdweb";
import { generateAccount } from "thirdweb/wallets";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
  accountAbstraction,
  chain,
  client,
  editionDropAddress,
} from "../constants";
import Link from "next/link";
import type { Account } from "thirdweb/wallets"
const AddSigner = () => {
  const smartAccount = useActiveAccount();
  const status = useActiveWalletConnectionStatus();
  const [generating, setGenerating] = useState(false);
  const [walletToAdd, setWalletToAdd] = useState("");
  const [sessionKeys, setSessionKeys] = useState<Account[]>(
	[],
  );
  const { data: activeSigners, refetch } = useReadContract(
    getAllActiveSigners,
    {
      contract: getContract({
        address: smartAccount?.address!,
        chain,
        client,
      }),
      queryOptions: {
        enabled: !!smartAccount?.address,
      },
    },
  );
  const { mutate: sendTx } = useSendTransaction();

  // Auto-generate session key and add
  const handleGenerateSessionKey = useCallback(async () => {
    try {
      setGenerating(true);
      const subAccount = await generateAccount({ client });
      // Add session key with scope only for editionDropAddress
    if (!smartAccount) {
      throw new Error("No smart account");
    }
    const transaction = addSessionKey({
      contract: getContract({
        address: smartAccount?.address ?? "",
        chain,
        client,
      }),
      account: smartAccount!,
      sessionKeyAddress: subAccount.address,
      permissions: {
        approvedTargets: [editionDropAddress],
      },
    });
      await sendTx(transaction);
      setSessionKeys((keys) => [...keys, subAccount]);
      await refetch();
      alert(
        "Tạo session key thành công: " + subAccount.address,
      );
    } finally {
      setGenerating(false);
    }
  }, [
    client,
    smartAccount,
    editionDropAddress,
    sendTx,
    refetch,
  ]);

  // Mint NFT for this session key
  const mintNFT = useCallback(
    async (targetAddress: string) => {
      const contract = getContract({
        address: editionDropAddress,
        chain,
        client,
      });
      // Ví dụ claim 1 NFT tokenId = 0 về session key address
      const transaction = claimTo({
        contract,
        to: targetAddress,
        tokenId: 0n,
        quantity: 1n,
      });
      await sendTx(transaction);
      alert("Mint NFT thành công cho: " + targetAddress);
    },
    [editionDropAddress, chain, client, sendTx],
  );

  // Revoke session key
  const revokeSessionKey = useCallback(
    async (address: string) => {
      if (!smartAccount) {
        throw new Error("No smart account");
      }
      const transaction = removeSessionKey({
        contract: getContract({
      address: smartAccount.address,
      chain,
      client,
        }),
        account: smartAccount,
        sessionKeyAddress: address,
      });
      await sendTx(transaction);
      alert("Session key đã revoke: " + address);
      await refetch();
    },
    [smartAccount, chain, client, sendTx, refetch],
  );

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-12 text-zinc-100">
        Session Keys
      </h1>
      <ConnectButton
        client={client}
        accountAbstraction={accountAbstraction}
        connectModal={{ size: "compact" }}
      />
      {status === "connected" ? (
        <div className="flex flex-col mt-8 w-full max-w-2xl">
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white font-bold w-full mb-6"
            disabled={generating}
            onClick={handleGenerateSessionKey}
          >
            {generating
              ? "Đang sinh session key..."
              : "Tạo session key tự động"}
          </button>
          <div className="flex mt-4 mb-4">
            <input
              className="rounded-lg text-black p-4 w-2/3 mr-4"
              type="text"
              placeholder="Address or ENS"
              onChange={(e) =>
                setWalletToAdd(e.target.value)
              }
              value={walletToAdd}
            />
            <TransactionButton
              transaction={async () => {
                if (!walletToAdd)
                  throw new Error(
                    "Please enter an address",
                  );
                if (!smartAccount)
                  throw new Error("No smart account");
                return addSessionKey({
                  contract: getContract({
                    address: smartAccount.address,
                    chain,
                    client,
                  }),
                  account: smartAccount,
                  sessionKeyAddress: walletToAdd,
                  permissions: {
                    approvedTargets: [editionDropAddress],
                  },
                });
              }}
            >
              Add Session Key
            </TransactionButton>
          </div>
          <h3 className="text-lg font-bold mt-8">
            Active session keys
          </h3>
          <ul>
            {(activeSigners?.length
              ? activeSigners
              : []
            ).map((a) => (
              <li
                key={a.signer}
                className="text-sm flex items-center gap-2 w-full justify-between border-b py-2"
              >
                <span className="text-gray-400">
                  {a.signer}
                </span>
                <button
                  className="px-2 py-1 bg-red-400 text-white rounded text-xs"
                  onClick={() => revokeSessionKey(a.signer)}
                >
                  Revoke
                </button>
                <button
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                  onClick={() => mintNFT(a.signer)}
                >
                  Mint NFT cho key này
                </button>
              </li>
            ))}
            {!activeSigners?.length && (
              <li className="text-sm text-gray-400">
                No active session keys added
              </li>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-gray-400 mt-8">
          Login to add session keys
        </p>
      )}
      <Link href="/" className="text-sm text-gray-400 mt-8">
        Back to menu
      </Link>
    </div>
  );
};

export default AddSigner;
