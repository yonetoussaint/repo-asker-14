import React, { useState, useRef } from 'react';
import { ThumbsUp, MessageSquare, Share, MoreHorizontal, Store } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import SectionHeader from './SectionHeader';

const PostCard = ({
  vendorData,
  title,
  postDescription,
  displayProducts,
  likeCount,
  commentCount,
  shareCount
}) => {
  const [liked, setLiked] = useState(false);
  const carouselRef = useRef(null);

  const handleLike = () => setLiked(!liked);
  const handleComment = () => console.log('Comment clicked');
  const handleShare = () => console.log('Share clicked');

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
    <div className="w-full flex-shrink-0 overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Vendor Info Header */}
      <div className="flex items-center p-3 border-b border-gray-100">
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
              {title || vendorData.vendorName}
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
        <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          Follow
        </button>
        <Button variant="ghost" size="icon" className="ml-1 rounded-full h-6 w-6">
          <MoreHorizontal className="text-gray-600 h-3 w-3" />
        </Button>
      </div>

      {/* Post Description */}
      <div className="px-3 py-2 text-gray-800 text-sm">
        <p className="whitespace-pre-line line-clamp-3">{postDescription}</p>
      </div>

      {/* Products Carousel */}
      <div className="relative w-full px-1 py-2 bg-gray-50">
        <div
          className="flex overflow-x-auto gap-2 pb-2 pt-1 snap-x snap-mandatory"
          ref={carouselRef}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: '8px',
            paddingRight: '8px',
            scrollSnapType: 'x mandatory'
          }}
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow"
              style={{
                width: 'calc(40% - 8px)',
                minWidth: '100px',
                scrollSnapAlign: 'center'
              }}
            >
              {/* Product Image with Overlay */}
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt="Product"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Discount Tag */}
                {product.discount && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-br-lg z-10">
                    {product.discount} OFF
                  </div>
                )}
                {/* Price Info Overlay */}
                <div className="absolute bottom-0 w-full px-1 py-1 bg-gradient-to-t from-black/70 to-transparent text-white flex items-center justify-between text-xs z-10">
                  <span className="font-bold text-xs text-red-400">{product.currentPrice}</span>
                  {product.originalPrice && (
                    <span className="line-through text-gray-300 text-xs">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facebook style engagement stats */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="bg-blue-500 rounded-full p-0.5">
            <ThumbsUp className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-xs text-gray-500">{likeCount}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{commentCount} comments</span>
          <span>{shareCount} shares</span>
        </div>
      </div>

      {/* Enhanced Social Buttons - Moved to Bottom */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex-1">
          <button
            onClick={handleLike}
            className="flex items-center justify-center gap-1 group transition-colors w-full py-1.5 hover:bg-gray-100 rounded-md"
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`} />
            <span className={`text-xs ${liked ? 'font-medium text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`}>
              Like
            </span>
          </button>
        </div>

        <div className="flex-1">
          <button
            onClick={handleComment}
            className="flex items-center justify-center gap-1 group transition-colors w-full py-1.5 hover:bg-gray-100 rounded-md"
          >
            <MessageSquare className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
            <span className="text-xs text-gray-600 group-hover:text-gray-800">
              Comment
            </span>
          </button>
        </div>

        <div className="flex-1">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1 group transition-colors w-full py-1.5 hover:bg-gray-100 rounded-md"
          >
            <Share className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
            <span className="text-xs text-gray-600 group-hover:text-gray-800">
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface VendorProductCarouselProps {
  title: string;
  products: any[];
  onProductClick?: (productId: string) => void;
}

const VendorProductCarousel: React.FC<VendorProductCarouselProps> = ({
  title,
  products,
  onProductClick,
}) => {
  // Helper function to get seller logo URL from Supabase storage
  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";

    const { data } = supabase.storage
      .from('seller-logos')
      .getPublicUrl(imagePath);

    return data.publicUrl;
  };

  // Helper function to get product image URL from Supabase storage
  const getProductImageUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);

    return data.publicUrl;
  };

  // Sample data with Supabase storage URLs
  const posts = [
    {
      id: 1,
      vendorData: {
        profilePic: getSellerLogoUrl("20250322_230219.jpg"),
        vendorName: "Tech Store Pro",
        verified: true,
        followers: "12.5K",
        publishedAt: "2024-01-15T10:30:00Z"
      },
      title: "Latest Tech Deals",
      postDescription: "Check out our amazing deals on the latest gadgets! Perfect for tech enthusiasts and professionals. Limited time offers available now.",
      displayProducts: [
        {
          id: 1,
          image: getProductImageUrl("b6e05212-a0ba-4958-8b95-858f72d907a8/1753454025995-4-1000235215.webp"),
          discount: "20%",
          currentPrice: "$299",
          originalPrice: "$399"
        },
        {
          id: 2,
          image: getProductImageUrl("b6e05212-a0ba-4958-8b95-858f72d907a8/1753454025995-3-1000235214.webp"),
          discount: "15%",
          currentPrice: "$599",
          originalPrice: "$699"
        },
        {
          id: 3,
          image: getProductImageUrl("b6e05212-a0ba-4958-8b95-858f72d907a8/1753454025995-2-1000235213.webp"),
          currentPrice: "$199",
          originalPrice: null
        }
      ],
      likeCount: 245,
      commentCount: 32,
      shareCount: 18
    },
    {
      id: 2,
      vendorData: {
        profilePic: getSellerLogoUrl("20250322_230219.jpg"),
        vendorName: "Fashion Forward",
        verified: true,
        followers: "8.3K",
        publishedAt: "2024-01-14T15:45:00Z"
      },
      title: "Summer Collection 2024",
      postDescription: "Discover our stunning summer collection! Fresh styles, vibrant colors, and comfortable fits for every occasion.",
      displayProducts: [
        {
          id: 4,
          image: getProductImageUrl("61aeccd8-b9e6-4ec3-be16-4d055de6ee37/1753453908730-0-1000235206.webp"),
          discount: "30%",
          currentPrice: "$79",
          originalPrice: "$115"
        },
        {
          id: 5,
          image: getProductImageUrl("8e799c18-6619-4ae5-92cf-b433ebe65f14/1753453798075-0-1000235205.webp"),
          currentPrice: "$129",
          originalPrice: null
        }
      ],
      likeCount: 189,
      commentCount: 24,
      shareCount: 11
    },
    {
      id: 3,
      vendorData: {
        profilePic: getSellerLogoUrl("20250322_230219.jpg"),
        vendorName: "Home & Garden",
        verified: false,
        followers: "5.1K",
        publishedAt: "2024-01-13T09:20:00Z"
      },
      title: "Transform Your Space",
      postDescription: "Beautiful home decor items to transform your living space. Quality furniture and accessories at unbeatable prices.",
      displayProducts: [
        {
          id: 6,
          image: getProductImageUrl("c4e5f01a-b006-40e1-a5d6-6606876ee92a/1747588517198-0-happy valentine day.png"),
          discount: "25%",
          currentPrice: "$149",
          originalPrice: "$199"
        },
        {
          id: 7,
          image: getProductImageUrl("51e6186d-dba4-46b2-a4bd-df91caa67f18/1746944042020-0-1000160403.jpg"),
          currentPrice: "$89",
          originalPrice: null
        },
        {
          id: 8,
          image: getProductImageUrl("ea4313bd-c64d-4787-8945-e509afe0fecd/1746940357735-4-1000157152.jpg"),
          discount: "10%",
          currentPrice: "$259",
          originalPrice: "$289"
        }
      ],
      likeCount: 156,
      commentCount: 19,
      shareCount: 7
    }
  ];

  return (
    <div className="w-full bg-white">
      <SectionHeader
        title="Vendor Posts"
        icon={Store}
        viewAllLink="/vendors"
        viewAllText="View All Vendors"
      />

      {/* Edge-to-edge container for scrolling, with left padding pl-2 */}
      <div
        className="flex overflow-x-auto pl-2 scrollbar-none w-full"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '8px'
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex-shrink-0 mr-[3vw]"
            style={{
              width: 'calc(100vw - 3rem)',
              maxWidth: '320px',
              scrollSnapAlign: 'start'
            }}
          >
            <PostCard
              vendorData={post.vendorData}
              title={post.title}
              postDescription={post.postDescription}
              displayProducts={post.displayProducts}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              shareCount={post.shareCount}
            />
          </div>
        ))}

        {/* Add right spacing for proper scrolling to the end */}
        <div className="flex-shrink-0 w-2"></div>
      </div>

      {/* Hide scrollbar for webkit browsers */}
      <style>{`
        .flex.overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default VendorProductCarousel;