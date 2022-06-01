import Link from 'next/link';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <div>
    <nav className='border-b p-6' >
      <p className='text-4xl font-bold' >Veer marketplace</p>
        <div className='flex mt-4' >

          <Link href='/'>
          <a className='mr-6 text-pink-500'> Home </a>
          </Link>

          <Link href='/create-item'>
          <a className='mr-6 text-pink-500'> Sell digital Address </a>
          </Link>

          <Link href='/create-item'>
          <a className='mr-6 text-pink-500'> create NFT's</a>
          </Link>

          <Link href='/my-assets'>
          <a className='mr-6 text-pink-500'> my NFT's </a>
          </Link>

          <Link href='/creator-dashboard'>
          <a className='mr-6 text-pink-500'> creator dashboard</a>
          </Link>
        </div>

    </nav>
    <Component {...pageProps} />
  </div>
}

export default MyApp
