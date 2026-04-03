import { Mail, MapPin } from "lucide-react";
import { Facebook, Instagram, Youtube } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-gradient-to-r from-amber-900 to-orange-800 text-amber-50 py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
        {/* Left side - Contact Info */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <a 
            href="https://maps.app.goo.gl/zgA9WXL5JB44xTNNA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-amber-200 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Hasthampatti, Salem-636008</span>
          </a>
          <span className="hidden sm:inline text-amber-400">|</span>
          <span className="flex items-center gap-1">
            <span>FSSAI: 22425581000151</span>
          </span>
          <span className="hidden sm:inline text-amber-400">|</span>
          <a 
            href="mailto:mckfoods@gmail.com" 
            className="flex items-center gap-1 hover:text-amber-200 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>mckfoods@gmail.com</span>
          </a>
        </div>

        {/* Right side - Social Media Links */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/share/15tPHsWJCR/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-200 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href="https://www.instagram.com/mango_city_kitchen/?utm_source=qr&igsh=MzNlNGNkZWQ4Mg%3D%3D&fbclid=IwZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMzUwNjg1NTMxNzI4AAEejCvU2kYTt0VPOfFazySp2AZ8vGHjwqfk3PalqSCf7v9aVZi8cZ6bXOFDHlE_aem_U-4ASr6QwVJgaA3ZwzojTQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-200 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="https://youtube.com/@mangocitykitchen?si=AB2iIN2Ocvzvifai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-200 transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;