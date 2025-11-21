export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-16">
      <div className="max-w-5xl mx-auto text-center px-4">
        <p className="text-lg font-semibold">
          Government of Nepal • Rupandehi District Administration
        </p>
        <p className="text-sm mt-2 text-blue-200">
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
