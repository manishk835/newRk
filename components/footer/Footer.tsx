import Link from "next/link";
import { footerLinks } from "./footerData";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold">RK Fashion</h2>
          <p className="text-sm mt-3">
            Affordable fashion for everyone.  
            Quality clothes at the best price.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.quickLinks.map(link => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-3">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.support.map(link => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.social.map(link => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-white">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} RK Fashion House. All rights reserved.
      </div>
    </footer>
  );
}
