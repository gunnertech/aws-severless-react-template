import { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import * as ExpoDevice from 'expo-device';


/* Custom imports go here*/
import User from "../api/User"
import Device from "../api/Device"

/* Custom imports end here */

const useNotificationPermissions = currentUser => {
  const [gavePermission, setGavePermission] = useState(null);
  const [token, setToken] = useState(null);
  const type = Platform.OS === 'ios' ? 'APNS' : 'GCM';

  const [createDevice, { error: createError }] = useMutation(Device.mutations.create, {
    variables: { input: {
      token,
      type
    }}
  })

  !!createError && console.log(createError)

  const {error: listError, data: {listDevicesByTokenAndType: {items: devices} = {}} = {}} = useQuery(Device.queries.listByTokenAndType, {
    skip: !token,
    variables: {
      token,
      type: {
        eq: type
      }
    }
  })

  !!listError && console.log(listError)
  
  useEffect(() => {
    console.log("ExpoDevice.isDevice", ExpoDevice.isDevice)
    !!currentUser?.id &&
    ExpoDevice.isDevice &&
    Permissions.askAsync(Permissions.NOTIFICATIONS)
      .then(({ status }) =>
        console.log("status", status) ||
        setGavePermission(status === 'granted')
      )
      .catch(e => 
        console.log(e) ||
        setGavePermission(false)
      )
  }, [currentUser?.id, ExpoDevice.isDevice]);

  useEffect(() => {
    console.log("gavePermission", gavePermission) ||
    !!gavePermission &&
    Notifications.getExpoPushTokenAsync()
      .then(token => setToken(token))
      .catch(e => console.log(e) || setToken(null))
  }, [gavePermission]);

  useEffect(() => {
    !!token &&
    !!devices &&
    !devices.find(device => device.token === token) &&
    createDevice()
  }, [token, !!devices]);

  

  return gavePermission;
}


export default useNotificationPermissions;