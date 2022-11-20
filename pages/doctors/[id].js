import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { auth, db } from '../../firebase-client/config'
import { getDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
  Center,
  Spinner,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'

const Doctor = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    if (!router.query.id) return

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/')
      } else {
        const doctorDoc = await getDoc(doc(db, 'users', router.query.id))

        if (doctorDoc.data().userType == 'Doctor') {
          router.push('/')
        }

        setDoctor(doctorDoc.data())

        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router.query])

  if (loading) {
    return (
      <Center marginTop={20}>
        <Spinner size="xl" />
      </Center>
    )
  }

  if (!doctor) {
    return (
      <Center marginTop={20}>
        <Text>No doctor found!</Text>
      </Center>
    )
  }

  return (
    <Stack spacing={50} py={10} px={{ base: 10, md: 200 }}>
      <Stack spacing={10}>
        <Text fontSize={20}>
          Name:{' '}
          <strong>
            {doctor['firstName']} {doctor['lastName']}
          </strong>
        </Text>
        <Text fontSize={20}>
          Email: <strong>{doctor['email']}</strong>
        </Text>
        <Text fontSize={20}>
          Specialty: <strong>{doctor['specialty']}</strong>
        </Text>
        <Text fontSize={20}>
          Location:{' '}
          <strong>
            {doctor['city']}, {doctor['state']}, {doctor['country']}
          </strong>
        </Text>
      </Stack>
      <Center>
        <NextLink href={`/view-reviews/${router.query.id}`} passHref>
          <Button alignSelf={'center'}>View Reviews</Button>
        </NextLink>
      </Center>
    </Stack>
  )
}

export default Doctor
