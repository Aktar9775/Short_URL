import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-900">
            URL Shortener
          </h1>

          {/* Navigation */}
          <nav className="flex gap-4">
           
            <Link 
              to="/login" 
              className="text-white bg-blue-900 hover:bg-blue-600 font-medium px-4 py-2 rounded-lg transition duration-300">
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-blue-900 border border-blue-900 hover:bg-blue-600 hover:text-white font-medium px-4 py-2 rounded-lg transition duration-300">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[500px] flex flex-col justify-center items-center text-center px-4"
        style={{
          backgroundImage: `url('https://scitechdaily.com/images/Spintronic-Neurons-Concept.gif')`
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Shorten Your Links <br /> Instantly and Easily!
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Create shorter, more manageable links for better sharing and tracking.
          </p>
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Why Use Our Shortener?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <img 
                src="https://cdn.prod.website-files.com/5eb25de94cee6c29635fe867/6196b69e306281dad6cab374_ease%20of%20use.png" 
                alt="Easy to Use"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Easy to Use
              </h3>
              <p className="text-gray-600 text-center">
                Simple interface to shorten URLs quickly and easily.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/8386/8386306.png" 
                alt="Track Performance"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Track Performance
              </h3>
              <p className="text-gray-600 text-center">
                See how your links are performing with real-time data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <img 
                src="https://img.freepik.com/free-vector/shield_78370-582.jpg" 
                alt="Secure and Reliable"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Secure and Reliable
              </h3>
              <p className="text-gray-600 text-center">
                All links are secure and work seamlessly across all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-6xl mx-auto px-6 flex justify-between">
          <p>&copy; {new Date().getFullYear()} URL Shortener. All rights reserved.</p>
          <nav>
            <Link to="/privacy" className="hover:text-gray-200 mr-4">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-200">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
