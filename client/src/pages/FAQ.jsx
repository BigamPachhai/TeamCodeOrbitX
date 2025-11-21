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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                Frequently Asked Questions
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Get Answers to Common Questions
              </p>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 mb-8">
          {faqList.map((f, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                    openIndex === idx 
                      ? 'bg-[#003865]' 
                      : 'bg-gray-200'
                  }`}>
                    <CheckCircle className={`w-4 h-4 ${
                      openIndex === idx ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm flex-1">{f.q}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${
                  openIndex === idx ? 'transform rotate-180' : ''
                }`} />
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 pl-16 border-t border-gray-200 pt-5 bg-gray-50">
                  <p className="text-gray-700 text-sm leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center bg-white border border-gray-200 p-5">
          <p className="text-xs text-gray-600 font-semibold mb-2">
            Still have questions?
          </p>
          <p className="text-xs text-gray-500">
            Contact us through the Contact page or reach out to municipal authorities directly.
          </p>
        </div>
      </div>
    </div>
  );
}
