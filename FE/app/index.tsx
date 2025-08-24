import { useNavigationContainerRef, useRouter } from "expo-router";
import { useEffect } from "react";

export default function IndexRedirect() {
  // const router = useRouter();
  // const navigationRef = useNavigationContainerRef();

  // useEffect(() => {
  //   if (navigationRef.isReady()) {
  //     // router.replace("/tabs/home");
  //     router.replace("/login");
  //   }
  // }, [navigationRef]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("/login");
  //   }, 50); // 혹은 100ms
  //   return () => clearTimeout(timer);
  // }, []);
  // return null;

  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
