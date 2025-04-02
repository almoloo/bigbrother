"use client";

import { createClientUPProvider, UPClientProvider } from "@lukso/up-provider";
import { use, useCallback, useEffect, useState } from "react";

interface IPInfo {
  country: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
}

let provider: UPClientProvider | null = null;

export default function VisitPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = use(params);
  const [accounts, setAccounts] = useState<Array<`0x${string}`>>([]);
  const [contextAccounts, setContextAccounts] = useState<Array<`0x${string}`>>(
    []
  );
  const [profileConnected, setProfileConnected] = useState(false);
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);

  const updateConnected = useCallback(
    (
      _accounts: Array<`0x${string}`>,
      _contextAccounts: Array<`0x${string}`>
    ) => {
      setProfileConnected(_accounts.length > 0 && _contextAccounts.length > 0);
    },
    []
  );

  useEffect(() => {
    provider = createClientUPProvider();
    async function init() {
      try {
        const ipReq = await fetch("https://ipinfo.io/json");
        const ipReqJSON = await ipReq.json();
        setIpInfo({
          city: ipReqJSON.city,
          country: ipReqJSON.country,
          region: ipReqJSON.region,
          lat: parseFloat(ipReqJSON.split(",")[0]),
          lng: parseFloat(ipReqJSON.split(",")[1]),
        });

        if (provider) {
          const _accounts = provider.accounts as Array<`0x${string}`>;
          setAccounts(_accounts);

          const _contextAccounts =
            provider.contextAccounts as Array<`0x${string}`>;
          updateConnected(_accounts, _contextAccounts);
        }
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

    init();

    if (provider) {
      provider.on("accountsChanged", accountsChanged);
      provider.on("contextAccountsChanged", contextAccountsChanged);
    }

    return () => {
      if (provider) {
        provider.removeListener("accountsChanged", accountsChanged);
        provider.removeListener(
          "contextAccountsChanged",
          contextAccountsChanged
        );
      }
    };
  }, [accounts[0], contextAccounts[0], updateConnected]);

  return (
    <div>
      VisitPage - {vendorId} - [account: {accounts[0]}] - [context:{" "}
      {contextAccounts[0]}]
      <div>
        <code>{JSON.stringify(ipInfo)}</code>
      </div>
    </div>
  );
}
