import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react'
import { db } from '../firebase-client/config'
import { setDoc, doc } from 'firebase/firestore'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Doctor On Call</title>
        <meta name="description" content="Doctor On Call" />
        <link rel="icon" href="/logo.png" />
      </Head>
    </div>
  )
}
