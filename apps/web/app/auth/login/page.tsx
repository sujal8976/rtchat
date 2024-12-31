import Login from "../../../components/auth/login";

export default function ({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return <Login searchParams={searchParams} />;
}
