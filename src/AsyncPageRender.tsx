import { useEffect, useState } from "react";
import Loading from "./shared/Loading";

interface AsyncPageRenderProps {
  children?: React.ReactNode;
}

/**
 * To be used on components with large DOM rendering operations
 */
export default function AsyncPageRender({ children }: AsyncPageRenderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return <>{children}</>;
}
