import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Leaf, Loader2, Scale } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { WasteType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSubmitWaste } from "../hooks/useQueries";

const wasteCategories = [
  {
    type: WasteType.plastic,
    label: "Plastic",
    emoji: "🧴",
    pts: 10,
    color: "bg-blue-100 border-blue-300 text-blue-800",
    desc: "Bottles, bags, packaging",
  },
  {
    type: WasteType.paper,
    label: "Paper",
    emoji: "📄",
    pts: 8,
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    desc: "Newspapers, cardboard",
  },
  {
    type: WasteType.metal,
    label: "Metal",
    emoji: "🔩",
    pts: 20,
    color: "bg-gray-100 border-gray-300 text-gray-800",
    desc: "Cans, scrap metal",
  },
  {
    type: WasteType.glass,
    label: "Glass",
    emoji: "🫙",
    pts: 12,
    color: "bg-teal-100 border-teal-300 text-teal-800",
    desc: "Bottles, jars",
  },
  {
    type: WasteType.organic,
    label: "Organic",
    emoji: "🌿",
    pts: 5,
    color: "bg-green-100 border-green-300 text-green-800",
    desc: "Food waste, compost",
  },
  {
    type: WasteType.electronic,
    label: "Electronic",
    emoji: "💻",
    pts: 50,
    color: "bg-purple-100 border-purple-300 text-purple-800",
    desc: "E-waste, devices",
  },
];

type SubmitState = "idle" | "verifying" | "success" | "error";

export default function WasteSubmitPage() {
  const [selectedType, setSelectedType] = useState<WasteType | null>(null);
  const [quantity, setQuantity] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [progress, setProgress] = useState(0);
  const { identity, login } = useInternetIdentity();
  const submitWaste = useSubmitWaste();

  const selectedCategory = wasteCategories.find((c) => c.type === selectedType);
  const estimatedPoints =
    selectedCategory && quantity
      ? Math.round(selectedCategory.pts * Number.parseFloat(quantity))
      : 0;

  const handleSubmit = async () => {
    if (!identity) {
      login();
      return;
    }
    if (!selectedType || !quantity || Number.parseFloat(quantity) <= 0) {
      toast.error("Please select a waste type and enter a valid quantity.");
      return;
    }

    setSubmitState("verifying");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return p;
        }
        return p + Math.random() * 15;
      });
    }, 400);

    try {
      await submitWaste.mutateAsync({
        wasteType: selectedType,
        quantityKg: BigInt(Math.round(Number.parseFloat(quantity))),
      });
      clearInterval(interval);
      setProgress(100);
      const pts = estimatedPoints;
      setEarnedPoints(pts);
      setSubmitState("success");
      toast.success(`🎉 Verified! You earned ${pts} points!`);
    } catch {
      clearInterval(interval);
      setSubmitState("error");
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleReset = () => {
    setSubmitState("idle");
    setSelectedType(null);
    setQuantity("");
    setProgress(0);
    setEarnedPoints(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          Submit Waste
        </h1>
        <p className="text-muted-foreground mt-1">
          Select your waste type, enter quantity, and earn points after AI
          verification.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitState === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            data-ocid="submit.loading_state"
          >
            <Card className="border-primary/30 shadow-green">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin-slow" />
                  <div
                    className="absolute inset-2 rounded-full border-4 border-t-primary border-transparent animate-spin"
                    style={{ animationDuration: "1s" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    AI is verifying your waste...
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Our AI is analyzing your submission to ensure accuracy and
                    award the correct points.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Verification progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {[
                    "Scanning waste type",
                    "Calculating weight",
                    "Awarding points",
                  ].map((step, i) => (
                    <Badge
                      key={step}
                      variant={progress > i * 33 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {progress > i * 33 ? "✓" : "○"} {step}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {submitState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            data-ocid="submit.success_state"
          >
            <Card className="border-accent/50 shadow-green">
              <CardContent className="p-8 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-accent mx-auto" />
                </motion.div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Waste Verified! 🎉
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Your waste has been verified by AI and points have been
                    awarded.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                  <div className="text-5xl font-display font-bold text-primary">
                    +{earnedPoints}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">
                    points earned
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleReset}
                    className="bg-primary text-primary-foreground"
                    data-ocid="submit.primary_button"
                  >
                    Submit More Waste
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    data-ocid="submit.secondary_button"
                  >
                    <a href="/redeem">Redeem Points</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {submitState === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-ocid="submit.error_state"
          >
            <Card className="border-destructive/30">
              <CardContent className="p-6 flex items-center gap-4">
                <AlertCircle className="w-8 h-8 text-destructive shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Submission Failed
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Something went wrong. Please try again.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  data-ocid="submit.secondary_button"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {submitState === "idle" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block">
                Select Waste Type
              </Label>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                data-ocid="submit.panel"
              >
                {wasteCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat.type}
                    onClick={() => setSelectedType(cat.type)}
                    data-ocid="submit.toggle"
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      selectedType === cat.type
                        ? "border-primary bg-primary/10 shadow-green"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.emoji}</div>
                    <div className="font-semibold text-foreground text-sm">
                      {cat.label}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {cat.desc}
                    </div>
                    <Badge
                      className={`mt-2 text-xs ${cat.color}`}
                      variant="outline"
                    >
                      {cat.pts} pts/kg
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="w-4 h-4" />
                  Enter Quantity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label
                      htmlFor="quantity"
                      className="text-sm text-muted-foreground"
                    >
                      Weight (kg)
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="e.g. 2.5"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1 text-lg h-12"
                      data-ocid="submit.input"
                    />
                  </div>
                  {estimatedPoints > 0 && (
                    <div className="flex-1 p-3 rounded-lg bg-primary/10 border border-primary/20 flex flex-col justify-center">
                      <div className="text-muted-foreground text-xs">
                        Estimated points
                      </div>
                      <div className="font-display font-bold text-primary text-2xl">
                        ~{estimatedPoints}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-green"
                  onClick={handleSubmit}
                  disabled={!selectedType || !quantity || submitWaste.isPending}
                  data-ocid="submit.submit_button"
                >
                  {submitWaste.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : !identity ? (
                    "Sign In to Submit"
                  ) : (
                    <>Submit &amp; Earn Points</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
