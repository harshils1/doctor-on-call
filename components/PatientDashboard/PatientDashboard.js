import { Text, Heading, Flex, Stack, Wrap } from '@chakra-ui/react'
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
        <Wrap justify={{ base: 'center', md: 'left' }} spacing={5}>
          <NewRequest />
          <Wrap spacing={5}>
            <PendingRequests user={user} />
            <LocalDoctors user={user} />
          </Wrap>
        </Wrap>
      </Stack>
    </Flex>
  )
}

export default PatientDashboard
