import { Button } from '@/components/ui/button';

export default function WelcomeBanner() {
  return (
    <div className="bg-white dark:bg-[#1C1C1C] rounded-lg p-8 shadow-lg dark:shadow-[#000000]/10">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Welcome to Our System
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Get started by exploring our features and capabilities. We're here to help you succeed.
      </p>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transition-colors">
        Get Started
      </Button>
    </div>
  );
}