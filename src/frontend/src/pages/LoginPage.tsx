import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Coins, Leaf, Recycle, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/submit" });
    }
  }, [identity, navigate]);

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-sidebar flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('/assets/generated/waste-hero-bg.dim_1200x600.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sidebar-foreground text-xl">
              WasteToWealth
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl font-bold text-sidebar-foreground leading-tight mb-6">
              Turn Your Waste
              <br />
              <span className="text-sidebar-primary">Into Wealth</span>
            </h1>
            <p className="text-sidebar-foreground/60 text-lg leading-relaxed max-w-md">
              Submit recyclable materials, earn points verified by AI, and
              redeem for cash or exclusive coupons.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            {
              icon: Recycle,
              label: "AI Verified",
              desc: "Smart waste detection",
            },
            {
              icon: Coins,
              label: "Earn Points",
              desc: "For every kg recycled",
            },
            { icon: ShieldCheck, label: "Secure", desc: "Blockchain-powered" },
          ].map((feat, i) => (
            <motion.div
              key={feat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="p-4 rounded-xl bg-sidebar-accent border border-sidebar-border"
            >
              <feat.icon className="w-5 h-5 text-sidebar-primary mb-2" />
              <div className="font-semibold text-sidebar-foreground text-sm">
                {feat.label}
              </div>
              <div className="text-sidebar-foreground/50 text-xs">
                {feat.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:max-w-md bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-xl">
              WasteToWealth
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              {isLoggedIn ? "Welcome back!" : "Get Started"}
            </h2>
            <p className="text-muted-foreground">
              {isLoggedIn
                ? "You're signed in and ready to recycle."
                : "Sign in securely with Internet Identity."}
            </p>
          </div>

          <Card className="shadow-green">
            <CardContent className="p-6 space-y-4">
              {!isLoggedIn ? (
                <>
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Secure Authentication
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        We use Internet Identity — decentralized, private, and
                        secure. No passwords stored.
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold shadow-green"
                    onClick={login}
                    disabled={isLoggingIn || isInitializing}
                    data-ocid="login.primary_button"
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      "Sign In with Internet Identity"
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By signing in, you agree to our terms and help make the
                    planet greener 🌿
                  </p>
                </>
              ) : (
                <>
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Leaf className="w-8 h-8 text-primary animate-bounce-gentle" />
                    </div>
                    <p className="font-semibold text-foreground">
                      You're connected!
                    </p>
                  </div>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
                    onClick={() => navigate({ to: "/submit" })}
                    data-ocid="login.primary_button"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={clear}
                    data-ocid="login.secondary_button"
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
