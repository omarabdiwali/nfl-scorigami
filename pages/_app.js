import "@/styles/globals.css";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/next"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head><title>NFL Scorigami</title></Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
