import { useEffect } from 'react'

import useShouldUpdateCurrentUser from '../Hooks/useShouldUpdateCurrentUser'

const CurrentUserUpdater = ({onUpdate, currentUser}) => {
  const shouldUpdateCurrentUser = useShouldUpdateCurrentUser(currentUser);

  useEffect(() => {
    !!shouldUpdateCurrentUser && onUpdate(shouldUpdateCurrentUser)
  }, [shouldUpdateCurrentUser])

  return (
    null
  )
}

export default CurrentUserUpdater;