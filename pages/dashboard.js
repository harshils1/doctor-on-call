import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { auth, db } from '../firebase-client/config'
import { getDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { Center, Spinner } from '@chakra-ui/react'
import DoctorDashboard from '../components/DoctorDashboard/DoctorDashboard'
import PatientDashboard from '../components/PatientDashboard/PatientDashboard'

const Dashboard = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({
    city: '',
    country: '',
    email: '',
    firstName: '',
    lastName: '',
    state: '',
    userType: '',
    username: '',
    uid: null,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/')
      } else {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        setUser(userDoc.data())

        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <Center marginTop={20}>
        <Spinner size="xl" />
      </Center>
    )
  }

  if (user['userType'] == 'Doctor') {
    return <DoctorDashboard user={user} />
  }

  return <PatientDashboard user={user} />
}

export default Dashboard
