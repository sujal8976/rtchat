export default function () {
  return (
    <div className="h-[70vh] w-full flex justify-center items-center text-center">
      <div className="max-w-[90%] p-6 rounded-lg shadow-lg border border-indigo-300">
        <h3 className="text-2xl font-bold text-indigo-600 mb-4">🚨 Important Note 🚨</h3>
        <p className="text-lg mb-2">
          If you just logged in and haven't refreshed the page yet, the app may not work properly. 
          Please make sure to refresh the page now to enjoy a seamless experience.
        </p>
        <p className="text-lg mb-2">
          Also, don’t forget to start connecting with people through chat and build meaningful conversations!
        </p>
        <p className="text-lg font-semibold text-indigo-600">
          We’re thrilled to have you here—let’s make some amazing memories together! 🎉
        </p>
      </div>
    </div>
  );
}

