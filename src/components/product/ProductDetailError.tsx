const ProductDetailError = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
      <p className="text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
    </div>
  );
};

export default ProductDetailError;