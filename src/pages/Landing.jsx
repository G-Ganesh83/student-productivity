import { Link } from "react-router-dom";
import Button from "../components/Button";

function Landing() {
  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 mb-6">
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🎓 Built for Students, By Students
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Study Smarter,
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Not Harder
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            The all-in-one platform for college students to manage tasks, collaborate on projects, 
            and access learning resources—all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="shadow-xl hover:shadow-2xl">
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="shadow-lg">
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
              <div className="text-sm text-gray-600 font-medium mt-1">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">50K+</div>
              <div className="text-sm text-gray-600 font-medium mt-1">Tasks Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">5K+</div>
              <div className="text-sm text-gray-600 font-medium mt-1">Collaboration Rooms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                to Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Powerful tools designed specifically for student productivity and collaboration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Productivity Feature */}
            <div className="group relative bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-8 shadow-soft border border-blue-100/50 hover-lift">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Productivity</h3>
                <p className="text-gray-600 leading-relaxed">
                  Organize your tasks, set priorities, and track your progress. Stay on top of 
                  assignments and deadlines with our intuitive task management system.
                </p>
              </div>
            </div>
            
            {/* Collaboration Feature */}
            <div className="group relative bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-8 shadow-soft border border-purple-100/50 hover-lift">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  👥
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaboration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Work together in real-time with code editing, shared terminals, and integrated 
                  chat. Perfect for group projects and study sessions.
                </p>
              </div>
            </div>
            
            {/* Resources Feature */}
            <div className="group relative bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-8 shadow-soft border border-indigo-100/50 hover-lift">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  📚
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Resources</h3>
                <p className="text-gray-600 leading-relaxed">
                  Store and organize your study materials, notes, PDFs, and links. Everything 
                  you need, accessible from anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Preview Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Real-Time Collaboration
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                Code together, share terminals, and communicate seamlessly. Our collaboration 
                rooms bring everything you need for group work into one unified interface.
              </p>
              <ul className="space-y-4">
                {[
                  "Shared code editor with syntax highlighting",
                  "Integrated terminal for running code",
                  "Real-time chat and voice controls",
                  "See who's online and active"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg font-medium pt-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-gray-900 text-lg">Collaboration Room</h4>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-emerald-700">3 online</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 font-mono text-sm text-green-400 mb-4 shadow-lg">
                  <div className="text-gray-500 mb-2">// Code editor preview</div>
                  <div className="text-cyan-300">function <span className="text-yellow-300">greet</span>(<span className="text-pink-300">name</span>) {'{'}</div>
                  <div className="ml-4 text-cyan-300">return <span className="text-green-400">`Hello, ${'{'}name{'}'}!`</span>;</div>
                  <div className="text-cyan-300">{'}'}</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-emerald-400 shadow-lg">
                  $ npm start
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Built with Modern
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Technology
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Fast, reliable, and designed for the modern web
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["React", "Vite", "Tailwind CSS", "JavaScript"].map((tech) => (
              <div key={tech} className="text-center group">
                <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-8 shadow-soft border border-gray-100 hover-lift">
                  <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {tech}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Join thousands of students who are already using StudyHub to stay organized 
            and collaborate effectively.
          </p>
          <Link to="/dashboard">
            <Button variant="secondary" size="lg" className="bg-white text-indigo-600 hover:bg-gray-50 shadow-2xl">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
