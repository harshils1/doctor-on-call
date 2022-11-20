import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { auth, db } from '../firebase-client/config'
import { getDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
  Center,
  Spinner,
} from '@chakra-ui/react'

const Account = () => {
  const router = useRouter()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({
    city: '',
    country: '',
    email: '',
    firstName: '',
    lastName: '',
    state: '',
    userType: '',
    username: '',
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/')
      } else {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        setUser(userDoc.data())

        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const updateProfile = (e) => {
    e.preventDefault()
  }

  const handleLogout = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      await signOut(auth)
    } catch (error) {
      toast({
        title: 'An error occured',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Center marginTop={20}>
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Your Profile
        </Heading>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            disabled
            placeholder="Username"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={user['username']}
          />
        </FormControl>
        <FormControl id="firstName">
          <FormLabel>First Name</FormLabel>
          <Input
            disabled
            placeholder="First Name"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={user['firstName']}
          />
        </FormControl>
        <FormControl id="lastName">
          <FormLabel>Last Name</FormLabel>
          <Input
            disabled
            placeholder="Last Name"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={user['lastName']}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input
            disabled
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={user['email']}
          />
        </FormControl>{' '}
        <FormControl id="userType">
          <FormLabel>Account Type</FormLabel>
          <Input
            disabled
            placeholder="Account Type"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={user['userType']}
          />
        </FormControl>{' '}
        {user['userType'] == 'Doctor' ? (
          <FormControl id="specialty">
            <FormLabel>Specialty</FormLabel>
            <Input
              disabled
              placeholder="Specialty"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={user['specialty']}
            />
          </FormControl>
        ) : null}
        {user['userType'] == 'Patient' ? (
          <FormControl id="address">
            <FormLabel>Address</FormLabel>
            <Input
              disabled
              placeholder="Address"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={user['address']}
            />
          </FormControl>
        ) : null}
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default Account
