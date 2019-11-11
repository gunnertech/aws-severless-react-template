import { useEffect, useContext } from 'react';
import { Auth } from 'aws-amplify';
import { CurrentUserContext } from '../../Contexts/CurrentUser';

export default SignOut = ({navigation}) => {

  const currentUser = useContext(CurrentUserContext)

  useEffect(() => {
    !currentUser ? (
      navigation.popToTop()
    ) : (
      Auth.signOut()
    )
    
  }, [!!currentUser]);

  return (
    null
  )
}