import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Textarea,
  CheckboxGroup,
  useToast,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { auth, db } from '../firebase-client/config'
import { onAuthStateChanged } from 'firebase/auth'
import {
  getDoc,
  doc,
  getDocs,
  query,
  collection,
  where,
  addDoc,
} from 'firebase/firestore'
import DoctorRow from '../components/DoctorRow'

export default function CreateRequestPage() {
  const router = useRouter()

  const [user, setUser] = useState(null)

  const [doctors, setDoctors] = useState([])

  const [selectedDoctorIds, setSelectedDoctorIds] = useState([])

  const [formState, setFormState] = useState({
    title: '',
    message: '',
  })

  const toast = useToast()

  const [created, setCreated] = useState(false)

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
    if (user) {
      const equals = '=='

      const fetchDoctorsInArea = async () => {
        const q = query(
          collection(db, 'users'),
          where('city', equals, user.city),
          where('userType', equals, 'Doctor'),
        )

        const doctorsSnapshot = await getDocs(q)
        setDoctors(doctorsSnapshot.docs.map((doc) => doc.data()))
      }

      fetchDoctorsInArea()
    }
  }, [user])

  useEffect(() => {
    if (created) {
      toast({
        title: 'Request created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/')
    }
  }, [created])

  useEffect(() => {
    console.log(selectedDoctorIds)
  }, [selectedDoctorIds])

  const handleFormChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const setSelected = (details) => {
    let isSelected = false
    selectedDoctorIds.forEach((doctorId) => {
      if (doctorId === details.uid) {
        isSelected = true
      }
    })

    if (isSelected) {
      setSelectedDoctorIds(
        selectedDoctorIds.filter((uid) => {
          return uid !== details.uid
        }),
      )
    } else {
      setSelectedDoctorIds([...selectedDoctorIds, details.uid])
    }
  }

  const isSelected = (uid) => {
    let selected = false

    selectedDoctorIds.forEach((doctorUid) => {
      if (doctorUid === uid) {
        selected = true
      }
    })

    return selected
  }

  const createRequest = async () => {
    await addDoc(collection(db, 'requests'), {
      title: formState.title,
      message: formState.message,
      requestingUser: user.uid,
      receivingDoctors: selectedDoctorIds,
      acceptingDoctorUid: null,
      acceptingDoctorResponse: null,
      fulfilled: false,
      dateCreated: new Date(),
    })

    setCreated(true)
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      justifyContent={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Request a Doctor</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          width="500px"
        >
          <Stack spacing={4}>
            <FormControl id="title">
              <FormLabel>Title</FormLabel>
              <Input name="title" onChange={handleFormChange} />
            </FormControl>
            <FormControl id="message">
              <FormLabel>
                Message (Include symptoms, relevant medical history, any
                important details)
              </FormLabel>
              <Textarea rows={10} name="message" onChange={handleFormChange} />
            </FormControl>

            <Stack>
              <FormControl id="doctors">
                <FormLabel>
                  Doctors available in {user?.city}, {user?.state},{' '}
                  {user?.country}
                </FormLabel>
                <Stack height={'300px'} overflowY={'auto'}>
                  {doctors?.map((doctor) => {
                    return (
                      <DoctorRow
                        details={doctor}
                        selected={isSelected(doctor.uid)}
                        onClick={setSelected}
                      />
                    )
                  })}
                </Stack>
              </FormControl>
            </Stack>

            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={createRequest}
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
