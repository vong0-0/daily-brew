import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await getCurrentSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-bg-base text-text-primary">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden flex-col justify-between border-b border-border bg-gradient-to-br from-bg-surface to-bg-base px-6 py-10 lg:flex lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-widest text-text-secondary">Daily Brew</p>
            <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-text-primary lg:text-5xl">
              Warehouse console for coffee inventory.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-text-secondary lg:text-base">
              Track stock in, stock out, low-stock alerts, and admin controls from one dense, fast interface.
            </p>
          </div>

        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
