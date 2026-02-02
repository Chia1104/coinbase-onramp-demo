import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Hello "/"!</h1>
      </section>
      <section className="flex flex-col items-center justify-center">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"></div>
        <Button
          onClick={() => {
            window.location.href = "coinbase-onramp-demo://onramp-callback";
          }}>
          Open APP
        </Button>
      </section>
    </main>
  );
}
