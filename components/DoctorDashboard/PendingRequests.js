import NextLink from 'next/link'
import { Flex, Button, Stack, Text, Spinner, Center } from '@chakra-ui/react'
import PendingRequest from './PendingRequest'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase-client/config'

const PendingRequests = ({ user }) => {
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const querySnapshot = await getDocs(
        query(collection(db, 'requests'), where('fulfilled', '==', false)),
      )
      setPendingRequests(
        querySnapshot.docs
          .map((doc) => {
            const obj = doc.data()
            obj.id = doc.id
            return obj
          })
          .filter((pendingRequest) =>
            pendingRequest['receivingDoctors'].includes(user.uid),
          ),
      )
      setLoading(false)
    })()
  }, [])

  return (
    <Flex
      backgroundColor={'gray.200'}
      minW={'fit-content'}
      w={{ base: 'full', md: 500 }}
      rounded={'xl'}
      justify="center"
      py={10}
      px={8}
    >
      <Stack gap={10} direction={'column'}>
        <Text fontSize={25} fontWeight={600}>
          Pending Requests
        </Text>

        {loading ? (
          <Center marginTop={20}>
            <Spinner size="xl" />
          </Center>
        ) : pendingRequests.length ? (
          <Stack
            borderColor={'black'}
            borderWidth={2}
            padding={4}
            rounded={'xl'}
            maxH={300}
            overflowY={'scroll'}
            overflowX={'hidden'}
            direction={'column'}
          >
            {pendingRequests.map((pendingRequest) => (
              <PendingRequest pendingRequest={pendingRequest} />
            ))}
          </Stack>
        ) : (
          <Text textAlign={'center'}>No pending requests</Text>
        )}
      </Stack>
    </Flex>
  )
}

export default PendingRequests
