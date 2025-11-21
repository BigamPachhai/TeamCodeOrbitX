export default function FAQ() {
  const faqList = [
    {
      q: "How do I report an issue?",
      a: "Go to the Report page, upload a photo, add description, and submit.",
    },
    {
      q: "Can I stay anonymous?",
      a: "Yes, you may hide your identity if you prefer.",
    },
    {
      q: "How does the government review issues?",
      a: "Issues are sent directly to municipal authorities through admin portal.",
    },
    {
      q: "Do I earn points?",
      a: "Yes. Active reporters earn points and appear on the leaderboard.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqList.map((f, idx) => (
          <details
            key={idx}
            className="bg-gray-100 p-4 rounded-lg border-l-4 border-blue-800"
          >
            <summary className="font-semibold text-blue-900 cursor-pointer">
              {f.q}
            </summary>
            <p className="mt-2 text-gray-700">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
