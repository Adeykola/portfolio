import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Send, MapPin, Phone, Mail, Calendar, Github, Linkedin, Twitter } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '../../lib/supabase'
import { useStore } from '../../store/useStore'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
})

type FormData = yup.InferType<typeof schema>

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
]

export const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { siteSettings, settingsLoaded } = useStore()

  // Dynamic contact info using site settings
  const contactInfo = [
    {
      icon: MapPin,
      label: 'Location',
      value: siteSettings.contact_location || 'Lagos, Nigeria',
      href: '#'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: siteSettings.contact_phone || '+234 (0) 123 456 7890',
      href: `tel:${siteSettings.contact_phone_link || '+2341234567890'}`
    },
    {
      icon: Mail,
      label: 'Email',
      value: siteSettings.contact_email || 'hello@adekola.dev',
      href: `mailto:${siteSettings.contact_email || 'hello@adekola.dev'}`
    },
    {
      icon: Calendar,
      label: 'Schedule',
      value: siteSettings.contact_schedule_text || 'Book a Meeting',
      href: siteSettings.contact_schedule_link || '#'
    }
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // Save contact to database
      await db.createContact({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: 'new'
      })
      
      // Send email notification
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message
          })
        })

        const result = await response.json()
        if (!response.ok) {
          console.error('Email sending failed:', result)
          // Don't throw error here - form submission was still successful
        }
      } catch (emailError) {
        console.error('Email service error:', emailError)
        // Don't throw error here - form submission was still successful
      }
      
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      reset()
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Don't render until settings are loaded
  if (!settingsLoaded) {
    return (
      <section id="contact" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get In <span className="text-cyan-400">Touch</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {siteSettings.contact_subtitle || "Ready to start your next project? Let's discuss how we can work together to bring your ideas to life."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 lg:space-y-8 order-2 lg:order-1"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Let's Talk</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                {siteSettings.contact_description || "I'm always interested in hearing about new projects and opportunities. Whether you're a startup looking to build your first product or an established company wanting to revamp your digital presence, I'd love to help."}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 sm:space-y-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-all duration-300 group"
                >
                  <div className="p-2 sm:p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-400">{item.label}</div>
                    <div className="text-sm sm:text-base text-white font-medium">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow Me</h4>
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-2.5 sm:p-3 bg-gray-900 rounded-lg hover:bg-cyan-500 transition-all duration-300 group"
                  >
                    <social.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Available for new projects</span>
              </div>
              <p className="text-gray-300 text-sm mt-2">
                Currently accepting new freelance opportunities and collaborations.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700 order-1 lg:order-2"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send Message</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  {...register('subject')}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                  placeholder="Tell me about your project..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}