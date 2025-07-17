import Spinner from "./user/components/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-[#0e0e0e]">
      <Spinner className="w-10 h-10 text-white" />
    </div>
  );
}
