import { FaInstagram, FaYoutube, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Address and Phone */}
        <div className="text-center md:text-left">
          <p className="flex items-center gap-2 justify-center md:justify-start">
            <FaMapMarkerAlt /> Dheypurti Academy, krishi utpan bajar samiti, marketyard shrigonda, Maharashtra
          </p>
          <p className="mt-2 flex items-center gap-2 justify-center md:justify-start">
            📞 +91 9834874114
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 justify-center">
          <a
            href="https://www.instagram.com/dhyeypurti_ganit_academy_01?igsh=dW40NWVxb2k3bXJo" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-pink-500 hover:bg-pink-600 p-3 rounded-full transition-colors duration-300"
          >
            <FaInstagram size={20} />
          </a>

          <a
            href="https://www.youtube.com/@dheypurtiacademy" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-red-600 hover:bg-red-700 p-3 rounded-full transition-colors duration-300"
          >
            <FaYoutube size={20} />
          </a>

          <a
            href="https://maps.app.goo.gl/Pfv1KSqshzjj5vS98?g_st=ipc" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-green-600 hover:bg-green-700 p-3 rounded-full transition-colors duration-300"
          >
            <FaMapMarkerAlt size={20} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-center text-gray-400 text-sm">
        © 2025 Dheypurti Academy. All rights reserved.
      </p>
    </footer>
  );
}
