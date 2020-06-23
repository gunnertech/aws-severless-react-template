import { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import useAnalyticsPageHit from 'Hooks/useAnalyticsPageHit';

export default ({navigation}) => {

  useAnalyticsPageHit("SignOut");

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      Auth.signOut()
        // .then(() => navigation.navigate("Home"))
        // .catch(() => navigation.navigate("Home"))
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log("focus")
    });

    return () => [unsubscribeBlur(), unsubscribeFocus()];
  }, [navigation]);

  return (
    null
  )
}