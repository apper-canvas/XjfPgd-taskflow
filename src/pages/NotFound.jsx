import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-4xl font-bold text-primary"
          >
            404
          </motion.div>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 btn btn-primary px-6 py-3"
          >
            <HomeIcon size={18} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;