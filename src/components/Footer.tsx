import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full  text-zinc-400 ">
      <div className="mx-auto max-w-7xl border-t border-gray-700 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Main Footer Content Grid */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-4 xl:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold tracking-wider text-white"
            >
              Dev<span className="text-zinc-400">Next</span>
            </Link>
            <p className="text-sm max-w-xs text-zinc-500">
              Building the next generation of web applications with speed and
              modern architecture.
            </p>
          </div>

          {/* Links Section Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Product Links */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Product
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link
                      href="/features"
                      className="text-sm hover:text-white transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/architecture"
                      className="text-sm hover:text-white transition-colors"
                    >
                      Architecture
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Docs Links */}
              <div className="mt-12 md:mt-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Resources
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link
                      href="/docs"
                      className="text-sm hover:text-white transition-colors"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/changelog"
                      className="text-sm hover:text-white transition-colors"
                    >
                      Changelog
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Copyright) */}
        <div className="mt-12 border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} DevNext. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-zinc-600">
            <span>Made with ❤️ using Next.js & Bun</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
