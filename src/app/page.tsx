import { PortfolioHero } from "@/components/PortfolioHero";
import { WorkGrid } from "@/components/WorkGrid";
import { AppFeatured } from "@/components/AppFeatured";

export default function Home() {
  const workItems = [
    {
      id: "biskie",
      title: "Biskie Brand Concept",
      category: "Branding",
      imageUrl: "/brain_rot_designs/biskie_hero_section.avif",
      galleryImages: [
        "/brain_rot_designs/biskie_hero_section.avif",
        "/brain_rot_designs/biskie_landing_page.avif"
      ]
    },
    {
      id: "pac-delivery",
      title: "PAC Delivery App Concept",
      category: "Product Design",
      imageUrl: "/brain_rot_designs/pac_inspired_delivery_app_design.avif",
      galleryImages: [
        "/brain_rot_designs/pac_inspired_delivery_app_design.avif",
        "/brain_rot_designs/pac_inspired_delivery_app_design_1.avif",
        "/brain_rot_designs/pac_inspired_delivery_app_design_2.avif"
      ]
    },
    {
      id: "sm-cinema",
      title: "SM Cinema Redesign Concept",
      category: "Interface Design",
      imageUrl: "/brain_rot_designs/sm_redesign_1.avif",
      galleryImages: [
        "/brain_rot_designs/sm_redesign_1.avif",
        "/brain_rot_designs/sm_redesign_2.avif"
      ]
    },
    {
      id: "kendrick",
      title: "Kendrick Lamar Hero",
      category: "Editorial Design",
      imageUrl: "/brain_rot_designs/kendrick_lamar_hero_design.avif"
    },
    {
      id: "vader",
      title: "Darth Vader Concept",
      category: "Editorial Design",
      imageUrl: "/brain_rot_designs/darth_vader_hero_design.avif"
    },
    {
      id: "drake",
      title: "Drake Hero Design",
      category: "Editorial Design",
      imageUrl: "/brain_rot_designs/drake_hero_design.avif"
    },
    {
      id: "pacers",
      title: "Indiana Pacers Hero",
      category: "Sports Branding",
      imageUrl: "/brain_rot_designs/indiana_pacers_hero_section_design.avif"
    },
    {
      id: "nike",
      title: "Nike Hero Concept",
      category: "Product Design",
      imageUrl: "/brain_rot_designs/nike_hero_section_design.avif"
    },
    {
      id: "car-rental",
      title: "Car Rental UI",
      category: "App Concept",
      imageUrl: "/brain_rot_designs/car_rental_concept.avif"
    },
    {
      id: "coffee",
      title: "Coffee Shop App",
      category: "App Concept",
      imageUrl: "/brain_rot_designs/coffee_shop_concept_app.avif"
    },
    {
      id: "pokemon",
      title: "Pokemon Landing",
      category: "Web Design",
      imageUrl: "/brain_rot_designs/pokemon_landing_page.avif"
    },
    {
      id: "spotify",
      title: "Spotify Dashboard",
      category: "Interface Design",
      imageUrl: "/brain_rot_designs/spotify_dashboard_concept.avif"
    }
  ];

  const personalApps = [
    {
      id: "slade",
      title: "Slade Comics",
      description: "Inspired by a desire for a free, high-fidelity comic reading experience, Slade was built to modernize the interaction with .cbz and .cbr files. A Flutter project integrated with the Figma API via MCP, it features a gesture-based reader, library management, and persistent progress tracking.",
      imageUrl: "/personal_apps/slade_comics.avif",
      galleryImages: ["/personal_apps/slade_comics.avif"],
      videoUrl: "/personal_apps/slade_comics_demo.webm",
      link: "#",
      tags: ["Flutter", "Figma API", "MCP", "Vibe-Coding"]
    },
    {
      id: "broke-basket",
      title: "The Broke Basket",
      description: "An offline-first Android app created to replace the traditional grocery notebook and manual calculator. Built for seamless budget tracking during shopping trips, it provides a basic yet efficient and reliable experience without the need for an account or connectivity.",
      imageUrl: "/personal_apps/the_broke_basket_1.avif",
      galleryImages: ["/personal_apps/the_broke_basket_1.avif", "/personal_apps/the_broke_basket_2.avif"],
      videoUrl: "/personal_apps/broke_basket_demo.webm",
      link: "#",
      tags: ["React Native", "Expo", "Tailwind", "Antigravity"]
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <PortfolioHero />

      {/* Case Studies Section - Coming Soon */}
      <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-white/5">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-8">
          <h2 className="font-oswald text-4xl md:text-6xl uppercase tracking-tighter">
            CASE STUDIES
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-white animate-pulse rounded-full" />
            <span className="text-xs uppercase tracking-[0.5em] text-muted-foreground">Coming Soon</span>
          </div>
        </div>
        <p className="mt-8 text-muted-foreground max-w-xl text-sm leading-relaxed font-light uppercase tracking-wide">
          Deep dives into the strategy, architecture, and engineering behind my major projects. Currently being documented with high-fidelity breakdowns.
        </p>
      </section>

      <div id="work">
        <WorkGrid items={workItems} title="BRAIN ROT DESIGNS" />
      </div>

      <AppFeatured projects={personalApps} />

      {/* Footer or final sign-off */}
      <footer className="w-full py-24 px-6 md:px-16 lg:px-24 flex flex-col items-center justify-center border-t border-border/10">
        <h3 className="font-oswald text-4xl md:text-6xl uppercase tracking-tighter mb-8">Josef</h3>
        <p className="text-muted-foreground text-center max-w-sm text-sm uppercase tracking-widest leading-relaxed">
          UI/UX Engineer
        </p>
        <div className="mt-16 flex flex-col md:items-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="flex gap-8 flex-wrap justify-center">
            <a href="tel:+639777389118" className="hover:text-white transition-colors">+63-977-738-9118</a>
            <a href="mailto:andreinicolas0816@gmail.com" className="hover:text-white transition-colors">andreinicolas0816@gmail.com</a>
            <a href="https://linkedin.com/in/andreinclas" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">linkedin.com/in/andreinclas</a>
            <a href="https://instagram.com/sitcho_pages" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">instagram.com/sitcho_pages</a>
          </div>
          <span>&copy; {new Date().getFullYear()} Josef's Portfolio</span>
        </div>
      </footer>
    </main>
  );
}

