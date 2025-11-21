import { HelpCircle, ChevronDown, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqList = [
    {
      q: "How do I report an issue?",
      a: "Go to the Report page, upload a photo, add description, and submit. You can use AI-powered description generation for convenience.",
    },
    {
      q: "Can I stay anonymous?",
      a: "Yes, you may hide your identity if you prefer. Select the anonymous option when reporting an issue.",
    },
    {
      q: "How does the government review issues?",
      a: "Issues are sent directly to municipal authorities through admin portal. Administrators review and update status in real-time.",
    },
    {
      q: "Do I earn points?",
      a: "Yes. Active reporters earn points and appear on the leaderboard. You earn points for reporting issues, receiving upvotes, and leaving helpful comments.",
    },
    {
      q: "How is location detected?",
      a: "We use GPS-based location detection for accurate reporting. You can also manually select location on the map.",
    },
    {
      q: "What happens after I report?",
      a: "Your report is immediately visible to the community and municipal authorities. Status updates are provided as issues progress through resolution.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 flex-wrap gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                ❓ Frequently Asked Questions
              </h1>
              <p className="text-gray-700 mt-2 text-xl font-semibold whitespace-nowrap">
                Get Answers to Common Questions
              </p>
            </div>
          </div>
          <div className="w-40 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-10">
          {faqList.map((f, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden transition-all duration-300 hover:shadow-2xl"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    openIndex === idx 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-br from-blue-100 to-purple-100'
                  }`}>
                    <CheckCircle className={`w-5 h-5 ${
                      openIndex === idx ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <span className="font-bold text-gray-900 text-lg flex-1">{f.q}</span>
                </div>
                <ChevronDown className={`w-6 h-6 text-gray-600 transition-transform flex-shrink-0 ${
                  openIndex === idx ? 'transform rotate-180' : ''
                }`} />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 pl-20 border-t-2 border-purple-100 pt-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-6">
          <p className="text-sm text-gray-700 font-semibold mb-2">
            Still have questions?
          </p>
          <p className="text-sm text-gray-600">
            Contact us through the Contact page or reach out to municipal authorities directly.
          </p>
        </div>
      </div>
    </div>
  );
}
