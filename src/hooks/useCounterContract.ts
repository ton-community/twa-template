import { useState } from "react";
import Counter from "../contracts/counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

export function useCounterContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse(
        network === CHAIN.MAINNET
          ? "EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH"
          : "EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb"
      ) // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  const { data, isFetching } = useQuery(
    ["counter"],
    async () => {
      if (!counterContract) return null;
      return (await counterContract!.getCounter()).toString();
    },
    { refetchInterval: 3000 }
  );

  return {
    value: isFetching ? null : data,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
