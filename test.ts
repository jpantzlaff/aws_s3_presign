/// <reference lib="deno.ns" />

import {
  assertEquals,
} from 'https://deno.land/std@0.103.0/testing/asserts.ts'

import {
  encodeString,
  getSignedUrl,
  hmacSha256Hex,
  sha256
} from './mod.ts'

const date = new Date('Fri, 24 May 2013 00:00:00 GMT')

const baseTestOptions = {
  path: '/examplebucket/test.txt',
  region: 'us-east-1',
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  date,
}

Deno.test('calculates an SHA-256 digest', async () => {
  assertEquals(
    await sha256('sample text'),
    'bc658c641ef71739fb9995bded59b21150bbff4367f6e4e4c7934b489b9d2c00'
  )
})

Deno.test('calculates an HMAC SHA-256 signature', async () => {
  assertEquals(
    await hmacSha256Hex(
      encodeString('sample key'),
      'sample value'
    ),
    'c95d935bc17cec2e0d8f951fe5e0c63c6ef2eb5842a9ebac1a47fc22ac341877'
  )
})

Deno.test('creates a presigned URL', async () => {
  assertEquals(
    await getSignedUrl(baseTestOptions),
    [
      'https://s3.amazonaws.com/examplebucket/test.txt',
      '?X-Amz-Algorithm=AWS4-HMAC-SHA256',
      '&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20130524%2Fus-east-1%2Fs3%2Faws4_request',
      '&X-Amz-Date=20130524T000000Z',
      '&X-Amz-Expires=86400',
      '&X-Amz-SignedHeaders=host',
      '&X-Amz-Signature=733255ef022bec3f2a8701cd61d4b371f3f28c9f193a1f02279211d48d5193d7',
    ].join('')
  )
})

Deno.test('creates a presigned URL with a session token', async () => {
  assertEquals(
    await getSignedUrl({
      ...baseTestOptions,
      sessionToken: 'AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/LTo6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3zrkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtpZ3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
    }),
    [
      'https://s3.amazonaws.com/examplebucket/test.txt',
      '?X-Amz-Algorithm=AWS4-HMAC-SHA256',
      '&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20130524%2Fus-east-1%2Fs3%2Faws4_request',
      '&X-Amz-Date=20130524T000000Z',
      '&X-Amz-Expires=86400',
      '&X-Amz-Security-Token=AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT%2BFvwqnKwRcOIfrRh3c%2FLTo6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE%2FIvU1dYUg2RVAJBanLiHb4IgRmpRV3zrkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb%2FAXlzBBko7b15fjrBs2%2BcTQtpZ3CYWFXG8C5zqx37wnOE49mRl%2F%2BOtkIKGO7fAE',
      '&X-Amz-SignedHeaders=host',
      '&X-Amz-Signature=77cb31eed6fa73ec3a4bdeab05014a9e387d20e7bea4e132a15159451a73caea',
    ].join('')
  )
})
