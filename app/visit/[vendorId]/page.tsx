"use client";

import { createClientUPProvider, UPClientProvider } from "@lukso/up-provider";
import { use, useCallback, useEffect, useLayoutEffect, useState } from "react";

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
  const [profileConnected, setProfileConnected] = useState(false);

  let provider: UPClientProvider | null = null;

  const updateConnected = useCallback(
    (
      _accounts: Array<`0x${string}`>,
      _contextAccounts: Array<`0x${string}`>
    ) => {
      setProfileConnected(_accounts.length > 0 && _contextAccounts.length > 0);
    },
    []
  );

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
        updateConnected(_accounts, _contextAccounts);
      } catch (err) {
        console.error("Failed to init provider: ", err);
      }
    }

    const accountsChanged = (_accounts: Array<`0x${string}`>) => {
      setAccounts(_accounts);
      updateConnected(_accounts, contextAccounts);
    };

    const contextAccountsChanged = (_accounts: Array<`0x${string}`>) => {
      setContextAccounts(_accounts);
      updateConnected(accounts, _accounts);
    };

    if (provider) {
      init();
    } else {
      console.error("THERE IS NO PROVIDER!");
    }

    provider?.on("accountsChanged", accountsChanged);
    provider?.on("contextAccountsChanged", contextAccountsChanged);

    return () => {
      provider?.removeListener("accountsChanged", accountsChanged);
      provider?.removeListener(
        "contextAccountsChanged",
        contextAccountsChanged
      );
    };
  }, [accounts[0], contextAccounts[0], updateConnected]);

  return (
    <div>
      VisitPage - {vendorId} - [account: {JSON.stringify(accounts)}] - [context:{" "}
      {JSON.stringify(contextAccounts)}]
    </div>
  );
}
