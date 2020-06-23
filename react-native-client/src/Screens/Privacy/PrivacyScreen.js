import React from 'react';
import { ScrollView, Linking, View } from 'react-native';
import { Text } from 'react-native-elements'
import { SafeAreaConsumer } from 'gunner-react';

// import HTML from 'react-native-render-html';
// import { Header } from 'react-native-elements'

import Container from '../../Components/Container';
import useAnalyticsPageHit from 'Hooks/useAnalyticsPageHit';


export default () => {
  useAnalyticsPageHit('Privacy');
  return (
    <SafeAreaConsumer>
      { insets => 
        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: insets.top, paddingBottom: insets.bottom }}>
          <Text h4>Privacy Policy</Text>
          <Text style={{marginBottom: 4}}>Gunner Technology built the PropSwap app as a Free app. This SERVICE is provided by Gunner Technology at no cost and is intended for use as is.</Text>
          <Text style={{marginBottom: 4}}>This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.</Text>
          <Text style={{marginBottom: 4}}>If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</Text>
          <Text style={{marginBottom: 4}}>The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at PropSwap unless otherwise defined in this Privacy Policy.</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Information Collection and Use</Text>

          <Text style={{marginBottom: 4}}>For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to None. The information that we request will be retained by us and used as described in this privacy policy.</Text>
          <Text style={{marginBottom: 4}}>The app does use third party services that may collect information used to identify you.</Text>
          <Text style={{marginBottom: 4}}>Link to privacy policy of third party service providers used by the app</Text>

          <Text style={{color: 'blue'}} onPress={()=> Linking.openURL(`https://www.google.com/policies/privacy/`).catch((err) => console.error('An error occurred', err)) }>Google Play Services</Text>
          <Text style={{color: 'blue'}} onPress={()=> Linking.openURL(`https://firebase.google.com/policies/analytics`).catch((err) => console.error('An error occurred', err)) }>Firebase Analytics</Text>

          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Log Data</Text>
          
          <Text style={{marginBottom: 4}}>We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Cookies</Text>
          <Text style={{marginBottom: 4}}>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</Text>
          <Text style={{marginBottom: 4}}>This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Service Providers</Text>
          
          <Text style={{marginBottom: 4}}>We may employ third-party companies and individuals due to the following reasons:</Text>

          <Text style={{marginBottom: 4}}>* To facilitate our Service;</Text>
          <Text style={{marginBottom: 4}}>* To provide the Service on our behalf;</Text>
          <Text style={{marginBottom: 4}}>* To perform Service-related services; or</Text>
          <Text style={{marginBottom: 4}}>* To assist us in analyzing how our Service is used.</Text>

          <Text style={{marginBottom: 4}}>We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Security</Text>
          <Text style={{marginBottom: 4}}>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Links to Other Sites</Text>

          <Text style={{marginBottom: 4}}>This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Children’s Privacy</Text>
          <Text style={{marginBottom: 4}}>These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Changes to This Privacy Policy</Text>
          <Text style={{marginBottom: 4}}>We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.</Text>
          
          <Text style={{fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Contact Us</Text>
          <Text style={{marginBottom: 4}}>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</Text>
          <Text style={{marginBottom: 4}}>This privacy policy page was created at&nbsp;
              <Text style={{color: 'blue'}}  onPress={()=> Linking.openURL(`https://privacypolicytemplate.net`).catch((err) => console.error('An error occurred', err)) }>privacypolicytemplate.net</Text> 
              &nbsp;and modified/generated by&nbsp;
              <Text style={{color: 'blue'}}  onPress={()=> Linking.openURL(`https://app-privacy-policy-generator.firebaseapp.com/`).catch((err) => console.error('An error occurred', err)) }>App Privacy Policy Generator</Text>
          </Text>
          <View style={{marginBottom: 64}} />
        </ScrollView>
      }
    </SafeAreaConsumer>
  )
}