import Image from "next/image";

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <main className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#00002e] px-8 py-6 flex items-center">
          <Image
            src="https://www.myoga.com.ng/wp-content/uploads/2024/05/MY-OGA-HORIZONTAL-LOGO-PNG2-e1716233062661.png"
            alt="MyOga"
            width={140}
            height={40}
            style={{ objectFit: "contain", height: "36px", width: "auto" }}
            priority
          />
        </div>

        {/* Red accent bar */}
        <div className="h-[3px] bg-[#cc0000]" />

        {/* Content */}
        {children}

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-400">
            © {new Date().getFullYear()} MyOga
          </span>
          <span className="text-xs text-gray-400">·</span>

          <a
            href="https://myoga.com.ng"
            className="text-xs text-[#cc0000] font-medium hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            myoga.com.ng
          </a>
        </div>
      </div>
    </main>
  );
}
