import NextLink from 'next/link'
import { Flex, Button, Stack, Text, Spinner, Center } from '@chakra-ui/react'
import PendingRequest from './PendingRequest'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../firebase-client/config'
import PendingReview from './PendingReview'

const PendingRequests = ({ user }) => {
  const [pendingReviews, setPendingReviews] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReqsWithoutReviews = async () => {
      const q = query(
        collection(db, 'requests'),
        where('reviewed', '==', false),
        where('requestingUser', '==', user?.uid),
        where('fulfilled', '==', true),
      )

      const requestsSnapshot = await getDocs(q)
      setPendingReviews(
        requestsSnapshot.docs.map((doc) => {
          const data = doc.data()
          data.id = doc.id
          return data
        }),
      )
      setLoading(false)
    }

    fetchReqsWithoutReviews()
  }, [user])

  return (
    <Flex
      backgroundColor={'gray.200'}
      minW={'fit-content'}
      w={{ base: 'full', md: 200 }}
      rounded={'xl'}
      justify="center"
      py={10}
      px={8}
    >
      <Stack gap={10} direction={'column'}>
        <Text fontSize={25} fontWeight={600}>
          Fulfilled Requests Pending Review
        </Text>
        {loading ? (
          <Center marginTop={20}>
            <Spinner size="xl" />
          </Center>
        ) : pendingReviews.length ? (
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
            {pendingReviews.map((review) => (
              <PendingReview pendingReview={review} />
            ))}
          </Stack>
        ) : (
          <Text textAlign={'center'}>No requests pending review.</Text>
        )}
      </Stack>
    </Flex>
  )
}

export default PendingRequests
