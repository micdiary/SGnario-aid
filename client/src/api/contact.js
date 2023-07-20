import { requestPost } from '../utils/request'
import { CONTACT_API } from '../constants.js'

export async function contactUsEmail(req) {
  return requestPost(CONTACT_API, { req })
}
