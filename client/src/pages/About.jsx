export default function About() {
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-red-700 mb-6">About This Portal</h1>

      <p className="text-gray-700 leading-relaxed mb-6">
        The Rupandehi Public Issue Reporting Portal is a citizen-focused digital
        platform created to improve transparency, accountability, and efficiency
        across local government bodies. It enables residents to report local
        issues such as waste, damaged roads, drinking water problems, electrical
        failures, and more.
      </p>

      <h2 className="text-2xl text-blue-800 font-semibold mb-3">Our Mission</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
        <li>Improve public service delivery</li>
        <li>Empower citizens through real-time reporting</li>
        <li>Enhance transparency between citizens and government</li>
        <li>Streamline issue resolution workflows</li>
      </ul>

      <h2 className="text-2xl text-blue-800 font-semibold mb-3">Key Features</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>AI-powered description generation</li>
        <li>GPS-based location detection</li>
        <li>Heatmap visualization of issues</li>
        <li>Leaderboard for active contributors</li>
        <li>Admin dashboard for issue resolution</li>
      </ul>
    </div>
  );
}
