import { NavigationBar } from "@/components/navigation-bar"
import { Users, Leaf, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <NavigationBar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-green-700 text-white py-20 lg:py-32">
          <div className="absolute inset-0">
            <Image
              src="/placeholder-about-hero.png"
              alt="Lush cannabis fields"
              fill
              className="object-cover opacity-20"
            />
          </div>
          <div className="container mx-auto px-4 relative text-center">
            <h1 className="text-5xl lg:text-7xl font-bold">About Zen Panda</h1>
            <p className="mt-4 text-xl lg:text-2xl max-w-3xl mx-auto text-green-100">
              Your trusted partner on the journey to wellness and inner peace through premium cannabis.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission: Your Zen</h2>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  At Zen Panda, our mission is simple: to provide safe, high-quality, and accessible cannabis products
                  that empower you to find your personal zen. We believe in the therapeutic power of this incredible
                  plant and are dedicated to demystifying its use.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We are committed to education, transparency, and community. From the seeds we source to the products
                  that arrive at your door, every step is handled with care, intention, and a commitment to excellence.
                </p>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/placeholder-ff1cq.png" alt="Zen Panda team working" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Our Core Values</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide every decision we make.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Leaf,
                  title: "Quality & Purity",
                  description:
                    "We partner with the best organic growers and use rigorous third-party lab testing to ensure every product meets the highest standards.",
                },
                {
                  icon: Users,
                  title: "Community & Education",
                  description:
                    "We strive to be a resource for our community, providing accurate information and fostering a safe, inclusive environment for all.",
                },
                {
                  icon: Heart,
                  title: "Integrity & Transparency",
                  description:
                    "You deserve to know what you're consuming. We provide complete transparency from seed to sale, so you can feel confident in your choices.",
                },
              ].map((value) => (
                <div key={value.title} className="text-center p-8 bg-green-50/50 rounded-2xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white mb-6">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Meet the Pandas</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind your zen experience.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Alex Chen", role: "Founder & CEO", image: "/placeholder-team1.png" },
                { name: "Maria Garcia", role: "Head of Cultivation", image: "/placeholder-team2.png" },
                { name: "David Lee", role: "Customer Zen Master", image: "/placeholder-team3.png" },
              ].map((member) => (
                <div key={member.name} className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-green-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
