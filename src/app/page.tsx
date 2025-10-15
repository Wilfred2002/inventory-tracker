import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Key, Database, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-green/10 text-green px-4 py-2 rounded-full text-sm font-medium">
              <Package className="h-4 w-4" />
              <span>Modern Inventory Management</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-green bg-clip-text text-transparent">
              Track Your Inventory
              <br />
              From Anywhere
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              A powerful SaaS platform to manage your inventory with rooms, categories,
              and items. Access your data through our beautiful dashboard or public API.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-base">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="text-base">
                Sign In
              </Button>
            </Link>
          </div>
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 w-full">
            <div className="p-6 rounded-lg border bg-card hover:border-green/50 transition-colors">
              <Database className="h-10 w-10 text-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Organized Storage</h3>
              <p className="text-muted-foreground">
                Create rooms, categories, and items to keep your inventory perfectly organized.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:border-green/50 transition-colors">
              <Key className="h-10 w-10 text-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Public API Access</h3>
              <p className="text-muted-foreground">
                Generate API keys and access your inventory programmatically from any application.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:border-green/50 transition-colors">
              <TrendingUp className="h-10 w-10 text-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Low Stock Alerts</h3>
              <p className="text-muted-foreground">
                Set thresholds and get visual indicators when items are running low.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
