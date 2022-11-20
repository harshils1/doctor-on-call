import NextLink from 'next/link'
import {
  Flex,
  Stack,
  Button,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase-client/config'
import { useEffect, useState } from 'react'

const PendingRequest = ({ pendingRequest }) => {
  const [requestedDoctors, setRequestedDoctors] = useState([])

  useEffect(() => {
    ;(async () => {
      const doctors = []
      for (const doctor of pendingRequest['receivingDoctors']) {
        const doctorDoc = await getDoc(doc(db, 'users', doctor))
        doctors.push(doctorDoc.data())
      }
      setRequestedDoctors(doctors)
    })()
  }, [])

  const acceptedDoctor = requestedDoctors.find(
    (doctor) => doctor.uid == pendingRequest['acceptingDoctorUid'],
  )

  return (
    <Flex
      backgroundColor={'gray.400'}
      minW={'fit-content'}
      w={{ base: 'full', md: 80 }}
      rounded={'xl'}
      justify="center"
      py={10}
      px={5}
    >
      <Stack spacing={6}>
        {pendingRequest['acceptingDoctorUid'] ? (
          <Alert status="success" w="fit-content" rounded="2xl" m="auto">
            <AlertIcon />
            <AlertTitle>Accepted</AlertTitle>
          </Alert>
        ) : (
          <Alert status="warning" w="fit-content" rounded="2xl" m="auto">
            <AlertIcon />
            <AlertTitle>Pending</AlertTitle>
          </Alert>
        )}
        <Stack spacing={4}>
          <Stack spacing={4}>
            <Text fontSize={25} fontWeight={600}>
              {pendingRequest['title']}
            </Text>

            {pendingRequest['acceptingDoctorUid'] ? (
              <Text fontSize={20} fontWeight={600}>
                Accepted By: {acceptedDoctor?.firstName}{' '}
                {acceptedDoctor?.lastName}{' '}
              </Text>
            ) : (
              <Spacing>
                <Text fontSize={20} fontWeight={600}>
                  Requested Doctors:
                </Text>
                {requestedDoctors.map((doctor) => (
                  <NextLink passHref href={`/doctors/${doctor['uid']}`}>
                    <Text pl={2} fontSize={15} fontWeight={500}>
                      {doctor['firstName']} {doctor['lastName']}
                    </Text>
                  </NextLink>
                ))}
              </Spacing>
            )}
          </Stack>
          <Text fontSize={20} fontWeight={600}>
            <strong>Time Requested:</strong>{' '}
            {new Date(
              pendingRequest['dateCreated'].seconds * 1000,
            ).toLocaleString()}
          </Text>
        </Stack>
        <Flex justify={'center'}>
          <NextLink href={`/requests/${pendingRequest.id}`} passHref>
            <Button>View Request</Button>
          </NextLink>
        </Flex>
      </Stack>
    </Flex>
  )
}

export default PendingRequest
