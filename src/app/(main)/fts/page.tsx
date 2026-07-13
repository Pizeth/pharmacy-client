// "use client";
import AdministrativeForm from "@/components/fts/search";
import RootLayout from "../../layout";
import { Authenticated } from "@refinedev/core";

export default function Page() {
  <Authenticated key="FTS">
    return <AdministrativeForm />;
  </Authenticated>;
}
