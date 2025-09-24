import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LucideIcon, MoreHorizontal } from "lucide-react"; // Added MoreHorizontal
import { useTranslation } from 'react-i18next';
import TabsNavigation from "./TabsNavigation";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  viewAllLink?: string;
  viewAllText?: string;
  titleTransform?: "uppercase" | "capitalize" | "none";
  // Clear button props
  showClearButton?: boolean;
  clearButtonText?: string;
  onClearClick?: () => void;
  // New props for tabs functionality
  showTabs?: boolean;
  tabs?: Array<{ id: string; label: string }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  tabsStyle?: "default" | "glassmorphic";
  // New props for vendor header functionality
  showVendorHeader?: boolean;
  vendorData?: {
    profilePic: string;
    vendorName: string;
    verified: boolean;
    followers: string;
    publishedAt: string;
  };
  onFollowClick?: () => void;
}

export default function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  viewAllLink,
  viewAllText,
  titleTransform = "uppercase",
  // Clear button props
  showClearButton = false,
  clearButtonText = "× Clear",
  onClearClick,
  // Tabs props
  showTabs = false,
  tabs = [],
  activeTab,
  onTabChange,
  tabsStyle = "default",
  // Vendor header props
  showVendorHeader = false,
  vendorData,
  onFollowClick
}: SectionHeaderProps) {
  const { t } = useTranslation('product');

  const defaultViewAllText = viewAllText || t('viewAll');

  const timeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const Button = ({ variant, size, className, children, ...props }) => (
    <button
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col">
      {/* Vendor Header Section - Only shown when showVendorHeader is true */}
      {showVendorHeader && vendorData && (
        <div className="flex items-center p-3 border-b border-gray-100 bg-white">
          <div className="flex-shrink-0 mr-2 rounded-full overflow-hidden w-8 h-8">
            <img
              src={vendorData.profilePic}
              alt={vendorData.vendorName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-gray-800 text-sm truncate">
                {vendorData.vendorName}
              </h3>
              {vendorData.verified && (
                <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-gray-500 text-xs truncate">
              {vendorData.followers} followers • {timeAgo(vendorData.publishedAt)}
            </p>
          </div>
          <button 
            onClick={onFollowClick}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium transition-colors"
          >
            Follow
          </button>
          <Button variant="ghost" size="icon" className="ml-1 rounded-full h-6 w-6">
            <MoreHorizontal className="text-gray-600 h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Original Header section with padding - Only shown when NOT showing vendor header */}
      {!showVendorHeader && (
        <div className="h-7 flex items-center px-2">
          <div className="flex items-center justify-between w-full">
            {/* First element (Title with Icon) */}
            <div className={`flex items-center gap-1 text-xs font-bold tracking-wide ${titleTransform === 'uppercase' ? 'uppercase' : titleTransform === 'capitalize' ? 'capitalize' : ''}`}>
              {Icon && <Icon className="w-4 h-4" />}
              {title}
            </div>

            {/* Last element (Clear button and View All) */}
            <div className="flex items-center gap-2">
              {showClearButton && onClearClick && (
                <button 
                  onClick={onClearClick}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {clearButtonText}
                </button>
              )}
              {viewAllLink && (
                <Link
                  to={viewAllLink}
                  className="text-xs hover:underline flex items-center font-medium transition-colors"
                >
                  {defaultViewAllText}
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation - Outside the padded container for edge-to-edge scrolling */}
      {showTabs && tabs.length > 0 && activeTab && onTabChange && (
        <div className={tabsStyle === "glassmorphic" ? "mt-1" : "mt-2"}>
          <TabsNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            style={tabsStyle === "glassmorphic" ? {
              backgroundColor: 'white',
            } : undefined}
          />
        </div>
      )}
    </div>
  );
}