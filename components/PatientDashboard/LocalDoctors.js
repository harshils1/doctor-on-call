import { Flex, Stack, Text, Spinner, Center } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase-client/config'

const LocalDoctors = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    ;(async () => {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'users'),
          where('userType', '==', 'Doctor'),
          where('city', '==', user['city']),
        ),
      )
      setDoctors(querySnapshot.docs.map((doc) => doc.data()))
      setLoading(false)
    })()
  }, [])

  return (
    <Flex
      backgroundColor={'gray.200'}
      minW={'fit-content'}
      w={{ base: 'full', md: 80 }}
      rounded={'xl'}
      justify="center"
      py={10}
      px={8}
    >
      <Stack gap={10} direction={'column'}>
        <Text fontSize={25} fontWeight={600}>
          Doctors In Your Area
        </Text>
        {loading ? (
          <Center marginTop={20}>
            <Spinner size="xl" />
          </Center>
        ) : doctors.length ? (
          <Stack
            borderColor={'black'}
            borderWidth={2}
            padding={4}
            rounded={'xl'}
            maxH={300}
            overflow={'scroll'}
            direction={'column'}
          >
            {doctors.map((doctor) => (
              <p>{doctors['firstName']}</p>
            ))}
          </Stack>
        ) : (
          <Text textAlign={'center'}>No doctors found</Text>
        )}
      </Stack>
    </Flex>
  )
}

export default LocalDoctors
