import NextLink from 'next/link'
import { Flex, Stack, Button, Text } from '@chakra-ui/react'
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
        <Stack spacing={4}>
          <Stack>
            <Text fontSize={20} fontWeight={700}>
              Requested Doctors:
            </Text>
            {requestedDoctors.map((doctor) => (
              <NextLink passHref href={`/doctors/${doctor['uid']}`}>
                <Text pl={2} fontSize={15} fontWeight={500}>
                  {doctor['firstName']} {doctor['lastName']}
                </Text>
              </NextLink>
            ))}
          </Stack>
          <Text fontSize={20} fontWeight={600}>
            <strong>Date Requested:</strong>{' '}
            {Date(pendingRequest['dateCreated'])}
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
