import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>User Management</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/public/favicon.ico' />
      </Head>
      <main className={clsx('w-full h-full', inter.className)}>
        <h1 className='border-b border-neutral-300 px-4 py-2 text-2xl font-medium text-center'>
          User Management
        </h1>
        <div className='p-4'>
          <Link href='/users'>
            <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'>
              View All Users
            </button>
          </Link>
        </div>
        <div className='p-4'>
          <Link href='/create'>
            <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'>
              Add New Users
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
