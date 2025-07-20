export default function Login() {
  return (
   <div className="max-w-xs mx-auto mt-10">
  <button
    type="button"
    className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded shadow border border-gray-300 bg-white hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
    onClick={() => {
      window.location.href = "http://localhost:3000/login";
    }}
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google logo"
      className="w-5 h-5"
    />
    <span className="text-gray-600 font-medium text-base">Sign in with Google</span>
  </button>
</div>

  );
}
