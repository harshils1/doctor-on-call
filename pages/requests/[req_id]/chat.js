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
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../../firebase-client/config'
import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
} from 'firebase/firestore'

const Chat = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [request, setRequest] = useState({})
  const [self, setSelf] = useState({})
  const [other, setOther] = useState({})
  const [input, setInput] = useState('')

  useEffect(() => {
    if (!router.query.req_id) return

    let unsubscribeSnapshot = () => {}
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/')
      } else {
        const requestDoc = await getDoc(
          doc(db, 'requests', router.query.req_id),
        )
        if (!requestDoc.exists() || !requestDoc.data().acceptingDoctorUid) {
          return router.push('/')
        }
        setRequest(requestDoc.data())

        const selfDoc = await getDoc(doc(db, 'users', user.uid))
        setSelf(selfDoc.data())

        const otherDoc = await getDoc(
          doc(
            db,
            'users',
            selfDoc.data().userType == 'Doctor'
              ? requestDoc.data().requestingUser
              : requestDoc.data().acceptingDoctorUid,
          ),
        )
        setOther(otherDoc.data())

        unsubscribeSnapshot = onSnapshot(
          query(
            collection(db, 'requests', router.query.req_id, 'chat'),
            orderBy('dateCreated', 'desc'),
          ),
          (querySnapshot) => {
            setMessages(querySnapshot.docs.map((message) => message.data()))
          },
        )
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
      unsubscribeSnapshot()
    }
  }, [router.query])

  const handleInputChange = (e) => {
    e.preventDefault()
    setInput(e.target.value)
  }

  const sendMessage = async (e) => {
    e.preventDefault()

    await addDoc(collection(db, 'requests', router.query.req_id, 'chat'), {
      content: input,
      dateCreated: new Date(),
      sender: self.uid,
    })

    setInput('')
  }

  if (loading) {
    return (
      <Center marginTop={20}>
        <Spinner size="xl" />
      </Center>
    )
  }
  return (
    <Flex minH={'calc(100vh - 60px)'} align={'center'} justify={'center'}>
      <Flex
        position="absolute"
        top="60px"
        alignSelf={'flex-end'}
        w="full"
        mb={'100px'}
        flexDir="column-reverse"
        overflow={'scroll'}
        h={'calc(100vh - 140px)'}
      >
        {messages.map((message) => (
          <Flex
            w="full"
            flexDir="column"
            align={message.sender == self.uid ? 'end' : 'start'}
          >
            <Flex
              w="fit-content"
              borderWidth={1}
              borderColor="black"
              padding={5}
              marginX={10}
              rounded={'xl'}
              backgroundColor="gray.100"
            >
              <Text>{message.content}</Text>
            </Flex>
            <Text marginX={10} marginBottom={5}>
              {message.sender == self.uid ? self.firstName : other.firstName} (
              {Date(message.dateCreated)})
            </Text>
          </Flex>
        ))}
      </Flex>
      <Stack
        px={10}
        w="full"
        direction={'row'}
        position={'absolute'}
        bottom={2}
      >
        <Input
          height={50}
          borderColor={'black'}
          w="full"
          name="input"
          onChange={handleInputChange}
          type={'text'}
          value={input}
        />
        <Button height={50} disabled={!input} onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Flex>
  )
}

export default Chat
