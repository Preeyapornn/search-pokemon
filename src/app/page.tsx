import client from "./lib/apollo-client";
import { gql } from "@apollo/client";
import Navbar from "./components/navbar";
import WelcomePage from "./pokemon/page";

export default async function Home() {
  return (
    <div className="px-4 md:px-10 lg:px-20 xl:px-40 2xl:px-60">
      <Navbar />
      <WelcomePage />
    </div>
  );
}
