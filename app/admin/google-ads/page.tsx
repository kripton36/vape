import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Eye,
  KeyRound,
  MousePointerClick,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"

const kpiCards = [
  {
    title: "Impressions",
    value: "1.28M",
    change: "+12.4%",
    trend: "up",
    icon: Eye,
    description: "Visibility across all campaigns",
  },
  {
    title: "Clicks",
    value: "74,920",
    change: "+6.1%",
    trend: "up",
    icon: MousePointerClick,
    description: "Paid traffic volume",
  },
  {
    title: "CTR",
    value: "5.8%",
    change: "-0.4%",
    trend: "down",
    icon: TrendingDown,
    description: "Click-through rate",
  },
  {
    title: "Spend",
    value: "$42,310",
    change: "+5.1%",
    trend: "up",
    icon: DollarSign,
    description: "Total ad spend",
  },
  {
    title: "Conversions",
    value: "1,248",
    change: "+9.7%",
    trend: "up",
    icon: Target,
    description: "Primary conversions",
  },
  {
    title: "ROAS",
    value: "4.2x",
    change: "+0.3x",
    trend: "up",
    icon: TrendingUp,
    description: "Revenue return",
  },
]

const budgetPacing = [
  {
    name: "Brand Search",
    budget: "$1,200",
    spend: "$980",
    pacing: 82,
    status: "On track",
    tone: "bg-emerald-500",
  },
  {
    name: "Prospecting - Non Brand",
    budget: "$2,500",
    spend: "$2,070",
    pacing: 83,
    status: "On track",
    tone: "bg-emerald-500",
  },
  {
    name: "Performance Max",
    budget: "$2,800",
    spend: "$3,120",
    pacing: 112,
    status: "Over budget",
    tone: "bg-red-500",
  },
  {
    name: "Remarketing",
    budget: "$900",
    spend: "$760",
    pacing: 84,
    status: "On track",
    tone: "bg-emerald-500",
  },
]

const campaigns = [
  {
    name: "Brand Search - US",
    status: "Active",
    budget: "$1,200",
    spend: "$980",
    cpa: "$18.40",
    conversions: "53",
    roas: "6.2x",
  },
  {
    name: "Prospecting - Non Brand",
    status: "Active",
    budget: "$2,500",
    spend: "$2,070",
    cpa: "$42.10",
    conversions: "92",
    roas: "3.8x",
  },
  {
    name: "Performance Max",
    status: "Limited",
    budget: "$2,800",
    spend: "$3,120",
    cpa: "$55.70",
    conversions: "71",
    roas: "2.9x",
  },
  {
    name: "Remarketing - Cart",
    status: "Paused",
    budget: "$900",
    spend: "$410",
    cpa: "$29.80",
    conversions: "22",
    roas: "4.6x",
  },
]

const recommendations = [
  {
    title: "Increase Brand Search budget",
    detail: "High ROAS and low impression share. Add +15% budget to capture demand.",
    type: "success",
  },
  {
    title: "Fix Performance Max asset issues",
    detail: "3 assets disapproved. Update headlines to unlock full reach.",
    type: "warning",
  },
  {
    title: "Refresh non-brand ad copy",
    detail: "CTR trending down. Test new value props and offers.",
    type: "warning",
  },
]

const setupChecklist = [
  {
    title: "Add Google Ads API key",
    description: "Paste your key to enable secure access.",
  },
  {
    title: "Confirm customer ID",
    description: "Use the account ID you want to monitor.",
  },
  {
    title: "Map conversion actions",
    description: "Select the actions that matter to your goals.",
  },
  {
    title: "Schedule data refresh",
    description: "Set a daily or hourly sync for reporting.",
  },
]

const getTrendStyles = (trend: string) => {
  if (trend === "up") {
    return {
      icon: TrendingUp,
      text: "text-emerald-600",
      background: "bg-emerald-50 border-emerald-200",
    }
  }

  return {
    icon: TrendingDown,
    text: "text-rose-600",
    background: "bg-rose-50 border-rose-200",
  }
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "Limited":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "Paused":
      return "bg-slate-100 text-slate-600 border-slate-200"
    default:
      return "bg-slate-100 text-slate-600 border-slate-200"
  }
}

const getRecommendationIcon = (type: string) => {
  if (type === "success") {
    return CheckCircle2
  }

  return AlertTriangle
}

