import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Bell, ArrowRight, MapPin, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Precise Geofencing',
    desc: 'Set reminder zones from 50m to 5km around any point on Earth.',
    icon: <Map size={32} color="var(--primary-purple)" />,
    gradient: 'linear-gradient(135deg, #8B5CF620, #9333EA10)'
  },
  {
    title: 'Real-time Tracking',
    desc: 'Browser GPS watchPosition keeps you tracked silently and efficiently.',
    icon: <MapPin size={32} color="var(--secondary-orange)" />,
    gradient: 'linear-gradient(135deg, #F9731620, #EA580C10)'
  },
  {
    title: 'Smart Notifications',
    desc: 'Instant browser push alerts the moment you enter your marked zone.',
    icon: <Bell size={32} color="var(--primary-purple)" />,
    gradient: 'linear-gradient(135deg, #8B5CF620, #9333EA10)'
  },
  {
    title: 'Secure & Private',
    desc: 'JWT-authenticated accounts. Your reminders stay yours — always.',
    icon: <Shield size={32} color="var(--secondary-orange)" />,
    gradient: 'linear-gradient(135deg, #F9731620, #EA580C10)'
  },
  {
    title: 'Live Map View',
    desc: 'Visualize all your reminder zones on an interactive Leaflet map.',
    icon: <Map size={32} color="var(--primary-purple)" />,
    gradient: 'linear-gradient(135deg, #8B5CF620, #9333EA10)'
  },
  {
    title: 'Instant Setup',
    desc: 'Create, manage, and delete reminders in seconds. No friction.',
    icon: <Zap size={32} color="var(--secondary-orange)" />,
    gradient: 'linear-gradient(135deg, #F9731620, #EA580C10)'
  }
];

const Home = () => {
  return (
    <div style={{ width: '100%' }}>

      {/* Hero Section */}
      <div
        className="main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)',
          padding: '4rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)',
          filter: 'blur(40px)', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent)',
          filter: 'blur(40px)', zIndex: 0
        }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '750px', position: 'relative', zIndex: 1 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginBottom: '2.5rem' }}>
            <motion.div animate={{ rotate: [0, 12, -12, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <Map size={72} color="var(--primary-purple)" />
            </motion.div>
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
              <Bell size={72} color="var(--secondary-orange)" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(249,115,22,0.1))',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '50px',
              padding: '0.4rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--primary-purple)',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              📍 Location-Aware Reminders
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--primary-purple), var(--secondary-orange))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Never forget anything, anywhere.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              lineHeight: '1.7',
              marginBottom: '2.5rem',
              maxWidth: '580px',
              margin: '0 auto 2.5rem auto'
            }}
          >
            LocaMinder uses your phone's GPS to trigger instant reminders exactly when you arrive at — or leave — a specific location.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ fontSize: '1.1rem', padding: '0.9rem 2.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard"
                className="btn"
                style={{
                  fontSize: '1.1rem', padding: '0.9rem 2.2rem',
                  background: 'transparent',
                  border: '2px solid var(--primary-purple)',
                  color: 'var(--primary-purple)',
                  display: 'flex', alignItems: 'center', gap: '0.6rem'
                }}
              >
                <MapPin size={20} /> View Dashboard
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div style={{ background: 'var(--bg-white)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '1rem' }}>
              Everything you need
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Powerful features built for real-world location awareness.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card"
                style={{ background: feat.gradient, border: '1px solid var(--border-color)', textAlign: 'left' }}
              >
                <div style={{ marginBottom: '1rem' }}>{feat.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                  {feat.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-purple), #7C3AED)',
        padding: '5rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Ready to get started?</h2>
          <p style={{ fontSize: '1.15rem', opacity: 0.85, marginBottom: '2rem' }}>
            Create your free account and set your first location reminder in under 60 seconds.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
            <Link
              to="/login"
              className="btn"
              style={{
                background: 'var(--secondary-orange)',
                color: 'white',
                fontSize: '1.1rem',
                padding: '0.9rem 2.5rem',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                boxShadow: '0 8px 30px rgba(249,115,22,0.4)'
              }}
            >
              Create Account <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'var(--text-dark)',
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        padding: '2rem',
        fontSize: '0.9rem'
      }}>
        <p>© 2026 <span style={{ color: 'var(--secondary-orange)', fontWeight: '600' }}>LocaMinder</span>. Built with ❤️ using React + Node.js</p>
      </footer>
    </div>
  );
};

export default Home;
