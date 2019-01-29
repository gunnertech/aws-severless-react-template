import { pipe, ifElse } from 'ramda'

const normalizePhoneNumber = phoneNumber =>
  pipe(
    phoneNumber => phoneNumber.replace(/\D/,""),
    ifElse(
      phoneNumber => phoneNumber.length === 10,
      phoneNumber => `+1${phoneNumber}`,
      ifElse(
        phoneNumber => phoneNumber.length > 10,
        phoneNumber => `+${phoneNumber}`,
        phoneNumber => null
       )
    )
  )(phoneNumber)
  
  export default normalizePhoneNumber;