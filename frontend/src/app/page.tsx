import Navbar from "@/components/layout/navbar";
import Hero from "@/components/portfolio/hero";
import Timeline from "@/components/portfolio/timeline";
import EducationSection from "@/components/portfolio/education-section";
import ProjectsGrid from "@/components/portfolio/projects-grid";
import SkillsSection from "@/components/portfolio/skills-section";
import AchievementsSection from "@/components/portfolio/achievements-section";
import ContactSection from "@/components/portfolio/contact-form";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ruchi Sinha",
    "jobTitle": "Full Stack Software Engineer",
    "url": "https://portfolio-dicj.onrender.com",
    "sameAs": [
      "https://github.com/rsinha488",
      "https://linkedin.com/in/ruchi-developer"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Full-Stack Web Development",
      "React.js",
      "Next.js",
      "Node.js",
      "MongoDB",
      "API Design",
      "Voice AI Automation"
    ],
    "image": "https://portfolio-dicj.onrender.com/ruchi-photo.jpg",
    "description": "Full Stack Software Engineer with 5 years of experience building scalable, high-performance web applications using React.js, Next.js, Node.js, and MongoDB."
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <SkillsSection />
        <Timeline />
        <EducationSection />
        <ProjectsGrid />
        <AchievementsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Ruchi Sinha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
