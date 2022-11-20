import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Select,
  useToast,
  Textarea,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../../../firebase-client/config'
import { useRouter } from 'next/router'

const Review = () => {
  const router = useRouter()
  const toast = useToast()

  const [request, setRequest] = useState(null)

  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    if (!router.query.req_id) return

    const fetchData = async () => {
      const reqDoc = doc(db, 'requests', router.query.req_id)
      const reqSnapshot = await getDoc(reqDoc)
      const fetchedRequest = reqSnapshot.data()
      setRequest(fetchedRequest)

      const docID = fetchedRequest.acceptingDoctorUid
      if (!docID) return router.push('/')
      const reqID = doc(db, 'users', docID)
      const IDSnapshot = await getDoc(reqID)
      const fetchedDoctor = IDSnapshot.data()
      setDoctor(fetchedDoctor)
    }

    fetchData()
  }, [router.query])

  const [formState, setFormState] = useState({
    stars: '',
    message: '',
  })

  const handleFormChange = (e) => {
    e.preventDefault()

    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleReview = async (e) => {
    e.preventDefault()

    const isValid = (() => {
      let isValid = Object.values(formState).every(
        (x) => x !== null && x !== '',
      )
      return isValid
    })()

    if (!isValid) {
      toast({
        title: 'Invalid input',
        description: 'Ensure all the fields are filled.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const docID = doctor.uid
      await addDoc(collection(db, `users/${docID}/reviews`), {
        ...formState,
        requestId: router.query.req_id,
        dateCreated: new Date(),
      })

      toast({
        title: 'Review submitted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/')
    } catch (error) {
      toast({
        title: 'An error occured',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} minW={'70vh'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Create Review
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="stars">
              <FormLabel>Rating</FormLabel>
              <Select
                name="stars"
                onChange={handleFormChange}
                placeholder="Enter a rating"
              >
                <option value={1}>{1}</option>
                <option value={2}>{2}</option>
                <option value={3}>{3}</option>
                <option value={4}>{4}</option>
                <option value={5}>{5}</option>
              </Select>
            </FormControl>
            <FormControl id="message">
              <FormLabel>Leave a Detailed Review</FormLabel>
              <Textarea
                name="message"
                onChange={handleFormChange}
                placeholder="Leave a message"
              />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleReview}
              >
                Send Review
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Review
