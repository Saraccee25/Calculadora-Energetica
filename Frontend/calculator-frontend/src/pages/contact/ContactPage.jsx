"use client"

import { useState } from "react"
import styles from "./ContactPage.module.css"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    console.log("Form submitted:", formData)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      content: "info@calculuz.com",
      description: "Respuesta en 24 horas",
    },
    {
      icon: "📱",
      title: "Teléfono",
      content: "+57 (4) 123-4567",
      description: "Lunes a Viernes 8AM - 6PM",
    },
    {
      icon: "📍",
      title: "Ubicación",
      content: "Medellín, Colombia",
      description: "Universidad de Antioquia",
    },
    {
      icon: "💬",
      title: "Chat en Vivo",
      content: "Disponible 24/7",
      description: "Soporte técnico inmediato",
    },
  ]

  const faqs = [
    {
      question: "¿Cómo funciona CalcuLuz?",
      answer:
        "CalcuLuz utiliza algoritmos precisos para calcular el consumo energético de tus electrodomésticos basándose en su potencia, horas de uso y días de funcionamiento mensual.",
    },
    {
      question: "¿Es gratuito usar la calculadora?",
      answer:
        "Sí, nuestra calculadora básica es completamente gratuita. También ofrecemos funciones avanzadas en nuestro dashboard para usuarios registrados.",
    },
    {
      question: "¿Qué tan precisos son los cálculos?",
      answer:
        "Nuestros cálculos se basan en estándares técnicos y datos de UPME y RETIQ, proporcionando estimaciones con alta precisión para la toma de decisiones.",
    },
    {
      question: "¿Puedo usar CalcuLuz para mi negocio?",
      answer:
        "Absolutamente. CalcuLuz es ideal tanto para hogares como para pequeños y medianos negocios que buscan optimizar su consumo energético.",
    },
  ]

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.highlight}>Contáctanos</span>
            </h1>
            <p className={styles.heroDescription}>
              ¿Tienes preguntas sobre CalcuLuz? Estamos aquí para ayudarte. Nuestro equipo está disponible para resolver
              todas tus dudas sobre eficiencia energética.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className={styles.contactInfo}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Información de Contacto</h2>
          <div className={styles.infoGrid}>
            {contactInfo.map((info, index) => (
              <div key={index} className={styles.infoCard}>
                <div className={styles.infoIcon}>{info.icon}</div>
                <h4 className={styles.infoTitle}>{info.title}</h4>
                <p className={styles.infoContent}>{info.content}</p>
                <span className={styles.infoDescription}>{info.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className={styles.contactForm}>
        <div className={styles.container}>
          <div className={styles.formGrid}>
            <div className={styles.formSection}>
              <h3 className={styles.formTitle}>Envíanos un Mensaje</h3>
              <p className={styles.formDescription}>
                Completa el formulario y nos pondremos en contacto contigo lo antes posible.
              </p>

              {isSubmitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✅</div>
                  <h4>¡Mensaje Enviado!</h4>
                  <p>Gracias por contactarnos. Te responderemos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name">Nombre Completo</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="subject">Asunto</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required>
                      <option value="">Selecciona un asunto</option>
                      <option value="soporte">Soporte Técnico</option>
                      <option value="consulta">Consulta General</option>
                      <option value="sugerencia">Sugerencia</option>
                      <option value="colaboracion">Colaboración</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="message">Mensaje</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      placeholder="Describe tu consulta o mensaje..."
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <span>Enviar Mensaje</span>
                  </button>
                </form>
              )}
            </div>

            <div className={styles.additionalInfo}>
              <div className={styles.supportCard}>
                <div className={styles.supportIcon}>🚀</div>
                <h4>Soporte Rápido</h4>
                <p>
                  Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta técnica o consulta
                  sobre el uso de CalcuLuz.
                </p>
              </div>

              <div className={styles.supportCard}>
                <div className={styles.supportIcon}>📚</div>
                <h4>Recursos Útiles</h4>
                <p>
                  Consulta nuestra documentación y guías para aprovechar al máximo todas las funcionalidades de la
                  plataforma.
                </p>
              </div>

              <div className={styles.supportCard}>
                <div className={styles.supportIcon}>🤝</div>
                <h4>Colaboraciones</h4>
                <p>
                  ¿Interesado en colaborar con nosotros? Contáctanos para explorar oportunidades de partnership y
                  desarrollo conjunto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqCard}>
                <h4 className={styles.faqQuestion}>{faq.question}</h4>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>¿Listo para optimizar tu consumo energético?</h2>
            <p>Comienza a usar CalcuLuz hoy mismo y descubre cuánto puedes ahorrar</p>
            <button className={styles.ctaBtn}>Probar CalcuLuz</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
