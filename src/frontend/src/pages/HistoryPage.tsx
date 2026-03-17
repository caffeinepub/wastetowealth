import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, Coins, Leaf, Tag, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { WasteType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserHistory } from "../hooks/useQueries";

const wasteEmoji: Record<WasteType, string> = {
  [WasteType.plastic]: "🧴",
  [WasteType.paper]: "📄",
  [WasteType.metal]: "🔩",
  [WasteType.glass]: "🫙",
  [WasteType.organic]: "🌿",
  [WasteType.electronic]: "💻",
};

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const { identity, login } = useInternetIdentity();
  const { data, isLoading } = useUserHistory();

  if (!identity) {
    return (
      <div
        className="p-6 flex flex-col items-center justify-center min-h-96 text-center"
        data-ocid="history.empty_state"
      >
        <Clock className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Sign In to View History
        </h2>
        <p className="text-muted-foreground mb-6">
          Your transaction history is private and secure.
        </p>
        <button
          type="button"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90"
          onClick={login}
          data-ocid="history.primary_button"
        >
          Sign In
        </button>
      </div>
    );
  }

  const submissions = data?.submissions ?? [];
  const redemptions = data?.redemptions ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          Transaction History
        </h1>
        <p className="text-muted-foreground mt-1">
          All your waste submissions and point redemptions.
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-xs mb-1">
              Total Submissions
            </div>
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? "—" : submissions.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-xs mb-1">
              Total Redemptions
            </div>
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? "—" : redemptions.length}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="text-muted-foreground text-xs mb-1">
              Points Redeemed
            </div>
            <div className="font-display text-2xl font-bold text-primary">
              {isLoading
                ? "—"
                : redemptions
                    .reduce((a, r) => a + Number(r.pointsRedeemed), 0)
                    .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="submissions">
        <TabsList data-ocid="history.tab">
          <TabsTrigger value="submissions" data-ocid="history.tab">
            <Leaf className="w-4 h-4 mr-2" /> Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="redemptions" data-ocid="history.tab">
            <Coins className="w-4 h-4 mr-2" /> Redemptions ({redemptions.length}
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-4">
          {isLoading ? (
            <div className="space-y-3" data-ocid="history.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="history.empty_state"
            >
              <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No submissions yet</p>
              <p className="text-sm">Start submitting waste to earn points!</p>
            </div>
          ) : (
            <Card data-ocid="history.table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waste Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>AI Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable submission list
                    <TableRow key={i} data-ocid="history.row">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {wasteEmoji[sub.wasteType]}
                          </span>
                          <span className="font-medium capitalize">
                            {sub.wasteType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{sub.quantityKg.toString()} kg</TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          +{sub.pointsAwarded.toString()} pts
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sub.aiVerified ? (
                          <div className="flex items-center gap-1 text-accent text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-destructive text-sm">
                            <XCircle className="w-4 h-4" />
                            Pending
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(sub.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="redemptions" className="mt-4">
          {isLoading ? (
            <div className="space-y-3" data-ocid="history.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : redemptions.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="history.empty_state"
            >
              <Coins className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No redemptions yet</p>
              <p className="text-sm">
                Earn points and redeem them for cash or coupons!
              </p>
            </div>
          ) : (
            <Card data-ocid="history.table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Points Used</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((red, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable redemption list
                    <TableRow key={i} data-ocid="history.row">
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {red.redemptionType.__kind__ === "money" ? (
                            <>
                              <Tag className="w-3 h-3" /> Cash Out
                            </>
                          ) : (
                            <>
                              <Tag className="w-3 h-3" /> Coupon
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {red.pointsRedeemed.toString()} pts
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {red.redemptionType.__kind__ === "money"
                          ? `$${(Number(red.pointsRedeemed) * 0.01).toFixed(2)}`
                          : red.redemptionType.coupon}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(red.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
