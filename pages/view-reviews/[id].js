import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getDocs, query, collection, where } from 'firebase/firestore'
import { auth, db } from '../../firebase-client/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Card, CardHeader, CardBody, CardFooter, SimpleGrid, Text, Spinner, Center, Stack, StackDivider, Box, StarIcon} from '@chakra-ui/react'
import {
  Button,
  Heading,
  useToast,
} from '@chakra-ui/react'

const Review = () => {
  const router = useRouter()
  const { id } = router.query

  const [loading, setLoading] = useState(true)
  const [doctor, setDoctor] = useState([])
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState([])
  var finalAverage = 0;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/')
      } else {
        const querySnapshot = await getDocs(
            query(
              collection(db, 'users'),
              where('uid', '==', id),
            ),
          )
          setDoctor(querySnapshot.docs.map((doc) => doc.data()))
          setLoading(false)      
        }})

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/')
      } else {
        const querySnapshot = await getDocs(
            query(
              collection(db, `users/${id}/reviews`)
            ),
          )
          setReviews(querySnapshot.docs.map((doc) => doc.data()))
          setAverageRating(querySnapshot.docs.map((doc) => doc.data()))

          setLoading(false)      
        }})

    return () => unsubscribe()
  }, [])

  for (var i = 0; i < averageRating.length; i++) {
    finalAverage += parseInt(averageRating[i].stars);
  }

  finalAverage = (finalAverage/averageRating.length).toFixed(2);

  if (loading) {
    return (
      <Center marginTop={20}>
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <div>
    <div>
      <Card>
          <CardHeader>
          <Heading size='md' align='center'>Average Rating: {finalAverage} </Heading>
          </CardHeader>
      </Card>
    </div>
    <div style={{
      display:'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: 10
  }}>
      {reviews.map(review => (
          <SimpleGrid spacing={4} margin='10' templateColumns='repeat(auto-fill, minmax(340px, 1fr))'>
              <Card boxShadow= '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'>
                  <CardHeader>
                  <Heading size='md' align='center' key={doctor.uid}>Stars: {review.stars}</Heading>
                  </CardHeader>
                  <CardBody>
                  <Text align='center'>{review.message}</Text>
                  </CardBody>
              </Card>
          </SimpleGrid> 
      ))}
  </div>
  </div>
  )
}

export default Review