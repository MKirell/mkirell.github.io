<template>
  <div>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <AppNav />
    <main id="main-content">
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <AchievementsSection />
      <ContactSection />
    </main>
    <AppFooter />
    <PdfModal />
  </div>
</template>

<script setup>
import AppNav from '@/components/AppNav.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import EducationSection from '@/components/EducationSection.vue'
import AchievementsSection from '@/components/AchievementsSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import PdfModal from '@/components/PdfModal.vue'
</script>
