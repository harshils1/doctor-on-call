import NextLink from 'next/link'
import { Flex, Button } from '@chakra-ui/react'

const NewRequest = () => {
  return (
    <Flex
      backgroundColor={'gray.200'}
      minW={'fit-content'}
      w={{ base: 'full', md: 80 }}
      rounded={'xl'}
      justify="center"
      maxH={170}
      alignItems={'center'}
    >
      <NextLink passHref href="/create-request">
        <Button
          _hover={{ backgroundColor: 'gray.500' }}
          backgroundColor={'black'}
          textColor="white"
        >
          Create Request
        </Button>
      </NextLink>
    </Flex>
  )
}

export default NewRequest
