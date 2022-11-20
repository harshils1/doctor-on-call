import NextLink from 'next/link'
import {
  Flex,
  Stack,
  Button,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase-client/config'
import { useEffect, useState } from 'react'

export default function PendingReview({ pendingReview }) {
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    const fetchDoctor = async () => {
      const doctorDoc = await getDoc(
        doc(db, 'users', pendingReview.acceptingDoctorUid),
      )
      setDoctor(doctorDoc.data())
    }

    fetchDoctor()
  })

  return (
    <Flex
      backgroundColor={'gray.400'}
      minW={'fit-content'}
      w={'full'}
      rounded={'xl'}
      justify="left"
      py={10}
      px={5}
    >
      <Stack spacing={2} width={'100%'}>
        <Text fontSize={25} fontWeight={600}>
          {pendingReview?.title}
        </Text>
        <Text fontSize={15} fontWeight={500}>
          <b>Doctor:</b> {doctor?.firstName} {doctor?.lastName}
        </Text>
        <Flex justify={'center'}>
          <NextLink
            href={`/requests/${pendingReview.id}/create-review`}
            passHref
          >
            <Button marginTop={'30px'}>Create Review</Button>
          </NextLink>
        </Flex>
      </Stack>
    </Flex>
  )
}
