import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import walletIcon from "@public/bitcoin.svg";
import { accountAbstraction, client } from "./constants";
import Link from "next/link";
import { lightTheme } from "thirdweb/react";

export default function Home() {
  return (
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Connect Button */}
        <ConnectButton
                client={client}
                accountAbstraction={accountAbstraction}
                theme={lightTheme()}
                connectModal={{ size: "compact" }}
          />
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mt-12 mb-4 border-4 border-black px-6 py-3 shadow-lg bg-white">
          Welcome to the Demo!
        </h1>
        <p className="text-center text-lg mb-10 max-w-xl">
          <strong>Các chức năng chính của ứng dụng này bao gồm:</strong>
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard
            title="Sponsored Transactions"
            description="Cho phép người dùng thực hiện giao dịch mà không cần trả phí gas."
            href="/gasless"
          />
          <FeatureCard
            title="Session Keys"
            description="Tạo các địa chỉ có các quyền hạn cụ thể để thực hiện các giao dịch bằng tài khoản của bạn."
            href="/session-keys"
          />
          <FeatureCard
            title="Batching Transactions"
            description="Gộp nhiều giao dịch thành một để tiết kiệm phí gas."
            href="/batching"
          />
        </div>
      </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ title, description, href }: FeatureCardProps) {
  return (
    <div className="relative w-80 h-60 border-4 border-black p-6 bg-[#fffdf4] shadow-[4px_4px_0_0_black] hover:shadow-[6px_6px_0_0_black] transition-all duration-200 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-extrabold mb-2">{title}</h2>
        <p className="text-md">{description}</p>
      </div>
      <Link
        href={href}
        className="mt-4 text-center px-4 py-2 border-2 border-black bg-black text-white font-bold hover:bg-white hover:text-black transition-colors"
      >
        Explore
      </Link>
    </div>
  );
}