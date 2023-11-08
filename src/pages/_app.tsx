import { type AppType } from "next/app";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import "~/styles/globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps}/>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
