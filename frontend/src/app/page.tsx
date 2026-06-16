import Navbar from "@/components/layout/navbar";
import Hero from "@/components/portfolio/hero";
import Timeline from "@/components/portfolio/timeline";
import EducationSection from "@/components/portfolio/education-section";
import ProjectsGrid from "@/components/portfolio/projects-grid";
import SkillsSection from "@/components/portfolio/skills-section";
import AchievementsSection from "@/components/portfolio/achievements-section";
import ContactSection from "@/components/portfolio/contact-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Hero />
      <SkillsSection />
      <Timeline />
      <EducationSection />
      <ProjectsGrid />
      <AchievementsSection />
      <ContactSection />

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Ruchi Sinha. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
