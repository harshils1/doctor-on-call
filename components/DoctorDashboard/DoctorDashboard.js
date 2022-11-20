import {
  Text,
  Heading,
  Stack,
  Flex,
  Wrap,
  WrapItem,
  Center,
} from '@chakra-ui/react'
import PendingRequests from './PendingRequests'
import ViewProfile from './ViewProfile'

const DoctorDashboard = ({ user }) => {
  return (
    <Flex
      flexDir={'column'}
      minH={'100vh'}
      px={{ base: 10, md: 20 }}
      pt={20}
      bg={'gray.50'}
    >
      <Stack spacing={20}>
        <Heading>Hello {user['firstName']}.</Heading>
        <Wrap justify={'center'} spacing={10}>
          <ViewProfile user={user} />
          <PendingRequests user={user} />
        </Wrap>
      </Stack>
    </Flex>
  )
}

export default DoctorDashboard
