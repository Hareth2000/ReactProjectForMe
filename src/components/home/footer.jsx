

// import React from "react";

// const Footer = () => {
//   return (
//     <div className="bg-black text-gray-300 w-full">
//     <footer className="py-10 px-6">
//       <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
//         {/* TaskMaster Info */}
//         <div>
//           <h5 className="text-xl font-bold mb-4 text-gray-100">TaskMaster</h5>
//           <p className="text-gray-400">
//             Boost your productivity and stay on top of your tasks with our
//             powerful task management platform.
//           </p>
//         </div>
  
//         {/* Quick Links */}
//         <div>
//           <h5 className="text-xl font-bold mb-4 text-gray-100">Quick Links</h5>
//           <ul className="space-y-2">
//             <li><a href="#" className="text-gray-400 hover:text-white no-underline">Dashboard</a></li>
//             <li><a href="#" className="text-gray-400 hover:text-white no-underline">Features</a></li>
//             <li><a href="#" className="text-gray-400 hover:text-white no-underline">Pricing</a></li>
//             <li><a href="#" className="text-gray-400 hover:text-white no-underline">Support</a></li>
//           </ul>
//         </div>
  
//         {/* Resources */}
//         <div>
//           <h5 className="text-xl font-bold mb-4 text-gray-100">Resources</h5>
//           <ul className="space-y-2">
//             <li><a href="#" className="text-gray-400 hover:text-white no-underline">Help Center</a></li>
//             <li><a href="#" className="text-gray-400 hover:text-white no-underline">Guides</a></li>
//             <li><a href="#" className="text-gray-400 hover:text-white no-underline">Blog</a></li>
//             <li><a href="#" className="text-gray-400 hover:text-white no-underline">Community</a></li>
//           </ul>
//         </div>
  
//         {/* Contact Us */}
//         <div>
//           <h5 className="text-xl font-bold mb-4 text-gray-100">Contact Us</h5>
//           <p className="text-gray-400">📧 support@taskmaster.com</p>
//           <p className="text-gray-400">📞 +1 234 567 890</p>
//           <p className="text-gray-400">📍 New York, USA</p>
//         </div>
//       </div>
  
//       {/* Copyright & Social Media */}
//       <div className="flex flex-col sm:flex-row justify-between py-6 border-t border-gray-700 mt-6 text-gray-500 text-sm">
//         <p>&copy; 2024 TaskMaster. All rights reserved.</p>
  
//         <div className="flex gap-6 "style={{width:"24%",}}>
//           <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook fa-2x"></i></a>
//           <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter fa-2x"></i></a>
//           <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin fa-2x"></i></a>
//           <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram fa-2x"></i></a>
//         </div>
//       </div>
//     </footer>
//   </div>
  
//   );
// };

// export default Footer;
import React from "react";

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 w-full">
      <footer className="py-12 px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* TaskMaster Info */}
          <div>
            <h5 className="text-2xl font-semibold mb-4 text-gray-100">TaskMaster</h5>
            <p className="text-gray-400">
              Boost your productivity and stay on top of your tasks with our
              powerful task management platform.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h5 className="text-2xl font-semibold mb-4 text-gray-100">Quick Links</h5>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Support</a></li>
            </ul>
          </div>
  
          {/* Resources */}
          <div>
            <h5 className="text-2xl font-semibold mb-4 text-gray-100">Resources</h5>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Guides</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Community</a></li>
            </ul>
          </div>
  
          {/* Contact Us */}
          <div>
            <h5 className="text-2xl font-semibold mb-4 text-gray-100">Contact Us</h5>
            <p className="text-gray-400">📧 support@taskmaster.com</p>
            <p className="text-gray-400">📞 +1 234 567 890</p>
            <p className="text-gray-400">📍 New York, USA</p>
          </div>
        </div>
  
        {/* Copyright & Social Media */}
        <div className="flex flex-col sm:flex-row justify-between py-6 border-t border-gray-700 mt-8 text-sm text-gray-400">
          <p>&copy; 2024 TaskMaster. All rights reserved.</p>
  
          <div className="flex gap-6" style={{ width: "24%" }}>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              <i className="fab fa-facebook fa-2x"></i>
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              <i className="fab fa-twitter fa-2x"></i>
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              <i className="fab fa-instagram fa-2x"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
