import NextLink from 'next/link'
import { Flex, Button, Text } from '@chakra-ui/react'

const PendingRequest = ({ pendingRequest }) => {
  return (
    <Flex
      backgroundColor={'gray.400'}
      minW={'fit-content'}
      w={{ base: 'full', md: 80 }}
      rounded={'xl'}
      justify="center"
      py={10}
    >
      <Text fontSize={20} fontWeight={600}>
        {pendingRequest['dateCreated']}
      </Text>
    </Flex>
  )
}

export default PendingRequest
