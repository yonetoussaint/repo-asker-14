
import React from "react";
import { cn } from "@/lib/utils";
import { 
  Package, 
  Image as ImageIcon, 
  Layout, 
  Settings, 
  Users,
  BarChart3, 
  ShoppingCart,
  Grid
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminSidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, activeTab, onTabChange }) => {
  const menuItems = [
    { id: "products", label: "Products", icon: Package },
    { id: "product-images", label: "Product Images", icon: ImageIcon },
    { id: "categories", label: "Categories", icon: Grid },
    { id: "hero-banners", label: "Hero Banners", icon: Layout },
    // Additional tabs that could be implemented in the future
    { id: "orders", label: "Orders", icon: ShoppingCart, disabled: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, disabled: true },
    { id: "customers", label: "Customers", icon: Users, disabled: true },
    { id: "settings", label: "Settings", icon: Settings, disabled: true }
  ];
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => onTabChange(activeTab)} // This will close the sidebar on mobile
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-20",
          isOpen ? "w-64" : "w-0 overflow-hidden",
          "md:relative md:translate-x-0", // Always visible on desktop
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" // Slide animation on mobile
        )}
      >
      <div className="flex flex-col h-full">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p className="text-sm text-gray-500">Manage your store</p>
        </div>
        
        <ScrollArea className="flex-1">
          <nav className="p-2">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => !item.disabled && onTabChange(item.id)}
                    className={cn(
                      "flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors",
                      activeTab === item.id 
                        ? "bg-gray-100 text-gray-900" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      item.disabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={item.disabled}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.label}</span>
                    {item.disabled && (
                      <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminSidebar;
