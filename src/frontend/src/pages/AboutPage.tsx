import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  CheckCircle2,
  Coins,
  Globe,
  Leaf,
  Recycle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { usePlatformStats } from "../hooks/useQueries";

const steps = [
  {
    icon: Recycle,
    title: "Collect Your Waste",
    desc: "Gather your recyclable materials — plastic, paper, metal, glass, organic, or electronic waste.",
    step: "01",
  },
  {
    icon: ShieldCheck,
    title: "AI Verification",
    desc: "Our intelligent AI analyzes your submission, verifying the waste type and quantity for accurate point calculation.",
    step: "02",
  },
  {
    icon: Coins,
    title: "Earn Points",
    desc: "Once verified, you instantly receive points in your account. Higher-value materials earn more points per kilogram.",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Redeem & Profit",
    desc: "Convert your accumulated points into real money or discount coupons from our network of partner stores.",
    step: "04",
  },
];

const wasteRates = [
  { emoji: "💻", type: "Electronic", rate: 50, note: "Highest value" },
  { emoji: "🔩", type: "Metal", rate: 20, note: "Great earner" },
  { emoji: "🫙", type: "Glass", rate: 12, note: "Easy to collect" },
  { emoji: "🧴", type: "Plastic", rate: 10, note: "Most common" },
  { emoji: "📄", type: "Paper", rate: 8, note: "Abundant" },
  { emoji: "🌿", type: "Organic", rate: 5, note: "Compostable" },
];

export default function AboutPage() {
  const { data: stats } = usePlatformStats();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div
        className="relative px-6 py-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.06 148), oklch(0.30 0.10 148))",
        }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url('/assets/generated/waste-hero-bg.dim_1200x600.jpg')`,
            backgroundSize: "cover",
          }}
        />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-sidebar-primary flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-9 h-9 text-sidebar-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold text-sidebar-foreground mb-4">
              Waste to Wealth
            </h1>
            <p className="text-sidebar-foreground/70 text-lg max-w-xl mx-auto">
              A revolutionary platform that rewards you for being
              environmentally responsible. Every kilogram you recycle brings us
              closer to a greener planet.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-12">
        {/* Platform stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card className="bg-primary text-primary-foreground shadow-green">
              <CardContent className="p-5 text-center">
                <Globe className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <div className="font-display text-3xl font-bold">
                  {stats
                    ? Number(stats.totalWasteKg).toLocaleString()
                    : "12,487"}
                </div>
                <div className="text-primary-foreground/70 text-xs mt-1">
                  kg Waste Collected
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/30 shadow-green">
              <CardContent className="p-5 text-center">
                <Coins className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-display text-3xl font-bold text-foreground">
                  {stats
                    ? Number(stats.totalPointsAwarded).toLocaleString()
                    : "248,320"}
                </div>
                <div className="text-muted-foreground text-xs mt-1">
                  Points Awarded
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 sm:col-span-1">
              <CardContent className="p-5 text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="font-display text-3xl font-bold text-foreground">
                  $2,483
                </div>
                <div className="text-muted-foreground text-xs mt-1">
                  Value Redeemed
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* How it works */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="hover:shadow-green transition-shadow">
                  <CardContent className="p-5 flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">
                          {step.step}
                        </Badge>
                        <h3 className="font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Waste rate table */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Points Per Kilogram
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {wasteRates.map((rate, i) => (
              <motion.div
                key={rate.type}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="hover:shadow-green transition-shadow text-center">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">{rate.emoji}</div>
                    <div className="font-semibold text-foreground text-sm">
                      {rate.type}
                    </div>
                    <div className="font-display font-bold text-primary text-2xl mt-1">
                      {rate.rate}
                    </div>
                    <div className="text-muted-foreground text-xs">pts/kg</div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {rate.note}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <Card className="bg-muted/50 border-border">
          <CardContent className="p-6 text-center space-y-3">
            <Leaf className="w-10 h-10 text-primary mx-auto" />
            <h3 className="font-display text-xl font-bold text-foreground">
              Our Mission
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
              WasteToWealth is built on the Internet Computer blockchain,
              ensuring transparency, security, and immutability of all
              transactions. Every submission, every point, every redemption is
              permanently recorded and tamper-proof.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm pt-4 border-t border-border">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-destructive">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
