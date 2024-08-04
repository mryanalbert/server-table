import Image from "next/image";
import ServerSideTable from "./components/ServerSideTable";
import { columns } from "./components/TableColumns";
import ServerSideTable2 from "./components/SSRTable";

export default function Home() {
  return (
    <main>
      {/* <ServerSideTable columns={columns} /> */}
      <ServerSideTable2 columns={columns} />
    </main>
  );
}
