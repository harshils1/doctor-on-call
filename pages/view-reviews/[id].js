import { useRouter } from 'next/router'

const Review = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>Post: {id}</p>
}

export default Review