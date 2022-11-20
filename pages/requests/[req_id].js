import {
  Flex,
  Box,
  Stack,
  useColorModeValue,
  Heading,
  Textarea,
  Button,
  Center,
  Spinner,
} from '@chakra-ui/react'
import { auth, db } from '../../firebase-client/config'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import {
  getDoc,
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
  addDoc,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import DoctorRow from '../../components/DoctorRow'
import NextLink from 'next/link'

export default function ViewRequestPage() {
  const router = useRouter()

  const [user, setUser] = useState(null)

  const [request, setRequest] = useState()

  const [patient, setPatient] = useState()

  const [response, setResponse] = useState('')

  const [acceptingDoctor, setAcceptingDoctor] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/signup')
      } else {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        setUser(userDoc.data())
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!router.query.req_id || request) return

    const fetchData = async () => {
      setLoading(true)

      const reqSnapshot = await getDoc(doc(db, 'requests', router.query.req_id))
      const fetchedRequest = reqSnapshot.data()
      setRequest(fetchedRequest)

      const patientSnapshot = await getDoc(
        doc(db, 'users', fetchedRequest.requestingUser),
      )
      const fetchedPatient = patientSnapshot.data()
      setPatient(fetchedPatient)

      if (fetchedRequest.acceptingDoctorUid) {
        const accDocSnapshot = await getDoc(
          doc(db, 'users', fetchedRequest.acceptingDoctorUid),
        )
        const fetchedAcceptingDoctor = accDocSnapshot.data()
        setAcceptingDoctor(fetchedAcceptingDoctor)
      }

      setLoading(false)
    }

    fetchData()
  }, [router.query])

  const refetchRequest = async () => {
    const reqSnapshot = await getDoc(doc(db, 'requests', router.query.req_id))
    const fetchedRequest = reqSnapshot.data()
    setRequest(fetchedRequest)

    setLoading(false)
  }

  const handleAccept = async () => {
    try {
      setLoading(true)

      await setDoc(doc(db, 'requests', router.query.req_id), {
        ...request,
        acceptingDoctorUid: user.uid,
        acceptingDoctorResponse: response,
      })

      await fetch('/api/notifyAccepted', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient: patient }),
      })
    } catch (e) {
      console.log(e)
    }

    refetchRequest()
  }

  const fulfillRequest = async () => {
    setLoading(true)

    await setDoc(doc(db, 'requests', router.query.req_id), {
      ...request,
      fulfilled: true,
    })

    refetchRequest()
  }

  const renderAcceptanceForDoctors = () => {
    return request?.acceptingDoctorUid ? (
      <>
        <p>
          {request.acceptingDoctorUid === user.uid
            ? 'You have accepted this request.'
            : 'Another doctor has accepted this request.'}
        </p>
        <NextLink href={`/requests/${router.query.req_id}/chat`}>
          <Button>Chat</Button>
        </NextLink>
      </>
    ) : (
      <>
        <Textarea
          placeholder="Write any extra information to provide before accepting."
          onChange={(e) => setResponse(e.target.value)}
        />
        <Button
          fontSize={'2xl'}
          bg={'green.400'}
          color={'white'}
          _hover={{
            bg: 'green.500',
          }}
          width={'300px'}
          height={'50px'}
          onClick={handleAccept}
        >
          Accept
        </Button>
      </>
    )
  }

  const renderAcceptanceForPatient = () => {
    return request?.acceptingDoctorUid ? (
      <>
        <p>This request was accepted by</p>
        <DoctorRow details={acceptingDoctor} />
        <Button width={'100px'}>
          <NextLink href={`/requests/${router.query.req_id}/chat`}>
            Chat
          </NextLink>
        </Button>
        <p>Message from the doctor: </p>
        <Textarea
          value={request?.acceptingDoctorResponse}
          readOnly
          resize={'none'}
        />
      </>
    ) : (
      <p>Waiting for a doctor to accept this request.</p>
    )
  }

  const renderFulfillment = () => {
    return request?.fulfilled ? (
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'md'}
        p={8}
        width={'full'}
      >
        <p>This request has been fulfilled.</p>
      </Box>
    ) : (
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'md'}
        p={8}
        width={'full'}
      >
        <Button
          fontSize={'2xl'}
          bg={'blue.400'}
          color={'white'}
          _hover={{
            bg: 'blue.500',
          }}
          width={'500px'}
          height={'50px'}
          onClick={fulfillRequest}
        >
          Set this request as fulfilled.
        </Button>
      </Box>
    )
  }

  if (loading) {
    return (
      <Center marginTop={20}>
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Flex
      minH={'100vh'}
      justify={'center'}
      justifyContent={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} width={'full'} padding={'50px'} py={12}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'md'}
          p={8}
          width={'full'}
        >
          <Stack spacing={4}>
            <Heading fontSize={'4xl'}>{request?.title}</Heading>
            <p>
              requested by{' '}
              <b>
                {patient?.firstName} {patient?.lastName}
              </b>{' '}
              @{patient?.username}
            </p>
            <Heading style={{ marginTop: '30px' }} fontSize={'2xl'}>
              Message
            </Heading>
            <Textarea
              readOnly
              rows={10}
              resize={'none'}
              value={request?.message}
            />
            {patient?.address && (
              <>
                <p>
                  {patient?.firstName} {patient?.lastName} lives at{' '}
                  <b>{patient?.address}</b>.
                </p>
                <iframe
                  height="450"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDE4PJ4i7UzlDaJOvvoW3NYyJV5JDH5osA&q=${patient?.address},${patient?.city}+${patient?.state}, ${patient?.country}`}
                ></iframe>
              </>
            )}
          </Stack>
        </Box>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          width={'full'}
        >
          <Stack spacing={4}>
            {user?.userType === 'Doctor' && renderAcceptanceForDoctors()}
            {user?.userType === 'Patient' && renderAcceptanceForPatient()}
          </Stack>
        </Box>
        {user?.userType === 'Patient' &&
          request?.acceptingDoctorUid &&
          renderFulfillment()}
      </Stack>
    </Flex>
  )
}
