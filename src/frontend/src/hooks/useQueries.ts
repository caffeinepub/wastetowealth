import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RedemptionType, WasteType } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useUserPoints() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<bigint>({
    queryKey: ["userPoints", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return BigInt(0);
      return actor.getUserPoints(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function usePlatformStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["platformStats"],
    queryFn: async () => {
      if (!actor)
        return { totalWasteKg: BigInt(0), totalPointsAwarded: BigInt(0) };
      return actor.getPlatformStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["userHistory", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return { submissions: [], redemptions: [] };
      return actor.getUserHistory(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSubmitWaste() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      wasteType,
      quantityKg,
    }: { wasteType: WasteType; quantityKg: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitWaste(wasteType, quantityKg);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPoints"] });
      queryClient.invalidateQueries({ queryKey: ["userHistory"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
    },
  });
}

export function useRedeemPoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      points,
      redemptionType,
    }: { points: bigint; redemptionType: RedemptionType }) => {
      if (!actor) throw new Error("Not connected");
      return actor.redeemPoints(points, redemptionType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPoints"] });
      queryClient.invalidateQueries({ queryKey: ["userHistory"] });
    },
  });
}
