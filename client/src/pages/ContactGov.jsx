import { Phone, Mail, MapPin, Building2 } from "lucide-react";

export default function ContactGov() {
  const offices = [
    {
      name: "District Administration Office, Rupandehi",
      phone: "071-520111",
      email: "info@daorupandehi.gov.np",
      address: "Butwal, Rupandehi",
      color: "from-blue-500 to-indigo-600",
      border: "border-blue-300",
      bg: "from-blue-50 to-indigo-50",
    },
    {
      name: "Butwal Sub-metropolitan City",
      phone: "071-540440",
      email: "info@butwalmun.gov.np",
      address: "Butwal, Rupandehi",
      color: "from-purple-500 to-pink-600",
      border: "border-purple-300",
      bg: "from-purple-50 to-pink-50",
    },
    {
      name: "Lumbini Sanskritik Municipality",
      phone: "071-404818",
      email: "info@lumbinimun.gov.np",
      address: "Lumbini, Rupandehi",
      color: "from-green-500 to-emerald-600",
      border: "border-green-300",
      bg: "from-green-50 to-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                Government Contact
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Municipal Office Information
              </p>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="space-y-5 mb-8">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-start gap-4 mb-5 border-b border-gray-200 pb-4">
                <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-[#003865] flex-1">
                  {office.name}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded">
                  <div className="w-10 h-10 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Phone</p>
                    <p className="text-gray-900 font-semibold text-sm">{office.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded">
                  <div className="w-10 h-10 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Email</p>
                    <p className="text-gray-900 font-semibold text-xs break-all">{office.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded">
                  <div className="w-10 h-10 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Address</p>
                    <p className="text-gray-900 font-semibold text-sm">{office.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-[#003865] flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Map
            </h3>
          </div>
          <iframe
            className="w-full h-96"
            src="https://maps.google.com/maps?q=Butwal&t=&z=13&ie=UTF8&iwloc=&output=embed"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Footer */}
        <div className="text-center bg-white border border-gray-200 p-5">
          <p className="text-xs text-gray-600 font-medium">
            Municipal Corporation Public Service Portal • Direct Government Contact
          </p>
          <p className="text-xs text-gray-500 mt-1">
            नेपाल सरकार | Government of Nepal
          </p>
        </div>
      </div>
    </div>
  );
}
