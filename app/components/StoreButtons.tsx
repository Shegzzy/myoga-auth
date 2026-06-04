interface StoreButtonsProps {
  userType: string;
  label?: string;
}

const links = {
  user: {
    ios: "https://apps.apple.com/ng/app/myoga-users/id6472815917",
    android:
      "https://play.google.com/store/apps/details?id=com.myoga.myoga_user",
  },
  rider: {
    ios: "https://apps.apple.com/us/app/myoga-riders/id6473027113",
    android:
      "https://play.google.com/store/apps/details?id=com.myoga.myogarider",
  },
};

export default function StoreButtons({
  userType,
  label = "Download the app",
}: StoreButtonsProps) {
  const storeLinks = userType === "rider" ? links.rider : links.user;

  return (
    <div>
      <hr className="border-gray-100 my-5" />
      <p className="text-xs font-semibold text-gray-700 mb-3">{label}</p>
      <div className="flex gap-3">
        <a
          href={storeLinks.ios}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#00002e">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.42.07 2.41.74 3.23.8 1.23-.24 2.4-.93 3.72-.84 1.58.13 2.78.72 3.56 1.83-3.26 1.95-2.56 5.98.49 7.15-.57 1.54-1.32 3.06-3 3.92zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <div>
            <span className="block text-[10px] text-gray-400 font-normal">
              Download on
            </span>
            <span className="text-xs font-semibold text-[#00002e]">
              App Store
            </span>
          </div>
        </a>
        <a
          href={storeLinks.android}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#00002e">
            <path d="M3.18 23.76a2 2 0 001.83-.16l10.79-6.22-2.56-2.56-10.06 8.94zM20.54 10.3L17.1 8.35l-2.85 2.84 2.85 2.85 3.46-1.97a1.53 1.53 0 000-2.77zM3.18.24L13.24 9.17l-2.56 2.57L.89.71A2 2 0 013.18.24zM6.41 12L3.18 15.14V8.86L6.41 12z" />
          </svg>
          <div>
            <span className="block text-[10px] text-gray-400 font-normal">
              Get it on
            </span>
            <span className="text-xs font-semibold text-[#00002e]">
              Google Play
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
