import { useState } from "react";
import { ChevronDown, ChevronUp, Star, Quote } from "lucide-react";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group">
      <button
        className="flex justify-between items-center w-full py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-4 hover:bg-white/50 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
          {question}
        </span>
        <div className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-6 w-6 text-blue-600 transform transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transform transition-transform duration-200" />
          )}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <div className="px-4">
          <p className="text-gray-600 leading-relaxed text-base">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ quote, name, role, rating = 5, gradient }) => {
  return (
    <div className="group relative">
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-2xl transform group-hover:scale-105 transition-all duration-300`}
      ></div>

      {/* Card content */}
      <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
        {/* Quote icon */}
        <div className="flex justify-between items-start mb-6">
          <Quote className="h-8 w-8 text-blue-600 opacity-20" />
          <div className="flex space-x-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>

        {/* Testimonial text */}
        <p className="text-gray-700 mb-8 text-base leading-relaxed font-medium">
          "{quote}"
        </p>

        {/* Author info */}
        <div className="flex items-center">
          <div
            className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-full flex-shrink-0 mr-4 flex items-center justify-center shadow-lg`}
          >
            <span className="text-white font-bold text-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{name}</p>
            <p className="text-sm text-gray-500 font-medium">{role}</p>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-30"></div>
        <div className="absolute top-8 right-6 w-1 h-1 bg-indigo-400 rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

const ImprovedSections = () => {
  const faqs = [
    {
      question: "How do I get started with Mentora?",
      answer:
        "Getting started is simple! Sign up for a free account, complete the onboarding process, and you'll have access to your intuitive dashboard where you can create your first course or join existing ones.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes! Our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store to access your courses on the go.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide 24/7 customer support through live chat, email, and phone. Additionally, we have an extensive knowledge base and video tutorials to help you make the most of Mentora.",
    },
    {
      question: "Can I integrate with other tools?",
      answer:
        "Absolutely! Mentora integrates with popular tools like Zoom, Google Workspace, Microsoft Teams, and other learning platforms. We also offer API access for custom integrations.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Mentora has completely transformed our online curriculum. The intuitive design and powerful features made our transition to remote learning seamless.",
      name: "Jane Doe",
      role: "Head of Academics, XYZ University",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      quote:
        "The ability to track student progress in real-time has been a game-changer. I can now identify and help struggling students much faster.",
      name: "John Smith",
      role: "Corporate Trainer, Tech Corp",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      quote:
        "As a student, I love having all my courses and materials in one place. The user interface is clean and easy to navigate.",
      name: "Emily White",
      role: "University Student",
      gradient: "from-green-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Testimonials Section */}
      <section className="py-20 px-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-semibold text-sm mb-6">
              <Star className="h-4 w-4 mr-2" />
              Trusted by thousands
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                What Our Users
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Are Saying
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join thousands of educators and students who have transformed
              their learning experience
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                gradient={testimonial.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-gray-50 to-white relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-800 font-semibold text-sm mb-6">
              Have questions?
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                Frequently Asked
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about Mentora
            </p>
          </div>

          {/* FAQ items */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="divide-y divide-gray-200/50">
                {faqs.map((faq, index) => (
                  <FaqItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="relative z-10 text-center px-8">
          <div className="max-w-4xl mx-auto">
            {/* Floating badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold text-sm mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
              Join 50,000+ satisfied users
            </div>

            <h2 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Ready to Get
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Started?
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your learning experience today. Join thousands of
              educators and students who are already ahead of the curve.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                className="group bg-white text-blue-600 px-12 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-50 flex items-center"
              >
                Sign Up Now
                <div className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
                  →
                </div>
              </a>

              <a
                href="/demo"
                className="group bg-transparent text-white px-12 py-4 rounded-full font-bold text-lg border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Watch Demo
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-blue-200 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Free 14-day trial
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                No credit card required
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImprovedSections;
