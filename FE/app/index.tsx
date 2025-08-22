import { useNavigationContainerRef, useRouter } from "expo-router";
import { useEffect } from "react";

export default function IndexRedirect() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (navigationRef.isReady()) {
      router.replace("/tabs/home");
    }
  }, [navigationRef]);

  useEffect(() => {
  const timer = setTimeout(() => {
    router.replace("/tabs/home");
  }, 50); // 혹은 100ms
  return () => clearTimeout(timer);
}, []);
  return null;
}