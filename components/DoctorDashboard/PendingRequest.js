import NextLink from 'next/link'
import { Flex, Stack, Button, Text } from '@chakra-ui/react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase-client/config'
import { useEffect, useState } from 'react'

const PendingRequest = ({ pendingRequest }) => {
  const [requestingPatient, setRequestingPatient] = useState({})

  useEffect(() => {
    ;(async () => {
      const userDoc = await getDoc(
        doc(db, 'users', pendingRequest['requestingUser']),
      )
      setRequestingPatient(userDoc.data())
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
        <Stack>
          <Text fontSize={25} fontWeight={900}>
            {requestingPatient['firstName']} {requestingPatient['lastName']}
          </Text>
          <Text fontSize={20} fontWeight={600}>
            <strong>Date Requested:</strong>{' '}
            {Date(pendingRequest['dateCreated'])}
          </Text>
          <Text fontSize={20} fontWeight={600}>
            <strong>Address:</strong> {requestingPatient['address']}
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
