import { useEffect, useState } from 'react'
import { useActionSheet } from '@expo/react-native-action-sheet'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Storage } from 'aws-amplify';
import ENV from '../environment';

//TODO: gunner-react


export default requestPhoto => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [photoData, setPhotoData] = useState(null);
  const [buttonIndex, setButtonIndex] = useState(null);
  const [hasPermissions, setHasPermissions] = useState(null);

  useEffect(() => {
    !requestPhoto && 
    photoData === 'cancelled' &&
    setPhotoData(null)
  }, [requestPhoto, JSON.stringify(photoData)])

  useEffect(() => {
    photoData === 'cancelled' &&
    setButtonIndex(null)
  }, [JSON.stringify(photoData)])

  useEffect(() => {
    buttonIndex === 0 ? (
      Permissions.askAsync(Permissions.CAMERA)
        .then(({status}) =>
          setHasPermissions(status === 'granted')    
        )
        .catch(e => console.log(e) || setHasPermissions(false))
    ) : buttonIndex === 1 ? (
      Constants.platform.ios ? (
        Permissions.askAsync(Permissions.CAMERA_ROLL)
          .then(({status}) =>
            setHasPermissions(status === 'granted')    
          )
          .catch(e => console.log(e) || setHasPermissions(false))
      ) : (
        setHasPermissions(true)
      )
    ) : buttonIndex === 2 ? (
      setPhotoData("cancelled")
    ) : (
      null
    )
  }, [buttonIndex]);

  useEffect(() => {
    hasPermissions === true ? (
      buttonIndex === 1 ? (
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          base64: true,
        })
          .then(result =>
            result.cancelled ? ([
              setButtonIndex(null),
              setPhotoData("cancelled"),
            ]) : ([
              setButtonIndex(null),
              setPhotoData(result)
            ])
          )
      ) : buttonIndex === 0 ? (
        ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          // aspect: [1, 1],
          quality: 1,
          base64: true,
        })
          .then(result => 
            result.cancelled ? ([
              setButtonIndex(null),
              setPhotoData("cancelled"),
            ]) : ([
              setButtonIndex(null),
              setPhotoData(result)
            ])
          )
      ) : buttonIndex === 2 ? (
        setPhotoData("cancelled")
      ) : (
        null
      )
    ) : hasPermissions === false ? ([
      alert('Sorry, we need camera roll permissions to make this work!'),
      setPhotoData("cancelled")
    ]) : (
      null
    )
  }, [buttonIndex, hasPermissions])

  useEffect(() => {
    !!requestPhoto &&
    showActionSheetWithOptions(
      {
        options: ['Camera', 'Album', 'Cancel'],
        destructiveButtonIndex: 2 
      },
      buttonIndex => setButtonIndex(buttonIndex)
    )
  }, [requestPhoto]);

  useEffect(() => {
    !!(photoData||{}).uri &&
    !/https/.test(photoData.uri) &&
    Promise.resolve(photoData.uri.match(/\.gif$/) ? 'gif' : photoData.uri.match(/\.gif$/) ? 'png' : 'jpeg')
      .then(fileType =>
        Storage.put(`${(new Date().getTime()).toString()}.${fileType}`, new Buffer(photoData.base64, 'base64'), {
          contentType: `image/${fileType}`
        })
        .then(({key}) => Storage.get(key))
        .then(url => url.replace(/^.+\.s3\.amazonaws\.com/,`https://${ENV.cdn}`).split("?")[0])
        .then(url => setPhotoData({
          ...photoData,
          uri: url
        }))
      )
      .catch( (err) => { 
        console.log(err);
      });
  }, [(photoData||{}).uri]);

  return photoData;
}