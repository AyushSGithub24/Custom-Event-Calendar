export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Sign in to continue to your dashboard</p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "http://localhost:3000/login";
          }}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:shadow-md hover:bg-gray-50 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
