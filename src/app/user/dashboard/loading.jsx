import Spinner from "../components/spinner";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0e0e0e] px-4 text-white text-center">
      <Spinner />
      <p className="mt-4 text-sm sm:text-base text-gray-400">
        Loading your dashboard…
      </p>
    </div>
  );
}
