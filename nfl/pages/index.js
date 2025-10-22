import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [fetchStatus, setFetchStatus] = useState("");
  const [result, setResult] = useState("");
  const [disabled, setDisabled] = useState(false);

  const getScorigami = () => {
    setDisabled(true);
    setResult("");
    setFetchStatus("Fetching...");
    fetch('/api/scorigami').then(res => res.json()).then(data => {
      setFetchStatus("Result:");
      setResult(data.result);
      setDisabled(false);
    }).catch(err => console.error(err));
  }

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Welcome to NFL Scorigami, a web application that tracks unique NFL scores. 
            Scorigami is a concept thought up by Jon Bois, referring to a score that has never been seen before in NFL history.
          </li>
          <li className="tracking-[-.01em]">
            Click the button below to fetch the latest game data, check if a scorigami has occured, and tweet from <a target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-blue-400 hover:underline" href="https://x.com/NFLScorigamiBot">@NFLScorigamiBot</a>, helping you explore the fascinating world of NFL scores.
          </li>
        </ol>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button disabled={disabled} onClick={getScorigami} className="cursor-pointer disabled:cursor-default disabled:opacity-20 disabled:hover:bg-foreground rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
            Fetch Latest Game Data
          </button>
          {(result || fetchStatus) && (
            <p className="text-sm"><span className="text-green-500">{fetchStatus}</span> {result}</p>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
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
            width={16}
            height={16}
          />
          Learn more about Scorigami on Wikipedia
        </a>
      </footer>
    </div>
  );
}