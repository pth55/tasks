import { Check } from "lucide-react";

export default function SuccessMessage({ resetForm }) {
  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Thank you!</h2>
        <p className="mt-2 text-gray-600">
          Your message has been submitted successfully. We'll get back to you
          soon.
        </p>
        <button
          onClick={resetForm}
          className="cursor-pointer mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Send another message
        </button>
      </div>
    </div>
  );
}
