import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase-client/config'
import { useState, useEffect } from 'react'

const Login = () => {
  const router = useRouter()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/')
      } else {
        unsubscribe()
        setLoading(false)
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

  const handleLogin = async (e) => {
    e.preventDefault()

    setLoading(true)

    const isValid = Object.values(formState).every(
      (x) => x !== null && x !== '',
    )

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
      await signInWithEmailAndPassword(
        auth,
        formState['email'],
        formState['password'],
      )

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
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input name="email" onChange={handleFormChange} type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                onChange={handleFormChange}
                type="password"
              />
            </FormControl>
            <Stack spacing={10}>
              {/* <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack> */}
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleLogin}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account?{' '}
                <NextLink passhref href="signup">
                  <Link color={'blue.400'}>Sign Up</Link>
                </NextLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Login
