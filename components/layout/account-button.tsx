import { auth, signIn, signOut } from "@/lib/auth";

function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  );
}

function AccountDropDown() {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}

export default async function AccountButton() {
  const session = await auth();
  return !session?.user ? <SignInButton /> : <AccountDropDown />;
}
