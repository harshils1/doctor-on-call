import NextLink from 'next/link'
import { Flex, Button } from '@chakra-ui/react'

const ViewProfile = ({ user }) => {
  return (
    <Flex
      backgroundColor={'gray.200'}
      minW={'fit-content'}
      w={{ base: 'full', md: 80 }}
      rounded={'xl'}
      justify="center"
      maxH={170}
      alignItems={'center'}
      p={5}
    >
      <NextLink passHref href={`/doctors/${user['uid']}`}>
        <Button
          _hover={{ backgroundColor: 'gray.500' }}
          backgroundColor={'black'}
          textColor="white"
        >
          View Public Profile
        </Button>
      </NextLink>
    </Flex>
  )
}

export default ViewProfile
