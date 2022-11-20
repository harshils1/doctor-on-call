import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getDocs, query, collection, where } from 'firebase/firestore'
import { auth, db } from '../../firebase-client/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Card, CardHeader, CardBody, SimpleGrid, Text, Spinner, Center} from '@chakra-ui/react'
import { StarIcon} from '@chakra-ui/icons'

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
              collection(db, `users/${id}/reviews`)
            ),
          )

          const querySnap = await getDocs(
            query(
              collection(db, 'users'),
              where('uid', '==', id),
            ),
          )
         
          setDoctor(querySnapshot.docs.map((doc) => doc.data()))
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

  const icons = []
  for(let i = 0; i < reviews.length; i++) {
    icons.push([]);
    for(let j = 0; j < reviews[i].stars; j++) {
      icons[i].push(<StarIcon/>);
    }
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
      {reviews.map((review, i) => (
          <SimpleGrid spacing={4} margin='10' templateColumns='repeat(auto-fill, minmax(340px, 1fr))'>
              <Card boxShadow= '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'>
                  <CardHeader align = 'center'>
                  {icons[i]}
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