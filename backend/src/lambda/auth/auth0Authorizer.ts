import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import Axios from 'axios'

import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const jwksUrl = 'https://dev-3ag6nabvb85ne8fo.us.auth0.com/.well-known/jwks.json'


export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  const result = await Axios.get(jwksUrl)
  const keys = result.data.keys

  const signingKey = keys.find(key => key.kid === jwt.header.kid) 

  if(!signingKey)
    throw new Error('Invalid signing key')

  const cert = signingKey.x5c[0]
  const certificate = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`

  const verfiedToken = verify(token, certificate, {algorithms: ['RS256']}) as JwtPayload

  return verfiedToken 
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
