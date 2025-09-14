import logo from "../assets/al-waleed-clinic-logo.png";

const Header = () => {
  // Get today's date in a readable format
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div>
      <header className="bg-white shadow-lg border-b-4 border-[#1c3f60]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo Space */}
            <div className="">
              <img src={logo} alt="Al Waleed Clinic" className="h-12 w-36" />
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex text-right items-center space-x-4">
                <p className="font-semibold text-gray-900">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
