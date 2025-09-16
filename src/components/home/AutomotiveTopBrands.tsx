import SectionHeader from "./SectionHeader";

interface AutomotiveTopBrandsProps {
  title?: string;
}

export default function AutomotiveTopBrands({ title = "Top Automotive Brands" }: AutomotiveTopBrandsProps) {
  const automotiveBrands = [
    { id: 1, name: "Bosch", logo: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png", followers: "1.8M" },
    { id: 2, name: "Michelin", logo: "/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png", followers: "1.5M" },
    { id: 3, name: "Castrol", logo: "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png", followers: "980K" },
    { id: 4, name: "3M", logo: "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png", followers: "750K" },
    { id: 5, name: "K&N", logo: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png", followers: "650K" },
    { id: 6, name: "Garmin", logo: "/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png", followers: "580K" }
  ];

  return (
    <div className="bg-white mb-1">
      <SectionHeader title={title} viewAllLink="/brands" />
      
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-4">
          {automotiveBrands.map((brand) => (
            <div key={brand.id} className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border border-gray-200">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{brand.name}</p>
              <p className="text-xs text-gray-500">{brand.followers} followers</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}