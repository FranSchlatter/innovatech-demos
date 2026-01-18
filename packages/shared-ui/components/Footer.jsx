import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

export default function Footer({ brand = 'InnovaTech', currentYear = new Date().getFullYear() }) {
  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:dm.innovatech@gmail.com', label: 'Email' }
  ]

  return (
    <footer className="bg-surface/80 border-t border-primary/10">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-primary mb-4">{brand}</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-contrast flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-text mb-4">Services</h4>
            <ul className="space-y-2 text-muted text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Hospitality</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Health</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Gastronomy</a></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-text mb-4">Legal</h4>
            <ul className="space-y-2 text-muted text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted text-sm">
          <p>© {currentYear} Hotel Luxury. Made with <Heart className="w-4 h-4 inline text-accent" /> by innovatech.</p>
        </div>
      </div>
    </footer>
  )
}
