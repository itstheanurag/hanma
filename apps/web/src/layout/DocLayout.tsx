import { Outlet } from "react-router-dom";

export default function DocsLayout() {
  return (
    <main className="flex-1 w-full">
      <Outlet />
    </main>
  );
}
