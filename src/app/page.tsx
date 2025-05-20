import Navbar from "./components/navbar";
import WelcomePage from "./components/WelcomePage";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="px-4 md:px-10 lg:px-20 xl:px-40 2xl:px-60">
      <Navbar />
      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        }
      >
        <WelcomePage />
      </Suspense>
    </div>
  );
}
