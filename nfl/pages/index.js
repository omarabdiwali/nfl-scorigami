import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ScorigamiChart from "@/components/ScorigamiChart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20`}
    >
      <main className="flex gap-[32px] items-center sm:items-start">
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Welcome to NFL Scorigami, a web application that tracks unique NFL scores. 
            Scorigami is a concept thought up by Jon Bois, referring to a score that has never been seen before in a sport&apos;s history.
          </li>
          <li className="mb-2 tracking-[-.01em]">
            The latest game scores are automatically checked every minute on gamedays. If a scorigami occurs, 
            it will be tweeted from <a target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-blue-400 hover:underline" href="https://x.com/NFLScorigamiBot">@NFLScorigamiBot</a>
          </li>
          <li className="tracking-[-.01em]">
            The data collected starts from the 1920 APFA (NFL) season, and includes the AAFC and AFL games.
            The chart below, showcasing all unique scores throughout the NFL&apos;s history, is updated daily. 
            Please note that the dates displayed are based on the Eastern Time (ET) timezone. 
            Historical data prior to modern record-keeping did not have precise start times, so ET is used as a standard reference.
          </li>
        </ol>
      </main>
      <ScorigamiChart />
      
      <footer className="row-start-3 mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://en.wikipedia.org/wiki/Scorigami"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={20}
            height={20}
          />
          Learn more about Scorigami
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://scorigami-nba.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/basketball.svg"
            alt="Basketball icon"
            color="white"
            width={24}
            height={24}
          />
          NBA Scorigami
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/omarabdiwali/scorigami"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github.svg"
            alt="GitHub icon"
            width={20}
            height={20}
          />
          Source Code
        </a>
      </footer>
    </div>
  );
}