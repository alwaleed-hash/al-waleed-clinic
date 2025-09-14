const Loader = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1c3f60]"></div>
      <span className="ml-2 text-gray-700">Loading...</span>
    </div>
  );
};

export default Loader;
