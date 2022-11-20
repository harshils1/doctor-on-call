import { Text, Heading, Flex, Stack } from '@chakra-ui/react'
import NewRequest from './NewRequest'
import PendingRequests from './PendingRequests'
import LocalDoctors from './LocalDoctors'

const PatientDashboard = ({ user }) => {
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
        <Stack direction={{ base: 'column', md: 'row' }} spacing={10}>
          <NewRequest />
          <PendingRequests user={user} />
          <LocalDoctors user={user} />
        </Stack>
      </Stack>
    </Flex>
  )
}

export default PatientDashboard
