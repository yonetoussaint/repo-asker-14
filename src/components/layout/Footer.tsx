
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  CreditCard,
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  MapPin
} from "lucide-react";

const paymentMethods = [
  "https://placehold.co/60x40/FFFFFF/000000?text=Visa",
  "https://placehold.co/60x40/FFFFFF/000000?text=MC",
  "https://placehold.co/60x40/FFFFFF/000000?text=Amex",
  "https://placehold.co/60x40/FFFFFF/000000?text=PayPal"
];

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      {/* Trust badges */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto py-6 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-3">
              <Truck className="h-8 w-8 text-red-500 mb-2" />
              <h4 className="font-medium text-sm">Free Shipping</h4>
              <p className="text-xs text-gray-600 mt-1">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <ShieldCheck className="h-8 w-8 text-red-500 mb-2" />
              <h4 className="font-medium text-sm">Secure Payment</h4>
              <p className="text-xs text-gray-600 mt-1">100% secure payments</p>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <HeadphonesIcon className="h-8 w-8 text-red-500 mb-2" />
              <h4 className="font-medium text-sm">24/7 Support</h4>
              <p className="text-xs text-gray-600 mt-1">Dedicated support</p>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <CreditCard className="h-8 w-8 text-red-500 mb-2" />
              <h4 className="font-medium text-sm">Money Back</h4>
              <p className="text-xs text-gray-600 mt-1">30 day guarantee</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-red-500 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white text-center md:text-left">
              <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
              <p className="text-white/80 mt-1">Get the latest updates on new products and special sales</p>
            </div>
            <div className="flex w-full md:w-auto">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="rounded-r-none border-white/20 focus-visible:ring-white/30 bg-white/10 text-white placeholder:text-white/60"
              />
              <Button className="rounded-l-none bg-white text-red-500 hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-gray-600 text-sm mb-4">
              ShopNow offers a wide selection of high-quality products at competitive prices. We're dedicated to providing an excellent shopping experience.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Order Status</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Payment Methods</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-red-500 transition-colors">Blog</Link></li>
              <li><Link to="/admin" className="text-gray-600 hover:text-red-500 transition-colors">Admin</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">123 E-Commerce St, Shopping Mall, CA 92103, United States</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                <a href="mailto:info@shopnow.com" className="text-gray-600 hover:text-red-500">info@shopnow.com</a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">We Accept</h4>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt="Payment Method" 
                    className="h-6 border rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom footer */}
      <div className="bg-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-sm text-gray-600">
            <p>© 2025 ShopNow. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <Link to="#" className="hover:text-red-500">Privacy Policy</Link>
              <Link to="#" className="hover:text-red-500">Terms of Service</Link>
              <Link to="#" className="hover:text-red-500">Cookies Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
