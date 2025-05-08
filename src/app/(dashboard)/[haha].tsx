import { useParams } from "react-router-dom";

export default function Page() {
  const { haha } = useParams();
  return <div>{haha}</div>;
}
