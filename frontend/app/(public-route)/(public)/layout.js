import { GetStartTopBar } from "@/components/getStart-top-bar";
export default function Layout({ children }) {
  return (
    <div className="relative bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 text-white">
      <GetStartTopBar />
      {children}
    </div>
  );
}
