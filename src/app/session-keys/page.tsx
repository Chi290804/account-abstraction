"use client";
import { useState, useCallback } from "react";
import {
  ConnectButton,
  lightTheme,
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import {
  addSessionKey,
  getAllActiveSigners,
  removeSessionKey,
} from "thirdweb/extensions/erc4337";
import { getContract } from "thirdweb";
import { Secp256k1 } from "ox";
import { privateKeyToAccount } from "thirdweb/wallets";
import { claimTo } from "thirdweb/extensions/erc1155";
import Link from "next/link";

import {
  client,
  accountAbstraction,
  chain,
  editionDropAddress,
} from "../constants";

// ---- MAIN COMPONENT ----
const AddSigner = () => {
  const smartAccount = useActiveAccount();
  const [generating, setGenerating] = useState(false);
  const [exportedSession, setExportedSession] = useState<{
    privateKey: string;
    address: string;
  } | null>(null);
  const [walletToAdd, setWalletToAdd] = useState("");
  const { data: activeSigners, refetch } = useReadContract(
    getAllActiveSigners,
    {
      contract: getContract({
        address: smartAccount?.address!,
        chain,
        client,
      }),
      queryOptions: { enabled: !!smartAccount?.address },
    },
  );
  const { mutateAsync: sendTx } = useSendTransaction();

  // 1. Sinh privateKey & EOA rồi addSessionKey
  const handleGenerateSessionKey = useCallback(async () => {
    try {
      setGenerating(true);
      // 1. Sinh privateKey (secp256k1) và tạo account
      const privateKey = Secp256k1.randomPrivateKey();
      const subAccount = privateKeyToAccount({
        client,
        privateKey,
      });
      setExportedSession({
        privateKey,
        address: subAccount.address,
      });

      if (!smartAccount)
        throw new Error("No smart account");
      const contract = getContract({
        address: smartAccount.address,
        chain,
        client,
      });
      // 2. Thêm session key (address)
      const transaction = addSessionKey({
        contract,
        account: smartAccount,
        sessionKeyAddress: subAccount.address,
        permissions: {
          approvedTargets: [editionDropAddress],
          // ...tuỳ chỉnh các quyền khác
        },
      });
      await sendTx(transaction);
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
    chain,
    editionDropAddress,
    sendTx,
    refetch,
  ]);

  // 2. Mint NFT về một session key address
  const mintNFT = useCallback(
    async (targetAddress: string) => {
      const contract = getContract({
        address: editionDropAddress,
        chain,
        client,
      });
      const transaction = claimTo({
        contract,
        to: targetAddress,
        tokenId: 0n, // sửa tokenId nếu muốn
        quantity: 1n,
      });
      await sendTx(transaction);
      alert("Mint NFT thành công cho: " + targetAddress);
    },
    [editionDropAddress, chain, client, sendTx],
  );

  // 3. Revoke
  const revokeSessionKey = useCallback(
    async (address: string) => {
      if (!smartAccount)
        throw new Error("No smart account");
      const contract = getContract({
        address: smartAccount.address,
        chain,
        client,
      });
      const transaction = removeSessionKey({
        contract,
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
    <div className="flex flex-col items-center px-6 py-10 max-w-4xl mx-auto bg-[#f5f0e1] border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h1 className="text-center text-2xl md:text-6xl font-bold tracking-tighter mb-10 font-mono text-black">
        Session Keys
      </h1>
      <ConnectButton
        client={client}
        accountAbstraction={accountAbstraction}
        chain={chain}
        theme={lightTheme()}
        connectModal={{ size: "compact" }}
      />

      <div className="mt-6 w-full max-w-xl">
	  	<button
			className="mx-auto px-6 py-3 rounded border-2 border-black bg-[#222023] text-white font-bold mb-6 hover:bg-[#ab8804] hover:text-black shadow-md"
			disabled={generating}
			onClick={handleGenerateSessionKey}
			>
			{generating
				? "Đang sinh session key..."
				: "Tạo session key"}
		</button>
        {exportedSession && (
          <div className="mb-4">
            <div className="text-black text-xs mb-2">
              <b>Session Address:</b>{" "}
              <span className="break-all">
                {exportedSession.address}
              </span>
              <br />
              <b>PrivateKey:</b>{" "}
              <span className="break-all">
                {exportedSession.privateKey}
              </span>
            </div>
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 text-xs"
              onClick={() => {
                navigator.clipboard.writeText(
                  exportedSession.privateKey,
                );
                alert("Đã copy private key!");
                setExportedSession(null); // Bật dòng này nếu muốn tự động ẩn key sau khi export
              }}
            >
              Export Session Key PrivateKey
            </button>
          </div>
        )}
        <h3 className="text-xl font-bold mt-8 mb-4 border-b-2 border-black pb-2">
          Active Session Keys
        </h3>
        <ul className="bg-[#fff9f0] border-2 border-black rounded p-4">
          {(activeSigners?.length ? activeSigners : []).map(
            (a) => (
              <li
                key={a.signer}
                className="text-sm flex items-center justify-between py-2 border-b border-dotted border-black"
              >
                <span className="text-black break-all mr-2">
                  {a.signer}
                </span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded border-2 border-black"
                    onClick={() =>
                      revokeSessionKey(a.signer)
                    }
                  >
                    Revoke
                  </button>
                  <button
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded border-2 border-black"
                    onClick={() => mintNFT(a.signer)}
                  >
                    Mint NFT
                  </button>
                </div>
              </li>
            ),
          )}
          {!activeSigners?.length && (
            <li className="text-sm text-gray-500 italic">
              No active session keys added
            </li>
          )}
        </ul>
      </div>
      <Link
        href="/"
        className="mt-10 text-sm underline text-black hover:text-[#ab8804] transition"
      >
        Back to menu
      </Link>
    </div>
  );
};

export default AddSigner;
