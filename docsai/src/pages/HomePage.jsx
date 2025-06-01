import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  PencilSquareIcon, 
  DocumentMagnifyingGlassIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import Navbar from '../components/layout/Navbar';

const features = [
  {
    name: 'AI-Powered Document Creation',
    description: 'Create professional documents instantly using natural language prompts.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Smart Editing',
    description: 'Edit and refine your documents with AI assistance in real-time.',
    icon: PencilSquareIcon,
  },
  {
    name: 'Document Analysis',
    description: 'Upload and analyze documents with AI-powered summarization.',
    icon: DocumentMagnifyingGlassIcon,
  },
];

const HomePage = () => {
  return (
    <div className="bg-white">
      <Navbar />
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <motion.div 
            className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your Documents with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create, edit, and analyze documents with the power of artificial intelligence. 
              Experience the future of document management.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/editor"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get Started
              </Link>
              <Link to="/features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src="/hero-image.png"
                alt="App screenshot"
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Faster Document Creation</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your documents
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered platform helps you create, edit, and analyze documents with unprecedented ease.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name}
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link to="/editor" className="text-sm font-semibold leading-6 text-blue-600">
                      Try it now <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <motion.div 
            className="relative isolate overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your document workflow?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-gray-300">
              Join thousands of users who are already creating better documents with AI.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/editor"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <Link to="/learn-more" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 