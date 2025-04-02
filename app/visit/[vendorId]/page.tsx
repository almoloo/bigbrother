"use client";

import { createClientUPProvider, UPClientProvider } from "@lukso/up-provider";
import { use, useEffect, useLayoutEffect, useState } from "react";

export default function VisitPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = use(params);
  //   const provider = createClientUPProvider();
  const [accounts, setAccounts] = useState<Array<`0x${string}`>>([]);
  const [contextAccounts, setContextAccounts] = useState<Array<`0x${string}`>>(
    []
  );

  let provider: UPClientProvider | null = null;

  useLayoutEffect(() => {
    provider = createClientUPProvider();
  });

  useEffect(() => {
    async function init() {
      try {
        const _accounts = provider?.accounts as Array<`0x${string}`>;
        setAccounts(_accounts);

        const _contextAccounts =
          provider?.contextAccounts as Array<`0x${string}`>;
        setContextAccounts(_contextAccounts);
      } catch (err) {
        console.error("Failed to init provider: ", err);
      }
    }

    if (provider) {
      init();
    }
  }, [accounts[0], contextAccounts[0]]);

  return (
    <div>
      VisitPage - {vendorId} - [account: {JSON.stringify(accounts)}] - [context:{" "}
      {JSON.stringify(contextAccounts)}]
    </div>
  );
}
