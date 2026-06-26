import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughDivider from "@/components/RoughDivider";
import RoughStar from "@/components/RoughStar";
import Sparkles from "@/components/Sparkles";

export const metadata = {
  title: "Travel Guide · HexaFalls Techfest",
  description: "Navigate your way to HexaFalls at JIS University. Detailed travel instructions via air, train, metro, and bus.",
  alternates: {
    canonical: "/travel",
  },
};

export default function TravelGuidePage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-midnight text-silver-hp">
      <TopBar />

      <section className="relative isolate pt-32 pb-24 px-6 min-h-screen flex flex-col items-center overflow-hidden">
        {/* Parallax / Atmosphere */}
        <div className="absolute inset-0 -z-30 hp-stars opacity-15" />
        <div className="absolute inset-0 -z-20 hp-scrim opacity-40" />
        <div className="absolute inset-0 -z-10 opacity-30">
          <Sparkles count={30} />
        </div>

        <RoughStar size={24} color="#D4AF37" seed={11} className="absolute top-40 left-10 opacity-60 hp-float" style={{ animationDuration: "12s" }} />
        <RoughStar size={18} color="#A78BFA" seed={15} className="absolute top-60 right-16 opacity-50 hp-float" style={{ animationDuration: "14s" }} />

        <div className="w-full max-w-4xl z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <RoughDivider width={64} height={20} color="#D4AF37" seed={99} />
            <h1 className="font-display font-black tracking-[0.15em] uppercase text-3xl sm:text-4xl lg:text-5xl hp-glow-gold text-gold-hp text-center">
              Travel Guide
            </h1>
            <RoughDivider width={64} height={20} color="#D4AF37" seed={101} />
          </div>

          <p className="font-wizard text-center text-silver-hp/70 mb-12 max-w-2xl text-lg">
            We&apos;ve crafted a guide to help you navigate your way to the venue with ease. Uncover the paths below.
          </p>

          {/* Intro Card */}
          <div className="w-full mb-12">
            <RoughFrame
              seed={200}
              stroke="#D4AF37"
              mistColor="#D4AF37"
              strokeWidth={1.5}
              roughness={1.5}
              padding={32}
              className="bg-slate-hp/40 backdrop-blur-md"
            >
              <div className="font-wizard space-y-6 text-silver-hp/90 leading-relaxed text-base sm:text-lg">
                <p>
                  🎉 <strong className="text-gold-hp font-display tracking-wide">Congratulations, Hacker!</strong> You&apos;ve been chosen to step into the anomalies of <strong className="text-cyan-hp">HexaFalls 2</strong> — a 58-hour offline hackathon at <strong className="text-silver-hp">JIS University, Kolkata</strong>.
                </p>
                
                <div className="p-4 rounded border border-red-400/30 bg-red-900/10 shadow-[inset_0_0_20px_rgba(248,113,113,0.05)]">
                  <p className="text-red-300">
                    🚨 <strong>Mandatory:</strong> Don&apos;t forget to carry your original or photocopy of Aadhar card or Voter ID, as it is mandatory for campus entry.
                  </p>
                </div>

                <p>
                  We&apos;re beyond excited to see the magic you build in the rift. Get ready for mysteries, mayhem, and memories. See you soon! ✨
                </p>
              </div>
            </RoughFrame>
          </div>

          {/* Venue Info */}
          <div className="w-full mb-16">
            <h2 className="font-display font-bold text-2xl text-gold-hp mb-6 tracking-wide text-center">Venue Location</h2>
            <RoughFrame
              seed={201}
              stroke="#66FCF1"
              mistColor="#66FCF1"
              strokeWidth={1.2}
              roughness={1.5}
              padding={24}
              className="bg-slate-hp/30 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-display font-bold text-xl text-cyan-hp mb-2">JIS University</h3>
                  <p className="font-wizard text-silver-hp/80 leading-relaxed">
                    81, Nilgunj Rd, Jagarata Pally,<br/>
                    Deshpriya Nagar, Agarpara,<br/>
                    Kolkata, West Bengal 700109
                  </p>
                </div>
                <div className="w-full md:w-1/2 rounded-lg overflow-hidden border border-silver-hp/20 relative" style={{ minHeight: "250px" }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.4046316755416!2d88.37576757600105!3d22.6759762291722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89c46c06efd83%3A0x36a29a26ce825e99!2sJIS%20UNIVERSITY!5e0!3m2!1sen!2sin!4v1750318434140!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, position: "absolute", inset: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </RoughFrame>
          </div>

          <h2 className="font-display font-black text-3xl text-gold-hp hp-glow-gold mb-10 tracking-widest uppercase text-center">
            How to reach
          </h2>

          <div className="w-full space-y-8">
            {/* Air */}
            <RoughFrame seed={202} stroke="#A78BFA" padding={32} className="bg-slate-hp/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">✈️</span>
                <h3 className="font-display font-bold text-2xl text-violet-400">By Air</h3>
              </div>
              <p className="font-wizard text-silver-hp/80 text-lg">
                The nearest airport to the venue is <strong>Netaji Subhash Chandra Bose International Airport</strong>.
              </p>
            </RoughFrame>

            {/* Train */}
            <RoughFrame seed={203} stroke="#66FCF1" padding={32} className="bg-slate-hp/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">🚆</span>
                <h3 className="font-display font-bold text-2xl text-cyan-hp">By Train</h3>
              </div>
              <div className="font-wizard text-silver-hp/80 space-y-6 text-lg">
                <p>If you&apos;re coming from outside Kolkata or nearby districts, a train is your best option.</p>
                
                <div className="pl-4 border-l-2 border-cyan-hp/30 space-y-3">
                  <h4 className="font-display font-bold text-gold-hp">Via Sealdah:</h4>
                  <p>Board any <strong>non-galloping local train</strong> heading toward <strong>Naihati Junction</strong> (such as Naihati Local, Barrackpore Local, Ranaghat Local, Gede Local, or Krishnanagar Local).</p>
                  <p>➡️ <strong>Get off at Agarpara Station.</strong> From <strong>Platform No. 1</strong>, take a <strong>TOTO (₹10/person)</strong> straight to the venue (JIS University).</p>
                </div>

                <div className="pl-4 border-l-2 border-cyan-hp/30 space-y-3">
                  <h4 className="font-display font-bold text-gold-hp">Via Howrah:</h4>
                  <p>From <strong>Howrah Station</strong>, you have two options:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Book a <strong>taxi</strong> directly to the venue.</li>
                    <li>Or take a <strong>bus</strong> from <strong>Gate No. 6 Subway Bus Stand</strong>. Any bus going toward <strong>Sodepur/Barrackpore</strong> will get you close — just ask to be dropped near <strong>Sagar Dutta Hospital / Aryans School / Kamarhati</strong>.</li>
                  </ul>
                </div>

                <div className="pl-4 border-l-2 border-cyan-hp/30 space-y-3">
                  <h4 className="font-display font-bold text-gold-hp">Other Train Routes:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Coming from <strong>Kalyani/Krishnanagar</strong>? Board any non-galloping local toward <strong>Sealdah</strong>, and get off at <strong>Agarpara</strong>.</li>
                    <li>From <strong>Bongaon / Barasat / Hasnabad</strong>? Take a local train to <strong>Dumdum</strong>, then transfer to a Sealdah-bound <strong>Up-line train</strong>. Get off at <strong>Agarpara</strong>.</li>
                    <li>From <strong>Bandel / Burdwan</strong>? Reach <strong>Bandel Jn</strong>, take a local to <strong>Naihati</strong>, then board a non-galloping Sealdah-bound train and get off at <strong>Agarpara</strong>.</li>
                  </ul>
                  <p className="mt-4 text-cyan-hp/90">
                    From <strong>Agarpara Station</strong>, again — use the <strong>TOTO (₹10/person)</strong> to reach JIS University (Platform No. 1 side).
                  </p>
                </div>
              </div>
            </RoughFrame>

            {/* Metro */}
            <RoughFrame seed={204} stroke="#D4AF37" padding={32} className="bg-slate-hp/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">🚇</span>
                <h3 className="font-display font-bold text-2xl text-gold-hp">By Metro</h3>
              </div>
              <div className="font-wizard text-silver-hp/80 space-y-4 text-lg">
                <p>If you&apos;re coming from <strong>South Kolkata</strong>, take the <strong>Metro to Dakshineswar</strong>.</p>
                <p>➡️ Get off at <strong>Baranagar Station</strong>.</p>
                <p>From there, hop into an <strong>auto</strong> and ask for <strong>Narula Institute of Technology</strong> — <strong>JIS University</strong> is just next to it.</p>
              </div>
            </RoughFrame>

            {/* Bus */}
            <RoughFrame seed={205} stroke="#66FCF1" padding={32} className="bg-slate-hp/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">🚍</span>
                <h3 className="font-display font-bold text-2xl text-cyan-hp">By Bus</h3>
              </div>
              <p className="font-wizard text-silver-hp/80 text-lg">
                If you are coming by bus via BT Road, board any bus towards Sodepur, and get down at <strong>Aryans School</strong> (near Sagar Dutta Hospital).
              </p>
            </RoughFrame>

          </div>

          {/* Essentials and Provisions */}
          <div className="w-full mt-24 mb-10 text-center flex flex-col items-center">
            <RoughDivider width={64} height={20} color="#66FCF1" seed={220} />
            <h2 className="mt-6 mb-4 font-display font-black text-3xl text-cyan-hp hp-glow tracking-widest uppercase">
              Survival Guide
            </h2>
            <p className="font-wizard text-silver-hp/70 text-lg max-w-2xl">
              Wandering into the unknown? Don&apos;t forget to pack your essentials. Here is everything you need to survive the storm, and everything we&apos;ll provide to keep you safe.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8" id="essentials">
            {/* What to Carry */}
            <RoughFrame seed={210} stroke="#D4AF37" padding={32} className="bg-slate-hp/30 backdrop-blur-sm h-full">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">🎒</span>
                <h3 className="font-display font-bold text-2xl text-gold-hp">What to Carry</h3>
              </div>
              <ul className="font-wizard text-silver-hp/85 space-y-4 text-base sm:text-lg">
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold-hp">🪪</span>
                  <span><strong>Aadhaar or Voter ID is a must.</strong> JIS University enforces strict entry guidelines for all external participants. <span className="text-red-400 font-bold">[No ID = No entry]</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold-hp">💻</span>
                  <span><strong>Your laptop</strong> – your most trusted tool in this mystery-solving journey.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold-hp">🔌</span>
                  <span><strong>Bring your own extension cords</strong> if you have one! We&apos;ll arrange some shared cords per team, but having your own can save time and stress.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold-hp">☔</span>
                  <span><strong>Carry an umbrella or raincoat.</strong> Rath Yatra is on June 27, and there&apos;s a good chance we&apos;ll have a rainy start on June 28—better safe than soggy!</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold-hp">❄️</span>
                  <span><strong>The venue is air-conditioned 24/7</strong> – pack a jacket or hoodie if you get cold easily.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-gold-hp">📶</span>
                  <span><strong>Wi-Fi is covered</strong>, but if you have a personal dongle, carry it for backup. Power can be unpredictable, and mysteries don&apos;t wait.</span>
                </li>
                <li className="flex gap-3 opacity-80">
                  <span className="shrink-0 text-gold-hp">🍼</span>
                  <span><strong>[Optional]</strong> A water bottle for your journey to the Falls.</span>
                </li>
                <li className="flex gap-3 opacity-80">
                  <span className="shrink-0 text-gold-hp">🧴</span>
                  <span><strong>[Optional]</strong> Skincare essentials if you use anything special.</span>
                </li>
                <li className="flex gap-3 opacity-80">
                  <span className="shrink-0 text-gold-hp">🏥</span>
                  <span><strong>[Optional]</strong> Any personal medical items (inhalers, sugar monitors). Please let us know at the check-in desk so we can keep an eye out.</span>
                </li>
              </ul>
            </RoughFrame>

            {/* What we Provide */}
            <RoughFrame seed={211} stroke="#3B82F6" padding={32} className="bg-slate-hp/30 backdrop-blur-sm h-full">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">🔵</span>
                <h3 className="font-display font-bold text-2xl text-blue-400">What We Provide</h3>
              </div>
              <p className="font-wizard text-silver-hp/70 text-lg mb-6">
                We&apos;ve got you covered so you can focus on solving mysteries, not logistics...
              </p>
              <ul className="font-wizard text-silver-hp/85 space-y-5 text-base sm:text-lg">
                <li className="flex gap-3">
                  <span className="shrink-0 text-blue-400">📅</span>
                  <span><strong>Action-packed timeline</strong> you won&apos;t want to miss.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-blue-400">🍽️</span>
                  <span><strong>Food, water, and tea – totally on us.</strong> Eat, drink, and keep hacking.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-blue-400">🛏️</span>
                  <span><strong>Rest areas for both boys and girls</strong> – comfy spaces to recharge between intense brainstorming sessions.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-blue-400">📡</span>
                  <span><strong>Dedicated Wi-Fi</strong> for uninterrupted tech magic.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-blue-400">👮</span>
                  <span><strong>24/7 security staff</strong> will be there, so you can focus on code without worry.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 text-blue-400">🚑</span>
                  <span><strong>Emergency medical services</strong> and an ambulance will be available on standby for your safety.</span>
                </li>
              </ul>
            </RoughFrame>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
