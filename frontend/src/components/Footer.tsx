import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <img src="/logo.png" alt="Lassen Logo" className="h-6 w-6" />
            <span className="font-bold">Lassen</span>
          </Link>
        </div>
        <div className="flex flex-col space-y-2 ">
          <Link className= "hover:text-zinc-600" href="/about">About</Link>
          <Link className= "hover:text-zinc-600" href="https://arryan.xyz">Contact</Link>
          <Link className= "hover:text-zinc-600" href="/privacy">Privacy Policy</Link>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; 2025 Arryan Bhatnagar. All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>
            <a className= "hover:text-zinc-600" href="https://github.com/bhatnag8/lassen">View the source</a>
          </p>
          <p className="md:ml-auto">
            <span className="">Created by Arryan Bhatnagar</span>
          </p>
        </div>
      </div>
    </footer>
  );
}