import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useStore } from './store/useStore'
import { useAuthStore } from './store/useAuthStore'
import { Header } from './components/layout/Header'
import { Hero } from './components/sections/Hero'
import { Portfolio } from './components/sections/Portfolio'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/layout/Footer'
import { LoginForm } from './components/auth/LoginForm'
import { AdminLayout } from './components/admin/AdminLayout'
import { Dashboard } from './components/admin/Dashboard'
import { ProjectsManager } from './components/admin/ProjectsManager'
import { TestimonialsManager } from './components/admin/TestimonialsManager'
import { SkillsManager } from './components/admin/SkillsManager'
import { ContactsManager } from './components/admin/ContactsManager'
import { SiteSettingsManager } from './components/admin/SiteSettingsManager'
import { ProtectedRoute } from './components/admin/ProtectedRoute'
import './index.css'

function App() {
  const { isDarkMode, fetchSiteSettings } = useStore()
  const { initialize } = useAuthStore()
  
  useEffect(() => {
    fetchSiteSettings() // Fetch site settings on app load
  }, [fetchSiteSettings])

  // Initialize settings subscription for real-time updates
  useEffect(() => {
    const { initializeSettingsSubscription, cleanupSettingsSubscription } = useStore.getState()
    
    initializeSettingsSubscription()
    
    // Cleanup on unmount
    return () => {
      cleanupSettingsSubscription()
    }
  }, [])

  useEffect(() => {
    // Initialize auth state
    initialize()
  }, [initialize])

  const HomePage = () => (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Header />
        <main className="relative z-10">
          <Hero />
          <Portfolio />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<LoginForm />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="contacts" element={<ContactsManager />} />
        <Route path="settings" element={<SiteSettingsManager />} />
      </Route>
    </Routes>
  )
}

export default App