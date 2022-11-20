import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from "next/image";
import Container from "./container";
import heroImg from "../image.svg";

export default function Home() {
  return (
    <>
    <div className={styles.container}>
      <Head>
        <title>Doctor On Call</title>
        <meta name="description" content="Doctor On Call" />
        <link rel="icon" href="/logo.png" />
      </Head>

    </div>
      <Container className="flex flex-wrap ">
      <div className="flex items-center w-full lg:w-1/2">
        <div className="ml-10 max-w-2xl mb-8">
          <h1 className="text-3xl font-bold leading-snug tracking-tight text-gray-800 lg:text-6xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
            Doctor On-Call
          </h1>
          <p className="py-4 text-xl leading-normal text-gray-500 lg:text-xl xl:text-3xl dark:text-gray-300">
              Your one-stop application to a better you!
          </p>
          <p className="py-11 text-xs leading-normal text-gray-500 lg:text-xl xl:text-1xl dark:text-gray-300">
              Sign Up. Request a Doctor. Feel Better.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div className="">
          <Image
            src={heroImg}
            width="550"
            height="617"
            alt="Hero Illustration"
            layout="intrinsic"
            loading="eager"
          />
        </div>
      </div>
    </Container>
  </>
);
}