import { motion } from 'framer-motion'
import {
  ArrowRight, BrainCircuit, ChevronRight, Download, FileSearch, FileSpreadsheet,
  Layers, Moon, Shield, Sparkles, Sun, Upload, Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'

const FEATURES = [
  {
    icon:  BrainCircuit,
    title: 'Smart OCR Engine',
    desc:  'Extracts every label, table, dimension, and annotation from complex technical drawings with high precision.',
    color: 'text-blue-500',
    bg:    'bg-blue-500/8',
  },
  {
    icon:  FileSearch,
    title: 'Deep Extraction',
    desc:  'Multi-page PDFs, scanned images, and engineering drawings are no match. Every key-value pair captured.',
    color: 'text-purple-500',
    bg:    'bg-purple-500/8',
  },
  {
    icon:  FileSpreadsheet,
    title: 'Export to Excel / CSV',
    desc:  'Get your data as a beautifully formatted multi-sheet Excel workbook, CSV, or structured JSON.',
    color: 'text-green-500',
    bg:    'bg-green-500/8',
  },
  {
    icon:  Shield,
    title: 'Secure & Private',
    desc:  'Files are processed transiently and never stored permanently. Your data stays yours.',
    color: 'text-yellow-500',
    bg:    'bg-yellow-500/8',
  },
]

const STEPS = [
  { n: '01', title: 'Upload', desc: 'Drag & drop a PDF or image — no limit on complexity.' },
  { n: '02', title: 'OCR Extracts', desc: 'The engine analyzes every detail of your document with precision.' },
  { n: '03', title: 'Download', desc: 'Get structured Excel, CSV, or JSON in seconds.' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export default function Landing() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* Dot grid background */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgb(0 0 0 / 0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="dark:hidden fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgb(0 0 0 / 0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div className="hidden dark:block fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgb(255 255 255 / 0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-200/60 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 dark:bg-white">
            <Zap className="h-4 w-4 text-white dark:text-gray-900" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white tracking-tight">OCR</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggle}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/dashboard">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 h-9 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 text-center">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="h-[400px] w-[700px] rounded-full bg-blue-500/6 dark:bg-blue-500/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 mb-6"
          >
            <Sparkles className="h-3 w-3" />
            OCR Engine · v1.0
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-balance mb-6">
            <span className="text-gray-900 dark:text-white">Extract insights</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              from any document
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
            Upload PDFs, technical drawings, and scanned images.
            Get fully structured data as <strong className="text-gray-700 dark:text-gray-300">Excel</strong>,{' '}
            <strong className="text-gray-700 dark:text-gray-300">CSV</strong>, or{' '}
            <strong className="text-gray-700 dark:text-gray-300">JSON</strong> — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/dashboard">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 h-12 px-7 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-base font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg">
                <Upload className="h-4 w-4" />
                Start extracting free
              </motion.button>
            </Link>
            <a href="#how-it-works">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 h-12 px-7 rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#111] text-gray-700 dark:text-gray-300 text-base font-medium hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                See how it works <ChevronRight className="h-4 w-4" />
              </motion.button>
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm"
        >
          {[
            ['PDF, PNG, JPG, TIFF', 'Supported formats'],
            ['Multi-page support', 'Full document coverage'],
            ['XLSX + CSV + JSON', 'Export formats'],
          ].map(([label, sub]) => (
            <div key={label} className="text-center">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
              <p className="text-gray-400 dark:text-gray-600 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              Everything you need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Enterprise-grade document intelligence without the enterprise complexity.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={item}
                className="rounded-2xl border border-gray-100 dark:border-[#1a1a1a] bg-white dark:bg-[#111] p-6 hover:shadow-md dark:hover:border-[#2a2a2a] transition-all duration-200 group">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative py-20 px-6 bg-gray-50 dark:bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              How it works
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              From upload to structured data in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#111] p-6"
              >
                <div className="text-5xl font-black text-gray-100 dark:text-white/5 mb-3 leading-none">{step.n}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-gray-300 dark:text-gray-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 dark:bg-white mb-6">
            <Layers className="h-7 w-7 text-white dark:text-gray-900" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Ready to extract?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            No sign-up needed. Upload your document and get structured data instantly.
          </p>
          <Link to="/dashboard">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 h-14 px-8 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-xl">
              <Download className="h-5 w-5" />
              Extract now — it's free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-[#1a1a1a] py-8 px-6 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} OCR
        </p>
      </footer>
    </div>
  )
}
