import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Select,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase-client/config'
import { useRouter } from 'next/router'
import { getNames } from 'country-list'

const SignUp = () => {
  const router = useRouter()
  const toast = useToast()

  const [showPassword, setShowPassword] = useState(false)

  const [formState, setFormState] = useState({
    city: '',
    country: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    state: '',
    userType: '',
    username: '',
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/')
      } else {
        unsubscribe()
      }
    })

    return () => unsubscribe()
  }, [])

  const handleFormChange = (e) => {
    e.preventDefault()

    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    const isValid = (() => {
      let isValid = Object.values(formState).every(
        (x) => x !== null && x !== '',
      )
      if (formState['userType'] == 'doctor' && !formState['specialty'])
        isValid = false
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
      const credential = await createUserWithEmailAndPassword(
        auth,
        formState['email'],
        formState['password'],
      )

      if (!credential.user) return

      await setDoc(doc(db, 'users', credential.user.uid), {
        ...formState,
        uid: credential.user.uid,
      })

      toast({
        title: 'Signed in successfully!',
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
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName">
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name="firstName"
                    onChange={handleFormChange}
                    type="text"
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name="lastName"
                    onChange={handleFormChange}
                    type="text"
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input name="email" onChange={handleFormChange} type="email" />
            </FormControl>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input name="username" onChange={handleFormChange} type="text" />
            </FormControl>
            <FormControl id="userType">
              <FormLabel>Country</FormLabel>
              <Select
                name="country"
                onChange={handleFormChange}
                placeholder="Select a country"
              >
                {getNames().map((country) => (
                  <option value={country}>{country}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="state">
              <FormLabel>State</FormLabel>
              <Input name="state" onChange={handleFormChange} type="text" />
            </FormControl>
            <FormControl id="city">
              <FormLabel>City</FormLabel>
              <Input name="city" onChange={handleFormChange} type="text" />
            </FormControl>
            <FormControl id="userType">
              <FormLabel>Account Type</FormLabel>
              <Select
                name="userType"
                onChange={handleFormChange}
                placeholder="Select account type"
              >
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </Select>
            </FormControl>
            {formState['userType'] == 'doctor' ? (
              <FormControl id="specialty">
                <FormLabel>Specialty</FormLabel>
                <Input
                  name="specialty"
                  onChange={handleFormChange}
                  type="text"
                />
              </FormControl>
            ) : null}
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  onChange={handleFormChange}
                  type={showPassword ? 'text' : 'password'}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
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
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already have an account?{' '}
                <NextLink passhref href="login">
                  <Link color={'blue.400'}>Login</Link>
                </NextLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default SignUp
