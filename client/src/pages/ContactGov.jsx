export default function ContactGov() {
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Government Contact</h1>

      <div className="space-y-6">
        <div className="border-l-4 border-blue-800 pl-4">
          <h2 className="text-2xl font-semibold text-blue-900">
            District Administration Office, Rupandehi
          </h2>
          <p className="text-gray-700 mt-1">Phone: 071-520111</p>
          <p className="text-gray-700">Email: info@daorupandehi.gov.np</p>
          <p className="text-gray-700">Address: Butwal, Rupandehi</p>
        </div>

        <div className="border-l-4 border-blue-800 pl-4">
          <h2 className="text-2xl font-semibold text-blue-900">
            Butwal Sub-metropolitan City
          </h2>
          <p className="text-gray-700 mt-1">Phone: 071-540440</p>
          <p className="text-gray-700">Email: info@butwalmun.gov.np</p>
        </div>

        <div className="border-l-4 border-blue-800 pl-4">
          <h2 className="text-2xl font-semibold text-blue-900">
            Lumbini Sanskritik Municipality
          </h2>
          <p className="text-gray-700 mt-1">Phone: 071-404818</p>
          <p className="text-gray-700">Email: info@lumbinimun.gov.np</p>
        </div>
      </div>

      <iframe
        className="w-full h-72 rounded-lg mt-8"
        src="https://maps.google.com/maps?q=Butwal&t=&z=13&ie=UTF8&iwloc=&output=embed"
      ></iframe>
    </div>
  );
}
