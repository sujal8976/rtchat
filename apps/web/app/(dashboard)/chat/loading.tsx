import Loading from "../../../components/loading/loading";

export default function () {
  return (
    <div className="flex-1 flex justify-center items-center">
      <Loading text="Connecting to Room..." />
    </div>
  );
}
