import { useNavigationContainerRef, useRouter } from "expo-router";
import { useEffect } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/login" />;
  // return <Redirect href="/tabs/home" />;

}