export default function GoogleAdsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-8 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Google Ads Performance Hub</h1>
            <p className="text-slate-600 mt-2">
              Add your Google Ads API key to monitor campaigns, spend, and conversions in one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-blue-200 bg-blue-50 text-blue-700">API key required</Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              Last sync: --
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <KeyRound className="h-5 w-5 text-blue-600" />
                Connect Google Ads
              </CardTitle>
              <CardDescription>Only the API key is required. Add optional details for scoped access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="google-ads-api-key" className="text-sm font-medium text-slate-700">
                    API key
                  </label>
                  <Input id="google-ads-api-key" type="password" placeholder="AIza..." />
                  <p className="text-xs text-slate-500">Required. Stored securely and never displayed again.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="google-ads-customer-id" className="text-sm font-medium text-slate-700">
                    Customer ID
                  </label>
                  <Input id="google-ads-customer-id" placeholder="123-456-7890" />
                  <p className="text-xs text-slate-500">Optional. Limit data to a specific account.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="google-ads-manager-id" className="text-sm font-medium text-slate-700">
                    Manager account ID
                  </label>
                  <Input id="google-ads-manager-id" placeholder="111-222-3333" />
                  <p className="text-xs text-slate-500">Optional. Useful for MCC setups.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="google-ads-date-range" className="text-sm font-medium text-slate-700">
                    Default date range (days)
                  </label>
                  <Input id="google-ads-date-range" type="number" placeholder="30" min="1" />
                  <p className="text-xs text-slate-500">Controls the reporting window for charts.</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">Save and sync</Button>
                <Button variant="outline" className="border-slate-200 text-slate-700">
                  Test connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Reporting preferences
              </CardTitle>
              <CardDescription>Define the data scope for performance insights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Attribution model</p>
                  <p className="text-xs text-slate-500">Data driven</p>
                </div>
                <Badge variant="outline" className="border-slate-200 text-slate-600">
                  Recommended
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Timezone</p>
                  <p className="text-xs text-slate-500">America/Los_Angeles</p>
                </div>
                <Badge variant="outline" className="border-slate-200 text-slate-600">
                  Account default
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Currency</p>
                  <p className="text-xs text-slate-500">USD</p>
                </div>
                <Badge variant="outline" className="border-slate-200 text-slate-600">
                  Account default
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Sync frequency</p>
                  <p className="text-xs text-slate-500">Every 6 hours</p>
                </div>
                <Badge className="border-blue-200 bg-blue-50 text-blue-700">Custom</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((kpi) => {
            const trend = getTrendStyles(kpi.trend)
            const TrendIcon = trend.icon
            return (
              <Card
                key={kpi.title}
                className={`border-slate-200 bg-white/80 backdrop-blur-sm ${trend.background}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">{kpi.title}</CardTitle>
                  <kpi.icon className={`h-4 w-4 ${trend.text}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-slate-900">{kpi.value}</div>
                  <div className="mt-1 flex items-center text-xs">
                    <TrendIcon className={`mr-1 h-3 w-3 ${trend.text}`} />
                    <span className={trend.text}>{kpi.change}</span>
                    <span className="ml-1 text-slate-500">vs previous period</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{kpi.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Wallet className="h-5 w-5 text-blue-600" />
                Campaign performance
              </CardTitle>
              <CardDescription>Key results by campaign over the selected date range.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>CPA</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>ROAS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.name}>
                      <TableCell className="font-medium text-slate-700">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusClasses(campaign.status)}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{campaign.budget}</TableCell>
                      <TableCell className="text-slate-600">{campaign.spend}</TableCell>
                      <TableCell className="text-slate-600">{campaign.cpa}</TableCell>
                      <TableCell className="text-slate-600">{campaign.conversions}</TableCell>
                      <TableCell className="text-slate-600">{campaign.roas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Wallet className="h-5 w-5 text-blue-600" />
                Budget pacing
              </CardTitle>
              <CardDescription>Track spend against monthly budgets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetPacing.map((item) => {
                const width = Math.min(item.pacing, 100)
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <span className="text-slate-600">
                        {item.spend} / {item.budget}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${width}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.status}</span>
                      <span>{item.pacing}% of budget</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Optimization recommendations
              </CardTitle>
              <CardDescription>Focused actions to lift performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((recommendation) => {
                const Icon = getRecommendationIcon(recommendation.type)
                const iconColor = recommendation.type === "success" ? "text-emerald-600" : "text-amber-500"
                return (
                  <div
                    key={recommendation.title}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <Icon className={`mt-0.5 h-4 w-4 ${iconColor}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{recommendation.title}</p>
                      <p className="text-xs text-slate-500">{recommendation.detail}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Setup checklist
              </CardTitle>
              <CardDescription>Ensure your account is ready for reporting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {setupChecklist.map((step, index) => (
                <div key={step.title} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{step.title}</p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
