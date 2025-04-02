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

// let provider: UPClientProvider | null = null;

// FETCH IP ADDRESS
const fetchIpInfo = async () => {
  try {
    const ipReq = await fetch("https://ipinfo.io/json");
    if (!ipReq.ok) {
      throw new Error("Failed!");
    }
    const ipJSON = await ipReq.json();
    console.log("ip info: ", ipJSON);
    return {
      city: ipJSON.city,
      country: ipJSON.country,
      region: ipJSON.region,
      lat: parseFloat(ipJSON.split(",")[0]),
      lng: parseFloat(ipJSON.split(",")[1]),
    };
  } catch (error) {
    console.error("Error while fetching ip info: ", error);
    return null;
  }
};

export default function VisitPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = use(params);
  //   const [accounts, setAccounts] = useState<Array<`0x${string}`>>([]);
  //   const [contextAccounts, setContextAccounts] = useState<Array<`0x${string}`>>(
  //     []
  //   );
  //   const [profileConnected, setProfileConnected] = useState(false);
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);

  //   const updateConnected = useCallback(
  //     (
  //       _accounts: Array<`0x${string}`>,
  //       _contextAccounts: Array<`0x${string}`>
  //     ) => {
  //       setProfileConnected(_accounts.length > 0 && _contextAccounts.length > 0);
  //     },
  //     []
  //   );

  //   useEffect(() => {
  //     provider = createClientUPProvider();
  //     async function init() {
  //       try {
  //         const ipReq = await fetch("https://ipinfo.io/json");
  //         ipReq.json().then((json) => {
  //           setIpInfo({
  //             city: json.city,
  //             country: json.country,
  //             region: json.region,
  //             lat: parseFloat(json.split(",")[0]),
  //             lng: parseFloat(json.split(",")[1]),
  //           });
  //         });

  //         if (provider) {
  //           const _accounts = provider.accounts as Array<`0x${string}`>;
  //           setAccounts(_accounts);

  //           const _contextAccounts =
  //             provider.contextAccounts as Array<`0x${string}`>;
  //           updateConnected(_accounts, _contextAccounts);
  //         }
  //       } catch (err) {
  //         console.error("Failed to init provider: ", err);
  //       }
  //     }

  // const accountsChanged = (_accounts: Array<`0x${string}`>) => {
  //   setAccounts(_accounts);
  //   updateConnected(_accounts, contextAccounts);
  // };

  // const contextAccountsChanged = (_accounts: Array<`0x${string}`>) => {
  //   setContextAccounts(_accounts);
  //   updateConnected(accounts, _accounts);
  // };

  // init();

  // if (provider) {
  //   provider.on("accountsChanged", accountsChanged);
  //   provider.on("contextAccountsChanged", contextAccountsChanged);
  // }

  // return () => {
  //   if (provider) {
  //     provider.removeListener("accountsChanged", accountsChanged);
  //     provider.removeListener(
  //       "contextAccountsChanged",
  //       contextAccountsChanged
  //     );
  //   }
  // };
  //   }, [accounts[0], contextAccounts[0], updateConnected]);

  useEffect(() => {
    const init = async () => {
      setIpInfo(await fetchIpInfo());
    };
    init();
  }, []);

  return (
    <div>
      VisitPage - {vendorId}
      {/* <div>
         [account: {accounts[0]}] - [context:{" "}
        </div> */}
      {/* {contextAccounts[0]}] */}
      <div>
        <code>{ipInfo?.country}</code>
      </div>
    </div>
  );
}
