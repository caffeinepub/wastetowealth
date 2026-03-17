import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  DollarSign,
  Loader2,
  Tag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRedeemPoints, useUserPoints } from "../hooks/useQueries";

const POINTS_TO_USD = 0.01;

export default function RedeemPage() {
  const { identity, login } = useInternetIdentity();
  const { data: points = BigInt(0) } = useUserPoints();
  const redeemMutation = useRedeemPoints();
  const [moneyAmount, setMoneyAmount] = useState("");
  const [couponAmount, setCouponAmount] = useState("");
  const [redeemSuccess, setRedeemSuccess] = useState<{
    type: "money" | "coupon";
    value: string;
  } | null>(null);

  const pointsNum = Number(points);
  const moneyPoints = moneyAmount ? Number.parseInt(moneyAmount) : 0;
  const couponPoints = couponAmount ? Number.parseInt(couponAmount) : 0;

  const handleRedeemMoney = async () => {
    if (!identity) {
      login();
      return;
    }
    if (moneyPoints <= 0 || moneyPoints > pointsNum) {
      toast.error("Invalid amount. Check your points balance.");
      return;
    }
    try {
      await redeemMutation.mutateAsync({
        points: BigInt(moneyPoints),
        redemptionType: { __kind__: "money", money: null },
      });
      const usdValue = (moneyPoints * POINTS_TO_USD).toFixed(2);
      setRedeemSuccess({ type: "money", value: `$${usdValue}` });
      toast.success(
        `Successfully redeemed ${moneyPoints} points for $${usdValue}!`,
      );
      setMoneyAmount("");
    } catch {
      toast.error("Redemption failed. Please try again.");
    }
  };

  const handleRedeemCoupon = async () => {
    if (!identity) {
      login();
      return;
    }
    if (couponPoints <= 0 || couponPoints > pointsNum) {
      toast.error("Invalid amount. Check your points balance.");
      return;
    }
    const couponCode = `WTW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    try {
      await redeemMutation.mutateAsync({
        points: BigInt(couponPoints),
        redemptionType: { __kind__: "coupon", coupon: couponCode },
      });
      setRedeemSuccess({ type: "coupon", value: couponCode });
      toast.success(`Coupon code generated: ${couponCode}`);
      setCouponAmount("");
    } catch {
      toast.error("Redemption failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          Redeem Points
        </h1>
        <p className="text-muted-foreground mt-1">
          Convert your points into real money or discount coupons.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-primary text-primary-foreground shadow-green-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-1 opacity-80">
              <Coins className="w-4 h-4" />
              <span className="text-sm">Available Balance</span>
            </div>
            <div className="font-display text-5xl font-bold">
              {pointsNum.toLocaleString()}
            </div>
            <div className="text-primary-foreground/70 text-sm mt-1">
              points ≈ ${(pointsNum * POINTS_TO_USD).toFixed(2)} USD
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {redeemSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            data-ocid="redeem.success_state"
          >
            <Card className="border-accent/50 bg-accent/5">
              <CardContent className="p-6 flex items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-accent shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {redeemSuccess.type === "money"
                      ? "Cash Out Successful!"
                      : "Coupon Generated!"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {redeemSuccess.type === "money"
                      ? `${redeemSuccess.value} has been credited to your account.`
                      : "Your coupon code: "}
                    {redeemSuccess.type === "coupon" && (
                      <code className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {redeemSuccess.value}
                      </code>
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRedeemSuccess(null)}
                  data-ocid="redeem.close_button"
                >
                  ×
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="money">
        <TabsList className="w-full" data-ocid="redeem.tab">
          <TabsTrigger
            value="money"
            className="flex-1 gap-2"
            data-ocid="redeem.tab"
          >
            <DollarSign className="w-4 h-4" /> Cash Out
          </TabsTrigger>
          <TabsTrigger
            value="coupon"
            className="flex-1 gap-2"
            data-ocid="redeem.tab"
          >
            <Tag className="w-4 h-4" /> Get Coupon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="money" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Redeem for Money
              </CardTitle>
              <CardDescription>
                Convert points to USD. Rate: 100 points = $1.00
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[100, 500, 1000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setMoneyAmount(String(amt))}
                    disabled={amt > pointsNum}
                    data-ocid="redeem.toggle"
                    className={`p-3 rounded-lg border text-center transition-all ${
                      moneyAmount === String(amt)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <div className="font-bold text-sm">{amt} pts</div>
                    <div className="text-xs text-muted-foreground">
                      ${(amt * POINTS_TO_USD).toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <Label
                  htmlFor="money-amount"
                  className="text-sm text-muted-foreground"
                >
                  Custom amount (points)
                </Label>
                <Input
                  id="money-amount"
                  type="number"
                  placeholder="Enter points to redeem"
                  value={moneyAmount}
                  onChange={(e) => setMoneyAmount(e.target.value)}
                  min="1"
                  max={pointsNum}
                  className="mt-1"
                  data-ocid="redeem.input"
                />
              </div>
              {moneyAmount && moneyPoints > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="text-sm text-muted-foreground">
                    {moneyPoints} points =
                  </span>
                  <span className="font-display font-bold text-primary text-lg">
                    ${(moneyPoints * POINTS_TO_USD).toFixed(2)}
                  </span>
                </div>
              )}
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                onClick={handleRedeemMoney}
                disabled={
                  redeemMutation.isPending ||
                  !moneyAmount ||
                  moneyPoints <= 0 ||
                  moneyPoints > pointsNum
                }
                data-ocid="redeem.submit_button"
              >
                {redeemMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    Cash Out <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupon" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Get a Coupon
              </CardTitle>
              <CardDescription>
                Exchange points for discount coupons at partner stores.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[50, 200, 500].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setCouponAmount(String(amt))}
                    disabled={amt > pointsNum}
                    data-ocid="redeem.toggle"
                    className={`p-3 rounded-lg border text-center transition-all ${
                      couponAmount === String(amt)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <div className="font-bold text-sm">{amt} pts</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(amt / 10)}% off
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <Label
                  htmlFor="coupon-amount"
                  className="text-sm text-muted-foreground"
                >
                  Custom amount (points)
                </Label>
                <Input
                  id="coupon-amount"
                  type="number"
                  placeholder="Enter points to convert"
                  value={couponAmount}
                  onChange={(e) => setCouponAmount(e.target.value)}
                  min="1"
                  max={pointsNum}
                  className="mt-1"
                  data-ocid="redeem.input"
                />
              </div>
              {couponAmount && couponPoints > 0 && (
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-1">
                  <div className="text-sm text-muted-foreground">
                    You&apos;ll receive a coupon worth:
                  </div>
                  <div className="font-display font-bold text-accent text-lg">
                    {Math.round(couponPoints / 10)}% discount
                  </div>
                </div>
              )}
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                onClick={handleRedeemCoupon}
                disabled={
                  redeemMutation.isPending ||
                  !couponAmount ||
                  couponPoints <= 0 ||
                  couponPoints > pointsNum
                }
                data-ocid="redeem.submit_button"
              >
                {redeemMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    Generate Coupon <Tag className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm text-foreground mb-2">
            Conversion Rates
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                Cash
              </Badge>
              100 pts = $1.00 USD
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                Coupon
              </Badge>
              10 pts = 1% discount
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
