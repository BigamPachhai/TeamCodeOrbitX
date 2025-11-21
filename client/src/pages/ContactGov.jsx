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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 flex-wrap gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                📞 Government Contact
              </h1>
              <p className="text-gray-700 mt-2 text-xl font-semibold whitespace-nowrap">
                Municipal Office Information
              </p>
            </div>
          </div>
          <div className="w-40 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* Contact Cards */}
        <div className="space-y-6 mb-10">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${office.bg} backdrop-blur-sm rounded-3xl shadow-2xl border-2 ${office.border} p-8 transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${office.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${office.color} bg-clip-text text-transparent flex-1`}>
                  {office.name}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-white/80">
                  <div className={`w-10 h-10 bg-gradient-to-br ${office.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Phone</p>
                    <p className="text-gray-900 font-bold">{office.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-white/80">
                  <div className={`w-10 h-10 bg-gradient-to-br ${office.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Email</p>
                    <p className="text-gray-900 font-bold text-sm break-all">{office.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-white/80">
                  <div className={`w-10 h-10 bg-gradient-to-br ${office.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Address</p>
                    <p className="text-gray-900 font-bold">{office.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden mb-10">
          <div className="p-6 border-b-2 border-purple-200">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-600" />
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
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-6">
          <p className="text-sm text-gray-700 font-semibold">
            🏛️ Municipal Corporation Public Service Portal • Direct Government Contact
          </p>
        </div>
      </div>
    </div>
  );
}
