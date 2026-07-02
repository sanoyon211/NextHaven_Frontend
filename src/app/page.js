import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24">
      <h1 className="text-5xl font-bold text-primary mb-8 tracking-tight">
        NextHaven Premium Suites
      </h1>
      <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 rounded-md">
        BOOK NOW
      </Button>
    </main>
  );
}
