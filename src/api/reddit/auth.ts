import { fetchJson } from '../../utils'

// Change this to your own client ID: https://www.reddit.com/prefs/apps
// The app NEEDS TO BE an installed app and NOT a web app

const clientID = "9umhhai8Bd3u3wh69U2dZw"

// Token for reddit API
let token: string | undefined, tokenExpiresMS = 0, tokenPromise: Promise<{ access_token: string, expires_in: string }> | undefined

// TODO: respect login API limits?
const getToken = async (): Promise<string> => {
  // We have already gotten a token
  if (token && tokenExpiresMS > Date.now())
    return token

  // We are already waiting to get a token
  if (tokenPromise)
    return (await tokenPromise).access_token

  // Headers for getting reddit api token
  const tokenInit: RequestInit = {
    headers: {
      Authorization: `Basic ${window.btoa(`${clientID}:`)}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    method: 'POST',
    body: `grant_type=${encodeURIComponent('https://oauth.reddit.com/grants/installed_client')}&device_id=DO_NOT_TRACK_THIS_DEVICE`
  }

  tokenPromise = fetchJson<{ access_token: string, expires_in: string }>('https://www.reddit.com/api/v1/access_token', tokenInit)
  try {
    const response = await tokenPromise
    tokenExpiresMS = Date.now() + 1000 * (parseInt(response.expires_in) - 10)
    token = response.access_token
  } catch (error) {
    console.error('reddit.getToken ->')
    throw error
  } finally {
    tokenPromise = undefined
  }
  return token
}

// Get header for general api calls
export const getAuth = async (): Promise<{ headers: { Authorization: string } }> => {
  const token = await getToken()
  return {
    headers: {
      Authorization: `bearer ${token}`
    }
  }
}