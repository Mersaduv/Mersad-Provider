import Image from "next/image";

export function ProductSiteItems() {
  const features = [
    {
      icon: "/images/productSiteItems/ارسال-سریع-1.png",
      title: "FAST DELIVERY",
      description: "ارسال به سراسر کشور",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: "/images/productSiteItems/بهترین-قیمت.png",
      title: "BEST PRICE & QUALITY",
      description: "بهترین قیمت و کیفیت",
      color: "from-green-500 to-blue-600"
    },
    {
      icon: "/images/productSiteItems/محصولات-متنوع.png",
      title: "PRODUCT VARIETY",
      description: "تنوعی بی نظیر از محصولات",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: "/images/productSiteItems/پشتیبانی-2.png",
      title: "SUPPORT",
      description: "پشتیبانی و مشاوره فنی",
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="text-center group">
            <div className="relative mb-4">
              {/* Background gradient circle */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              {/* Icon container */}
              <div className="relative w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
              {feature.title}
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
