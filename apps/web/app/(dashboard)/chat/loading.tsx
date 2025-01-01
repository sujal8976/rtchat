import Loading from "../../../components/loading/loading";

export default function () {
  return (
    <div className="h-[50vh] w-full flex justify-center items-center">
      <Loading text="Connecting to Room..." />
    </div>
  );
}
